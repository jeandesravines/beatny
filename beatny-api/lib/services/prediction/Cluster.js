/**
 * A prediction Cluster ok Tracks
 */
export default class Cluster {
  /**
   * @const
   * @type {number[]}
   */
  centroid

  /**
   * @var
   * @type {number[]}
   */
  indexes = []

  /**
   * @var
   * @type {number[][]}
   */
  data = []

  /**
   * @var
   * @type {number[]}
   */
  distances = []

  /**
   * @param {number[]} centroid
   */
  constructor(centroid) {
    this.centroid = centroid
  }
}
