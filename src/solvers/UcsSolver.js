// src/solvers/UcsSolver.js
const Solver = require('./Solver');
const PriorityQueue = require('../utils/PriorityQueue');

class UcsSolver extends Solver {
    /**
    * @param {GameState} initialState 
    * @returns {Object}
    */
    solve(initialState) {
        this.reset();
        const startTime = performance.now();
        
        const frontier = new PriorityQueue((a, b) => a.cost - b.cost);
        frontier.push(initialState);
        
        // Map to track visited states
        const visited = new Map();
        
        while (!frontier.isEmpty()) {
            const currentState = frontier.pop();
            this.nodesVisited++;
            
            if (currentState.isGoal()) {
                const endTime = performance.now();
                return this.formatSolution(currentState, endTime - startTime);
            }
            
            const stateHash = currentState.getHash();
            
            if (visited.has(stateHash) && visited.get(stateHash) <= currentState.cost) {
                continue;
            }
            
            visited.set(stateHash, currentState.cost);
            
            const nextStates = currentState.getNextStates();
            
            nextStates.forEach(nextState => {
                frontier.push(nextState);
            });
        }
        
        const endTime = performance.now();
        return this.formatSolution(null, endTime - startTime);
    }
}

module.exports = UcsSolver;