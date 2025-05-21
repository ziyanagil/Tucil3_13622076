// src/utils/FileReader.js
const fs = require('fs');

class FileReader {
  static readPuzzleFile(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/\r/g, '');
    const lines = raw.split('\n');

    if (lines.length < 3) {
      throw new Error('File terlalu pendek—harus ada minimal 3 baris.');
    }

    const [wStr, hStr] = lines[0].trim().split(/\s+/);
    const width = parseInt(wStr, 10);
    const height = parseInt(hStr, 10);
    const numNonPrimary = parseInt(lines[1].trim(), 10);
    if (isNaN(width) || isNaN(height)) throw new Error('Header dimensi tidak valid');
    if (isNaN(numNonPrimary)) throw new Error('Header jumlah non-primary tidak valid');

    const rawRows = lines.slice(2);
    let start = 0, end = rawRows.length;
    let exitX, exitY;

    if (rawRows[start] && /^\s*K\s*$/.test(rawRows[start])) {
      exitY = -1;
      exitX = rawRows[start].indexOf('K');
      start++;
    }

    if (rawRows[end - 1] && /^\s*K\s*$/.test(rawRows[end - 1])) {
      exitY = height;
      exitX = rawRows[end - 1].indexOf('K');
      end--;
    }

    const gridRows = rawRows.slice(start, end);
    if (gridRows.length !== height) {
      throw new Error(`Ditemukan ${gridRows.length} baris grid, header menyebut height=${height}`);
    }

    const boardConfig = gridRows.map((row, y) => {
      let r = row;

      if (r[0] === 'K') {
        exitX = -1;
        exitY = y;
        r = r.slice(1);
      }
      else if (r[r.length - 1] === 'K') {
        exitX = width;
        exitY = y;
        r = r.slice(0, -1);
      }
      r = r.replace(/ /g, '.');

      if (r.length > width) {
        r = r.substring(r.length - width);
      } else if (r.length < width) {
        r += '.'.repeat(width - r.length);
      }

      return r;
    });

    boardConfig.forEach((r, y) => {
      if (r.length !== width) {
        throw new Error(`Baris ke-${y} panjangnya ${r.length}, harus ${width}`);
      }
    });

    const allChars = boardConfig.join('');
    const nonPrimSet = new Set([...allChars].filter(c => /[A-Z]/.test(c) && c !== 'P'));
    if (nonPrimSet.size !== numNonPrimary) {
      throw new Error(`Header menyebut ${numNonPrimary} non-primary, tapi terdeteksi ${nonPrimSet.size}`);
    }

    if (exitX === undefined || exitY === undefined) {
      throw new Error("Pintu keluar 'K' tidak ditemukan");
    }

    return { width, height, boardConfig, exitX, exitY };
  }
}

module.exports = FileReader;