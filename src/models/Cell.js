// src/models/Cell.js
class Cell {
  constructor() {
    this.occupiedBy = null;
  }

  /** @returns {boolean} */
  isOccupied() {
    return this.occupiedBy !== null;
  }

  /**
   * @param {string} pieceId
   */
  occupy(pieceId) {
    this.occupiedBy = pieceId;
  }

  clear() {
    this.occupiedBy = null;
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.occupiedBy || '.';
  }
}

module.exports = Cell;
