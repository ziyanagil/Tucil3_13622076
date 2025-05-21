// src/models/GameState.js
class GameState {
    constructor(board, movesHistory = [], cost = 0) {
        this.board = board;
        this.movesHistory = movesHistory;
        this.cost = cost;
    }

    /**
    * @returns {string}
    */
    getHash() {
        return this.board.toString();
    }

    /**
    * @returns {boolean}
    */
    isGoal() {
        return this.board.isSolved();
    }

    /**
    * @returns {Array}
    */
    getNextStates() {
        const possibleMoves = this.board.getPossibleMoves();
        const nextStates = [];

        possibleMoves.forEach(([pieceId, direction]) => {
            const newBoard = this.board.clone();
            newBoard.movePiece(pieceId, direction);

            const newMovesHistory = [...this.movesHistory, [pieceId, direction]];
            const newCost = this.cost + 1; 
            const newState = new GameState(newBoard, newMovesHistory, newCost);

            nextStates.push(newState);
        });

        return nextStates;
    }

    /**
    * @returns {GameState} 
    */
    clone() {
        return new GameState(
            this.board.clone(),
            [...this.movesHistory],
            this.cost
        );
    }
}

module.exports = GameState;