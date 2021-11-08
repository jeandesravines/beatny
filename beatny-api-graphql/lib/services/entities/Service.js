import mongoose from 'mongoose'
import _ from 'lodash'
import * as configuration from '../../configuration'
import MongooseError from '../../errors/mongoose/MongooseError'
import DotNotation from '../../helpers/dot-notation/DotNotation'
import Logger from '../logger/Logger'

/* eslint-disable no-underscore-dangle */

/**
 * Model's service
 * @template {Object<Model>}
 * @abstract
 * @extends mongoose.Model
 */
export default class Service extends mongoose.Model {
  /**
   * Query filters
   * @private
   * @const
   * @type {Object<Function(mongoose.Query, *): mongoose.Query}
   */
  static filters = {
    limit: (q, value) => q.limit(value),
    near: (q, { path, ...value }) => q.near(path, { ...value, spherical: true }),
    populate: (q, value) => value.reduce((acc, p) => q.populate(p), q),
    select: (q, value) => q.select(value),
    skip: (q, value) => q.skip(value),
    sort: (q, value) => q.sort(value)
  }

  /**
   * Call a hook for each documents
   * @private
   * @param {string} hook
   * @param {Model} document
   * @returns {Promise<Model>}
   */
  static async handleHook(hook, document) {
    if (this[hook]) {
      await this[hook](document)
    }

    return document
  }

  /**
   * Return a mongoose.ObjectId by casting a string or the id at the first level
   * of an object
   * @private
   * @param {{ id: string } | string} id
   * @returns {mongoose.Types.ObjectId}
   * @example
   *  getObjectId({ id: '000000000000000000000001' })
   *  getObjectId('000000000000000000000001')
   */
  static getObjectId(id) {
    const value = id.id || id
    const ObjectId = mongoose.Types.ObjectId

    if (!value) {
      throw new MongooseError({
        message: `ObjectId must be constructed with a String. Given: ${value}`
      })
    }

    return value instanceof ObjectId ? value : new ObjectId(value)
  }

  /**
   * Throw a MongooseError
   * @private
   * @param {Error} error
   * @returns {void}
   * @throws {MongooseError}
   */
  static catch(error) {
    throw new MongooseError(error)
  }

  /**
   * Transform the data from the DB to the server
   * @private
   * @param {Object|null} data - the original data
   * @param {Object|Array} [schema]
   * @returns {Object|null}
   */
  static denormalize(data) {
    if (_.isNil(data)) {
      return null
    }

    return _.transform(data, (acc, value, key) => {
      switch (true) {
        case key === '_id':
          acc.id = value?.toHexString?.() || value
          break

        case value instanceof mongoose.Types.ObjectId:
          acc[key] = value.toHexString()
          break

        case value instanceof Date:
          acc[key] = value.getTime()
          break

        case _.isArray(value) || _.isPlainObject(value):
          acc[key] = this.denormalize(value)
          break

        default:
          acc[key] = value
          break
      }
    })
  }

  /**
   * Transform local data from the server to the DB
   * @private
   * @param {Object|Array} data
   * @param {Object|Array} [schema]
   * @returns {Object|Array}
   */
  static normalize(data, schema = this.schema) {
    return _.transform(schema.tree || schema, (acc, definition, key) => {
      const { type } = definition
      const value = data[key]

      switch (true) {
        case key === '_id' && Boolean(data.id):
          acc._id = this.getObjectId(data.id)
          break

        case !type || typeof value === 'undefined':
          break

        case type === mongoose.Schema.Types.ObjectId:
          acc[key] = this.getObjectId(value)
          break

        case _.isArray(type):
          acc[key] = _.isPlainObject(value[0])
            ? value.map(v => this.normalize(v, type[0]))
            : value.flatMap(v => this.normalize([v], type))
          break

        case _.isArray(type.coordinates):
          acc[key] = { type: 'Point', coordinates: value }
          break

        case _.isPlainObject(value):
          acc[key] = this.normalize(value, type)
          break

        default:
          acc[key] = value
          break
      }
    })
  }

  /**
   * Normalize a query to the database
   * @private
   * @param {Object} value
   * @returns {Object}
   */
  static normalizeQuery(value) {
    const object = DotNotation.toObject(value)
    const normalized = this.normalize(object)
    const paths = DotNotation.toPaths(normalized)

    return paths
  }

  /**
   * Transform the data from the server to the DB
   * @param {Object} value
   * @returns {Object}
   */
  static normalizeData(value) {
    const normalized = this.normalize(value)
    const paths = DotNotation.toPaths(normalized)

    return paths
  }

  /**
   * Get the number of element which should returns the where
   * @protected
   * @param {Object} where
   * @param {Object} [filter]
   * @returns {Promise<number>}
   */
  static async countBy(where, filter) {
    return this.getQuery(where, filter)
      .countDocuments({})
      .catch(error => this.catch(error))
  }

  /**
   * Create a document
   * @protected
   * @param {Object} data
   * @returns {Promise<Model>}
   */
  static async createOne(data) {
    const normalized = this.normalizeData(data)

    return this.create(normalized).catch(error => this.catch(error))
  }

