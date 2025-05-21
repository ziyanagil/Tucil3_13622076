// src/models/Piece.js
class Piece {
    constructor(id, x, y, length, orientation, isPrimary = false) {
        this.id = id;
        this.x = x;       
        this.y = y;        
        this.length = length;  
        this.orientation = orientation; 
        this.isPrimary = isPrimary; 
    }

    /**
    * @returns {Array} 
    */
    getCells() {
        const cells = [];
        
        if (this.orientation === 'horizontal') {
            for (let i = 0; i < this.length; i++) {
                cells.push([this.x + i, this.y]);
            }
        } else {
            for (let i = 0; i < this.length; i++) {
                cells.push([this.x, this.y + i]);
            }
        }
        
        return cells;
    }

    /**
    * @param {string} direction 
    * @returns {Array} 
    */
    getNewCellsAfterMove(direction) {
        let newX = this.x;
        let newY = this.y;
        
        switch (direction) {
            case 'up':
                newY -= 1;
                break;
            case 'down':
                newY += 1;
                break;
            case 'left':
                newX -= 1;
                break;
            case 'right':
                newX += 1;
                break;
        }
        
        const cells = [];
        
        if (this.orientation === 'horizontal') {
            for (let i = 0; i < this.length; i++) {
                cells.push([newX + i, newY]);
            }
        } else {
            for (let i = 0; i < this.length; i++) {
                cells.push([newX, newY + i]);
            }
        }
        
        return cells;
    }

    /**
    * @param {string} direction 
    */
    move(direction) {
        switch (direction) {
            case 'up':
                this.y -= 1;
                break;
            case 'down':
                this.y += 1;
                break;
            case 'left':
                this.x -= 1;
                break;
            case 'right':
                this.x += 1;
                break;
        }
    }

    /**
    * @returns {Piece}
    */
    clone() {
        return new Piece(this.id, this.x, this.y, this.length, this.orientation, this.isPrimary);
    }
}

module.exports = Piece;