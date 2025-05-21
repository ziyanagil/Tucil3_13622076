// src/models/Board.js
const Cell = require('./Cell');

class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.pieces = new Map();
    this.primaryPiece = null;
    this.exitPosition = null;

    for (let y = 0; y < height; y++) {
      this.grid[y] = Array.from({ length: width }, () => new Cell());
    }
  }

  placePiece(piece) {
    if (piece.isPrimary) this.primaryPiece = piece;
    this.pieces.set(piece.id, piece);
    for (const [x, y] of piece.getCells()) {
      if (this._inside(x, y)) {
        this.grid[y][x].occupy(piece.id);
      }
    }
  }

  setExit(x, y) {
    const valid =
      x === -1 || x === this.width || y === -1 || y === this.height ||
      (x >= 0 && x < this.width && (y === 0 || y === this.height - 1)) ||
      (y >= 0 && y < this.height && (x === 0 || x === this.width - 1));
    if (!valid) {
      throw new Error('Exit must be on or just outside board edge');
    }
    this.exitPosition = { x, y };
  }

  _inside(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  isExit(x, y) {
    return this.exitPosition.x === x && this.exitPosition.y === y;
  }

  isValidMove(id, dir) {
    const p = this.pieces.get(id);
    if (!p) return false;
    if ((dir === 'up' || dir === 'down') && p.orientation !== 'vertical') return false;
    if ((dir === 'left' || dir === 'right') && p.orientation !== 'horizontal') return false;
    for (const [nx, ny] of p.getNewCellsAfterMove(dir)) {
      if (p.isPrimary && this.isExit(nx, ny)) return true;
      if (!this._inside(nx, ny)) return false;
      const cell = this.grid[ny][nx];
      if (cell.isOccupied() && cell.occupiedBy !== id) return false;
    }
    return true;
  }

  movePiece(id, dir) {
    if (!this.isValidMove(id, dir)) return false;
    const p = this.pieces.get(id);
    for (const [x, y] of p.getCells()) {
      if (this._inside(x, y)) this.grid[y][x].clear();
    }
    p.move(dir);
    for (const [x, y] of p.getCells()) {
      if (this._inside(x, y)) this.grid[y][x].occupy(p.id);
    }
    return true;
  }

  isAtExit() {
    const P = this.primaryPiece;
    if (!P) return false;
    let target;
    if (P.orientation === 'horizontal') {
      const cols = P.getCells().map(([x]) => x);
      const maxX = Math.max(...cols), minX = Math.min(...cols);
      target = (this.exitPosition.x > this.width - 1)
        ? [maxX + 1, P.getCells()[0][1]]
        : [minX - 1, P.getCells()[0][1]];
    } else {
      const rows = P.getCells().map(([,y]) => y);
      const maxY = Math.max(...rows), minY = Math.min(...rows);
      target = (this.exitPosition.y > this.height - 1)
        ? [P.getCells()[0][0], maxY + 1]
        : [P.getCells()[0][0], minY - 1];
    }
    return target[0] === this.exitPosition.x && target[1] === this.exitPosition.y;
  }

  isSolved() {
    return this.isAtExit();
  }

  clone() {
    const b = new Board(this.width, this.height);
    b.setExit(this.exitPosition.x, this.exitPosition.y);
    this.pieces.forEach(p => b.placePiece(p.clone()));
    return b;
  }

  toString() {
    const rows = [];
    for (let y = 0; y < this.height; y++) {
      rows[y] = this.grid[y]
        .map(cell => cell.isOccupied() ? cell.occupiedBy : '.')
        .join('');
    }
    const { x: ex, y: ey } = this.exitPosition;
    if (ey === -1) {
      const row = Array(this.width).fill(' '); row[ex] = 'K';
      rows.unshift(row.join(''));
    }
    else if (ey === this.height) {
      const row = Array(this.width).fill(' '); row[ex] = 'K';
      rows.push(row.join(''));
    }
    else if (ex === -1) {
      rows[ey] = 'K' + rows[ey];
      for (let y = 0; y < this.height; y++) {
        if (y !== ey) rows[y] = ' ' + rows[y];
      }
    }

    else if (ex === this.width) {
      rows[ey] = rows[ey] + 'K';
    }
    return rows.join('\n');
  }

  getPossibleMoves() {
    const moves = [];
    ['up','down','left','right'].forEach(dir => {
      for (const id of this.pieces.keys()) {
        if (this.isValidMove(id, dir)) moves.push([id, dir]);
      }
    });
    return moves;
  }
}

module.exports = Board;
