// src/solvers/AStarSolver.js
const Solver = require('./Solver');
const PriorityQueue = require('../utils/PriorityQueue');

class AStarSolver extends Solver {
    /**
    * @param {Function} heuristicFunction 
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
            const heuristicA = a.cost + this.heuristicFunction(a);
            const heuristicB = b.cost + this.heuristicFunction(b);
            return heuristicA - heuristicB;
        });
        
        frontier.push(initialState);
        
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

module.exports = AStarSolver;