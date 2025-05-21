// src/solvers/GreedySolver.js
const Solver = require('./Solver');
const PriorityQueue = require('../utils/PriorityQueue');

class GreedySolver extends Solver {
    /**
    * @param {Function}
    */
    constructor(heuristicFunction) {
        super();
        this.heuristicFunction = heuristicFunction;
    }

    /**
    * @param {GameState} initialState 
    * @returns {Object} 
    */
    solve(initialState) {
        this.reset();
        const startTime = performance.now();
        const frontier = new PriorityQueue((a, b) => {
            const heuristicA = this.heuristicFunction(a);
            const heuristicB = this.heuristicFunction(b);
            return heuristicA - heuristicB;
        });
        
        frontier.push(initialState);
        
        const visited = new Set();
        
        while (!frontier.isEmpty()) {
            const currentState = frontier.pop();
            this.nodesVisited++;
            
            if (currentState.isGoal()) {
                const endTime = performance.now();
                return this.formatSolution(currentState, endTime - startTime);
            }
            
            const stateHash = currentState.getHash();
            
            if (visited.has(stateHash)) {
                continue;
            }
            
            visited.add(stateHash);
            
            const nextStates = currentState.getNextStates();
            
            nextStates.forEach(nextState => {
                frontier.push(nextState);
            });
        }
        
        const endTime = performance.now();
        return this.formatSolution(null, endTime - startTime);
    }
}

module.exports = GreedySolver;