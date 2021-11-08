import mongoose from 'mongoose'

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

/**
 * A Model factory
 */
export default class ModelFactory {
  /**
   * Prepare a mongoose.Schema and apply it to a new mongoose.ModelFactory
   * This method returns null of no collection name is given
   * @param {string|null} name
   * @param {Mongoose.Schema} schema
   * @returns {Mongoose.Model|null}
   */
  static create(name, schema) {
    schema.set('minimize', false)
    schema.set('timestamps', true)
    schema.set('versionKey', false)

    return name ? mongoose.model(name, schema) : null
  }
}
