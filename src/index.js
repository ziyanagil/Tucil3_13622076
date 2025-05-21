// src/index.js
const fs = require('fs');
const readline = require('readline');
const FileReader = require('./utils/FileReader');
const Board = require('./models/Board');
const Cell = require('./models/Cell');
const Piece = require('./models/Piece');
const GameState = require('./models/GameState');
const Visualizer = require('./utils/Visualizer');
const Heuristics = require('./heuristics/Heuristics');
const UcsSolver = require('./solvers/UcsSolver');
const GreedySolver = require('./solvers/GreedySolver');
const AStarSolver = require('./solvers/AStarSolver');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * @param {Object} config 
 * @returns {GameState} 
 */
function createInitialState(config) {
    const { width, height, boardConfig, exitX, exitY } = config;
    const board = new Board(width, height);
    board.setExit(exitX, exitY);
    const piecesMap = new Map();
    
    for (let y = 0; y < boardConfig.length; y++) {
        const row = boardConfig[y];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            
            if (cell === '.') continue;
            
            if (cell === 'K') {
                board.setExit(x, y);
                continue;
            }
            
            if (!piecesMap.has(cell)) {
                piecesMap.set(cell, { id: cell, positions: [] });
            }
            
            piecesMap.get(cell).positions.push({ x, y });
        }
    }
    
    piecesMap.forEach((pieceData) => {
        const { id, positions } = pieceData;
        const isPrimary = id === 'P';
        
        positions.sort((a, b) => {
            if (a.y === b.y) return a.x - b.x;
            return a.y - b.y;
        });
        
        const isHorizontal = positions.every((pos, i, arr) => 
            i === 0 || pos.y === arr[0].y
        );
        
        const orientation = isHorizontal ? 'horizontal' : 'vertical';
        const length = positions.length;
        
        const x = positions[0].x;
        const y = positions[0].y;
        
        const piece = new Piece(id, x, y, length, orientation, isPrimary);
        board.placePiece(piece);
    });
    
    return new GameState(board);
}

async function main() {
    try {
        const filePath = await new Promise((resolve) => {
            rl.question('Enter path to puzzle file: ', resolve);
        });
        
        const config = FileReader.readPuzzleFile(filePath);
        
        const initialState = createInitialState(config);
        
        console.log('\nInitial Board:');
        Visualizer.displayBoard(initialState.board);
        
        const algorithmChoice = await new Promise((resolve) => {
            rl.question('\nChoose algorithm (1: UCS, 2: Greedy Best First Search, 3: A*): ', resolve);
        });
        
        let solver;
        let heuristicName = 'combined';
        

        if (algorithmChoice === '2' || algorithmChoice === '3') {
            heuristicName = await new Promise((resolve) => {
                rl.question('Choose heuristic (1: Manhattan Distance, 2: Blocking Vehicles): ', (choice) => {
                    switch (choice) {
                        case '1': resolve('manhattan'); break;
                        case '2': resolve('blocking'); break;
                        case '3': 
                        default: resolve('combined'); break;
                    }
                });
            });
        }
        
        const heuristicFunction = Heuristics.getHeuristic(heuristicName);
        
        switch (algorithmChoice) {
            case '1':
                solver = new UcsSolver();
                console.log('\nSolving with Uniform Cost Search...');
                break;
            case '2':
                solver = new GreedySolver(heuristicFunction);
                console.log(`\nSolving with Greedy Best First Search using ${heuristicName} heuristic...`);
                break;
            case '3':
                solver = new AStarSolver(heuristicFunction);
                console.log(`\nSolving with A* Search using ${heuristicName} heuristic...`);
                break;
            default:
                console.log('Invalid choice. Using A* with combined heuristic by default.');
                solver = new AStarSolver(heuristicFunction);
        }
        
        const solutionInfo = solver.solve(initialState);
        
        console.log('\n--- Solution ---\n');
        
        if (solutionInfo.solved) {
            Visualizer.displaySolution(initialState, solutionInfo.movesHistory);
        } else {
            console.log('No solution found!');
        }      
        Visualizer.displayStats(solutionInfo);
        
        rl.question('\nMasukkan nama file output (tanpa .txt): ', (customName) => {
            const lines = [];
            const outDir = 'test';
            if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
            const filename = `${customName.trim() || 'output'}.txt`;
            const outPath = `${outDir}/${filename}`;
            lines.push('Papan Awal:');
            lines.push(initialState.board.toString());
            lines.push('');

            const simState = initialState.clone();
            solutionInfo.movesHistory.forEach(([id, dir], i) => {
                simState.board.movePiece(id, dir);
                lines.push(`Gerakan ${i+1}: ${id}-${dir}`);
                lines.push(simState.board.toString());
                lines.push('');
            });

            lines.push(`Solved: ${solutionInfo.solved}`);
            lines.push(`Cost: ${solutionInfo.cost}`);
            lines.push(`Execution time: ${solutionInfo.executionTime.toFixed(2)} ms`);

            solutionInfo.movesHistory.forEach(([id, dir], i) => {
                lines.push(`  ${i+1}. Piece ${id} -> ${dir}`);
            });

            fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
            console.log(`\nOutput tersimpan di ${outPath}`);

            rl.close();
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
    }
}

main();