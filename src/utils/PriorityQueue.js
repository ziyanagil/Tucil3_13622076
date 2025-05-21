// src/utils/PriorityQueue.js
class PriorityQueue {
    /**
     * @param {Function} comparator 
     */
    constructor(comparator = (a, b) => a - b) {
        this.comparator = comparator;
        this.heap = [];
    }

    /**
     * @returns {number} 
     */
    size() {
        return this.heap.length;
    }

    /**
     * @returns {boolean} 
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * @returns {*} 
     */
    peek() {
        return this.heap[0];
    }

    /**
     * @param {*} value 
     */
    push(value) {
        this.heap.push(value);
        this._siftUp();
    }

    /**
     * @returns {*} 
     */
    pop() {
        const poppedValue = this.heap[0];
        const lastValue = this.heap.pop();

        if (this.heap.length > 0) {
            this.heap[0] = lastValue;
            this._siftDown();
        }

        return poppedValue;
    }

    /**
     * @private
     */
    _siftUp() {
        let nodeIndex = this.heap.length - 1;

        while (nodeIndex > 0) {
            const parentIndex = Math.floor((nodeIndex - 1) / 2);
            
            if (this.comparator(this.heap[nodeIndex], this.heap[parentIndex]) >= 0) {
                break;
            }
            
            [this.heap[nodeIndex], this.heap[parentIndex]] = 
                [this.heap[parentIndex], this.heap[nodeIndex]];
            
            nodeIndex = parentIndex;
        }
    }

    /**
     * @private
     */
    _siftDown() {
        let nodeIndex = 0;
        const length = this.heap.length;

        while (true) {
            const leftChildIndex = 2 * nodeIndex + 1;
            const rightChildIndex = 2 * nodeIndex + 2;
            let smallestChildIndex = nodeIndex;

            if (leftChildIndex < length && 
                this.comparator(this.heap[leftChildIndex], this.heap[smallestChildIndex]) < 0) {
                smallestChildIndex = leftChildIndex;
            }

            if (rightChildIndex < length && 
                this.comparator(this.heap[rightChildIndex], this.heap[smallestChildIndex]) < 0) {
                smallestChildIndex = rightChildIndex;
            }

            if (smallestChildIndex === nodeIndex) {
                break;
            }

            [this.heap[nodeIndex], this.heap[smallestChildIndex]] = 
                [this.heap[smallestChildIndex], this.heap[nodeIndex]];
            
            nodeIndex = smallestChildIndex;
        }
    }
}

module.exports = PriorityQueue;