  /**
   * Delete the model
   * @protected
   * @param {Model} entity
   * @returns {Promise<Model|null>}
   */
  static async deleteOne(entity) {
    return this.deleteOneBy({ id: entity.id })
  }

  /**
   * Delete the first document targeted by the query
   * @protected
   * @param {Object} where
   * @param {Object} [filter]
   * @returns {Promise<Model|null>}
   */
  static async deleteOneBy(where, filter) {
    return this.getQuery(where, filter)
      .findOneAndDelete({})
      .then(document => this.denormalize(document))
      .then(document => this.handleHook('onPostRemove', document))
      .catch(error => this.catch(error))
  }

  /**
   * Delete all documents targeted by the query
   * @protected
   * @param {Object} where
   * @param {Object} [filter]
   * @returns {Promise<Model[]>}
   */
  static async deleteManyBy(where, filter) {
    const documents = await this.findManyBy(where, filter)

    await this.getQuery(where, filter)
      .deleteMany()
      .catch(error => this.catch(error))

    return documents
  }

  /**
   * Find one document matching the query
   * @protected
   * @param {Object} where
   * @param {Object} [filter]
   * @returns {Promise<Model|null>}
   */
  static async findOneBy(where, filter) {
    return this.getQuery(where, filter)
      .findOne({})
      .then(document => this.denormalize(document))
      .catch(error => this.catch(error))
  }

  /**
   * Find all documents matching the query
   * @protected
   * @param {Object} where
   * @param {Object} [filter]
   * @returns {Promise<Model[]>}
   */
  static async findManyBy(where, filter) {
    return this.getQuery(where, filter)
      .find({})
      .then(documents => documents.map(document => this.denormalize(document)))
      .catch(error => this.catch(error))
  }

  /**
   * Check if all query keys match with a defined index
   * @param {Object} where
   * @returns {void}
   */
  static checkQueryIndexes(where) {
    const keys = Object.keys(where)
    const isCompliant = this.schema._indexes
      .map(([refs]) => Object.keys(refs))
      .concat(['_id'])
      .some(group => keys.every(key => group.includes(key)))

    if (!isCompliant) {
      Logger.warn(`${this.modelName}'s schema should contains an index containing: [${keys}]`)
    }
  }

  /**
   * Create a query
   * @private
   * @param {Object} where
   * @param {{
   *   limit: ?number,
   *   near: ?{ path: string, center: number[], maxDistance: number },
   *   populate: ?Array<string>,
   *   select: ?string,
   *   skip: ?number,
   *   sort: ?Object<('asc'|'desc')>
   * }} [filter]|
   * @returns {mongoose.Query}
   */
  static getQuery(where, filter) {
    const predicate = this.normalizeQuery(where)
    const query = this.where(predicate).lean()

    if (configuration.mongoose.debug) {
      this.checkQueryIndexes(predicate)
    }

    if (!filter) {
      return query
    }

    return _.reduce(filter, (q, value, name) => Service.filters[name](q, value), query)
  }

  /**
   * Save the entity
   * @param {Object} entity
   * @param {Object} [filter] - only used for update
   * @returns {Promise<Model>}
   */
  static async saveOne(entity, filter) {
    return entity.id ? this.updateOne(entity, entity, filter) : this.createOne(entity)
  }

  /**
   * Save many entities.
   * Update (or save) many entities independently according to the given paths
   * @protected
   * @param {String[]} paths
   * @param {Object[]} entities
   * @returns {Promise<Model[]>}
   */
  static async saveManyBy(paths, entities) {
    const getWhere = entity => _.reduce(paths, (acc, k) => ({ ...acc, [k]: _.get(entity, k) }), {})
    const deferred = entities.map(entity => this.updateOneBy(getWhere(entity), entity))

    return Promise.all(deferred)
  }

  /**
   * Update all entities with match with the given condition
   * @param {Object} where
   * @param {Object} data
   * @returns {Promise<Model[]>}
   */
  static async updateManyBy(where, data) {
    const docuements = await this.findManyBy(where)
    const deferred = docuements.map(document => this.updateOne(document, data))

    return Promise.all(deferred)
  }

  /**
   * Update the given document
   * @param {Object} entity
   * @param {Object} data
   * @param {Object} [filter]
   * @returns {Promise<Model>}
   */
  static async updateOne(entity, data, filter) {
    return this.updateOneBy({ id: entity.id }, data, filter)
  }

  /**
   * Update the first document witch matches with the condition
   * and return a new Model containing the old data merged with the new
   * @protected
   * @param {Object} where
   * @param {Object} data
   * @param {Object} [filter]
   * @returns {Promise<(Model|void)>}
   */
  static async updateOneBy(where, data, filter) {
    const normalized = this.normalizeData(data)
    const options = {
      new: true,
      omitUndefined: true,
      upsert: true,
      setDefaultsOnInsert: true
    }

    return this.getQuery(where, filter)
      .findOneAndUpdate({}, normalized, options)
      .then(document => this.denormalize(document))
      .catch(error => this.catch(error))
  }
}
