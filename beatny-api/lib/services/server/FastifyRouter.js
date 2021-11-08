import _ from 'lodash'

/**
 *
 */
export default class FastifyRouter {
  /**
   * Allowed HTTP methods
   * @private
   * @const
   * @type {string[]}
   */
  static allowedMethods = ['delete', 'get', 'head', 'options', 'patch', 'put', 'post']

  /**
   * @param {Object} route
   * @param {Object} api
   * @param {Object} api.components
   * @param {Object} api.components.securitySchemes
   * @returns {boolean}
   */
  static isEndpointSecured(route, api) {
    const { securitySchemes } = api.components
    const bearerKey = _.findKey(securitySchemes, { scheme: 'bearer' })

    return _.some(route.security, value => Object.keys(value)[0] === bearerKey)
  }

  /**
   * @param {Object} middlewareEntry
   * @param {Object<Class<Middleware>>} middlewares
   * @returns {Function}
   */
  static getMiddlewareHandler(middlewareEntry, middlewares) {
    const [name, args] = Object.entries(middlewareEntry)[0]
    const middlewareName = `${_.upperFirst(name)}Middleware`
    const middleware = middlewares[middlewareName]

    return middleware.middleware(args)
  }

  /**
   * @param {Object} route
   * @param {Array} [route.x-middlewares]
   * @param {Object} api
   * @param {Object<Class<Middleware>>} middlewares
   * @returns {Function[]}
   */
  static getMiddlewares(route, api, middlewares) {
    return (this.isEndpointSecured(route, api) ? [{ auth: true }] : [])
      .concat(route['x-middlewares'] || [])
      .map(entry => this.getMiddlewareHandler(entry, middlewares))
  }

  /**
   *
   * @param {Object} route
   * @param {Object} api
   * @param {Object<Class<Middleware>>} middlewares
   * @returns {(Function|undefined)}
   */
  static getPreHandler(route, api, middlewares) {
    const handlers = this.getMiddlewares(route, api, middlewares)

    if (handlers.length === 0) {
      return undefined
    }

    return (req, reply) =>
      handlers.reduce(
        (deferred, handler) => deferred.then(() => handler(req, reply)),
        Promise.resolve()
      )
  }

  /**
   * Create the request handler
   * @param {string} operationId
   * @param {Object<Class<Controller>>} controllers
   * @returns {function(Object): *}
   */
  static getMethod(operationId, controllers) {
    const [controllerName, handlerName] = operationId.split('.')
    const controller = controllers[controllerName]

    if (!controller[handlerName]) {
      throw new Error(`${controllerName}.${handlerName} doesn't exists`)
    }

    const handler = controller[handlerName].bind(controller)

    return this.handle.bind(this, handler)
  }

  /**
   * Get all routes and their options for fastify
   * @param {Object} params
   * @param {Object} params.api
   * @param {Object<Class<Controller>>} params.controllers
   * @param {Object<Class<Middleware>>} params.middlewares
   * @returns {{
   *   handler: function(Object): *,
   *   schema: Object,
   *   url: string,
   *   method: string,
   *   preHandler: ?function(req, reply)
   * }[]}
   */
  static getRoutes(params) {
    const { api, controllers, middlewares } = params
    const urlParamRegExp = /\{(\w+)\}/g

    return _.flatMap(api.paths, (pathOptions, path) => {
      const endpoints = _.pick(pathOptions, FastifyRouter.allowedMethods)
      const url = path.replace(urlParamRegExp, ':$1')

      return _.map(endpoints, (endpoint, method) => {
        const handler = this.getMethod(endpoint.operationId, controllers)
        const preHandler = this.getPreHandler(endpoint, api, middlewares)
        const schema = this.getSchema(endpoint, pathOptions, api)

        return {
          handler,
          schema,
          url,
          preHandler,
          method: method.toUpperCase()
        }
      })
    })
  }

