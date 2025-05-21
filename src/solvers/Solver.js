// src/solvers/Solver.js
class Solver {
    constructor() {
        this.nodesVisited = 0;
    }

    /**
    * @param {GameState} initialState 
    * @returns {Object}
    */
    solve(initialState) {
        throw new Error('Method solve() must be implemented by subclasses');
    }

    reset() {
        this.nodesVisited = 0;
    }

    /**
    * @param {GameState} finalState 
    * @param {number} executionTime 
    * @returns {Object}
    */
    formatSolution(finalState, executionTime) {
        return {
            solved: finalState !== null,
            movesHistory: finalState ? finalState.movesHistory : [],
            nodesVisited: this.nodesVisited,
            executionTime: executionTime,
            cost: finalState ? finalState.cost : 0
        };
    }
}

module.exports = Solver;