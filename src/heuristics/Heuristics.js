// src/heuristics/Heuristics.js
class Heuristics {
    /**
    * @param {GameState} 
    * @returns {number} 
    */
    static manhattanDistance(state) {
        const board = state.board;
        const primaryPiece = board.primaryPiece;
        const exitPosition = board.exitPosition;
        
        if (!primaryPiece || !exitPosition) {
            return Infinity;
        }
        let primaryX, primaryY;
        
        if (primaryPiece.orientation === 'horizontal') {
            if (exitPosition.x === board.width - 1) {
                primaryX = primaryPiece.x + primaryPiece.length - 1;
            } else {
                primaryX = primaryPiece.x;
            }
            primaryY = primaryPiece.y;
        } else {
            primaryX = primaryPiece.x;
            if (exitPosition.y === board.height - 1) {
                primaryY = primaryPiece.y + primaryPiece.length - 1;
            } else {
                primaryY = primaryPiece.y;
            }
        }
        return Math.abs(primaryX - exitPosition.x) + Math.abs(primaryY - exitPosition.y);
    }
    
    /**
    * @param {GameState} state 
    * @returns {number} 
    */
    static blockingVehicles(state) {
        const board = state.board;
        const primaryPiece = board.primaryPiece;
        const exitPosition = board.exitPosition;
        
        if (!primaryPiece || !exitPosition) {
            return Infinity;
        }       
        let blockingCount = 0;
        
        if (primaryPiece.orientation === 'horizontal') {
            const y = primaryPiece.y;
            
            if (exitPosition.x > primaryPiece.x) {
                for (let x = primaryPiece.x + primaryPiece.length; x < exitPosition.x; x++) {
                    if (board.grid[y][x].isOccupied()) {
                        blockingCount++;
                    }
                }
            } else {
                for (let x = primaryPiece.x - 1; x > exitPosition.x; x--) {
                    if (board.grid[y][x].isOccupied()) {
                        blockingCount++;
                    }
                }
            }
        } else {
            const x = primaryPiece.x;
            
            if (exitPosition.y > primaryPiece.y) {
                for (let y = primaryPiece.y + primaryPiece.length; y < exitPosition.y; y++) {
                    if (board.grid[y][x].isOccupied()) {
                        blockingCount++;
                    }
                }
            } else {
                for (let y = primaryPiece.y - 1; y > exitPosition.y; y--) {
                    if (board.grid[y][x].isOccupied()) {
                        blockingCount++;
                    }
                }
            }
        }        
        return blockingCount;
    }
    
    /**
    * @param {string} name 
    * @returns {Function} 
    */
    static getHeuristic(name) {
        switch (name.toLowerCase()) {
            case 'manhattan':
                return this.manhattanDistance;
            case 'blocking':
                return this.blockingVehicles;
        }
    }
}

module.exports = Heuristics;