  /**
   * Get the merged schema
   * @param {Object} endpoint
   * @param {Object} parent
   * @param {Object} api
   * @returns {{
   *   body: Object,
   *   headers: Object,
   *   response: Object
   * }}
   */
  static getSchema(endpoint, parent, api) {
    return _.merge(
      this.getSchemaParameters(endpoint, parent),
      this.getSchemaSecurityHeaders(endpoint, api),
      this.getSchemaBody(endpoint),
      this.getSchemaResponse(endpoint)
    )
  }

  /**
   * Get the schema's body
   * @param {Object} endpoint
   * @param {(Object|null)} endpoint.requestBody
   * @returns {{
   *   body: ?Object
   * }}
   */
  static getSchemaBody(endpoint) {
    const { requestBody } = endpoint
    const content = requestBody?.content

    if (!content) {
      return {}
    }

    const types = ['application/json', 'application/x-www-form-urlencoded']
    const body = types.map(type => content[type]?.schema).find(value => value)

    return { body }
  }

  /**
   * Get the schema's parameters
   * @param {Object} endpoint
   * @param {(Object|null)} endpoint.parameters
   * @param {Object} parent
   * @returns {{
   *   body: ?Object,
   *   headers: Object,
   *   params: Object,
   *   querystring: Object
   * }}
   */
  static getSchemaParameters(endpoint, parent) {
    const schemaParameters = {
      body: { type: 'object', properties: {}, required: [] },
      querystring: { type: 'object', properties: {}, required: [] },
      params: { type: 'object', properties: {}, required: [] },
      headers: { type: 'object', properties: {}, required: [] }
    }

    const mapping = {
      body: schemaParameters.body,
      header: schemaParameters.headers,
      path: schemaParameters.params,
      query: schemaParameters.querystring
    }

    const routeParameters = endpoint.parameters || []
    const parentParameters = parent.parameters || []
    const parameters = routeParameters.concat(parentParameters)

    parameters.forEach(parameter => {
      const { name, required, schema } = parameter
      const target = mapping[parameter.in]

      target.properties[name] = schema

      if (required) {
        target.required.push(name)
      }
    })

    return _.pickBy(schemaParameters, ({ properties }) => {
      return Object.keys(properties).length > 0
    })
  }

  /**
   * Get the schema's responses
   * @param {Object} endpoint
   * @param {(Object|null)} endpoint.responses
   * @returns {{
   *   response
   * }}
   */
  static getSchemaResponse(endpoint) {
    const { responses } = endpoint
    const values = _.mapValues(responses, value => _.get(value, 'content.application/json.schema'))
    const response = _.pickBy(values)

    return { response }
  }

  /**
   * Get the schema's security headers
   * @param {Object} endpoint
   * @param {(Object|null)} endpoint.security
   * @param {Object} api - the OpenAPI file content
   * @returns {{
   *   headers: Object
   * }}
   */
  static getSchemaSecurityHeaders(endpoint, api) {
    const { security } = endpoint
    const headers = { type: 'object', properties: {}, required: [] }
    const schemes = api.components.securitySchemes

    _.forEach(security, value => {
      const key = Object.keys(value)[0]
      const component = schemes[key]
      const scheme = component.bearerFormat || component.scheme
      const headerKey = component.name || 'authorization'
      const property = {
        type: 'string',
        regexp: null
      }

      if (scheme) {
        property.regexp = { pattern: `${scheme} .+`, flag: 'i' }
      }

      headers.required.push(headerKey)
      headers.properties[headerKey] = property
    })

    return { headers }
  }

  /**
   * Handle the request
   * @param {function(Object): *} handler
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   * @returns {Promise<*>}
   */
  static async handle(handler, request, reply) {
    const body = await handler(Object.assign(request, { request, reply }))
    const sent = reply.sent || reply.res.headersSent

    if (sent) {
      return undefined
    }

    return body || reply.send()
  }
}
