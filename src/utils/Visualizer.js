// src/utils/Visualizer.js
const chalk = require('chalk');

class Visualizer {
  static COLORS = {
    PRIMARY_PIECE: chalk.red,
    EXIT: chalk.green,
    MOVED_PIECE: chalk.yellow,
    DEFAULT: chalk.white
  };

  static displayBoard(board, movedPieceId = null) {
    const boardStr = board.toString();
    boardStr.split('\n').forEach(line => {
      const colored = [...line].map(ch => {
        if (ch === 'P') return this.COLORS.PRIMARY_PIECE(ch);
        if (ch === 'K') return this.COLORS.EXIT(ch);
        if (ch === movedPieceId) return this.COLORS.MOVED_PIECE(ch);
        if (/[A-Z]/.test(ch)) return this.COLORS.DEFAULT(ch);
        // '.' dan ' ' dibiarkan
        return ch;
      }).join('');
      console.log(colored);
    });
  }

  static displaySolution(initialState, movesHistory) {
    console.log('Papan Awal');
    this.displayBoard(initialState.board);
    console.log('');

    let current = initialState.clone();
    movesHistory.forEach(([pid, dir], i) => {
      console.log(`Gerakan ${i+1}: ${pid}-${this.formatDirection(dir)}`);
      current.board.movePiece(pid, dir);
      this.displayBoard(current.board, pid);
      console.log('');
    });
    console.log(current.board.isSolved()
      ? 'Game solved!'
      : 'Solusi tidak ditemukan.');
  }

  static formatDirection(dir) {
    return { up:'atas', down:'bawah', left:'kiri', right:'kanan' }[dir] || dir;
  }

  static displayStats({ executionTime, movesHistory }) {
    console.log('\n--------- Statistcs ---------');
    console.log(`Execution time: ${executionTime.toFixed(2)} ms`);
    console.log(`Total moves: ${movesHistory.length}`);
    console.log('-----------------------------');
  }
}

module.exports = Visualizer;