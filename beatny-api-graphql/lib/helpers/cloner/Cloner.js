/**
 * An Object cloner
 * @abstract
 */
export default class Cloner {
  /**
   * Deeply clone an object
   * @param {Object} data
   * @returns {Object}
   */
  static clone(data) {
    return JSON.parse(JSON.stringify(data))
  }
}
