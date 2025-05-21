# Rush Hour Solver

Aplikasi JavaScript untuk menyelesaikan permainan **Rush Hour** menggunakan algoritma pathfinding:

* Greedy Best First Search
* Uniform Cost Search (UCS)
* A\* Search

---

## Deskripsi Proyek

Rush Hour adalah permainan puzzle di mana kendaraan-kendaraan pada papan berukuran AxB harus digeser sehingga **primary piece** (kendaraan utama, biasanya berwarna merah) dapat keluar melalui pintu keluar. Program ini membaca konfigurasi awal dari file teks, lalu mencari solusi optimal (atau mendekati optimal) dengan salah satu algoritma di atas.

---

## Struktur Direktori

```
Tucil3_13622076
├── bin/                     # file hasil build atau executable
├── doc/                     # laporan tugas kecil
├── src/
│   ├── index.js             # run program main
│   ├── models/
│   │   ├── Board.js         # representasi papan permainan
│   │   ├── Cell.js          # representasi satu cell pada papan
│   │   ├── Piece.js         # representasi kendaraan/piece
│   │   └── GameState.js     # representasi satu keadaan permainan
│   ├── solvers/
│   │   ├── Solver.js        # kelas dasar solver
│   │   ├── GreedySolver.js  # implementasi Greedy Best First Search
│   │   ├── UcsSolver.js     # implementasi Uniform Cost Search
│   │   └── AStarSolver.js   # implementasi A* Search
│   ├── heuristics/
│   │   └── Heuristics.js    # implementasi fungsi-fungsi heuristic
│   └── utils/
│       ├── FileReader.js    # pembacaan file input
│       ├── PriorityQueue.js # antrian prioritas untuk algoritma
│       └── Visualizer.js    # visualisasi board (warna, highlight)
├── test/                    # contoh file konfigurasi `.txt` (input dan output)
│   ├── 0.txt
│   ├── 1.txt
│   └── …  
├── package.json             # daftar dependensi dan skrip npm
└── README.md                # dokumentasi program
```

---

## Persyaratan

* **Node.js** v12 atau lebih baru
* **npm** (biasanya sudah termasuk bersama Node.js)
* Package tambahan (install via npm):

  * `chalk` (untuk pewarnaan output di terminal)

---

## Instalasi

1. Clone repositori ini

   ```bash
   git clone https://github.com/ziyanagil/Tucil3_13622076.git
   cd Tucil3_13622076
   ```
2. Install dependensi

   ```bash
   npm install
   ```
3. (Opsional) Jika menggunakan bundler/build tool, jalankan build:

   ```bash
   npm run build
   ```

---

## Cara Penggunaan

1. Siapkan file konfigurasi `.txt` sesuai format (lihat bagian **Format Input**).

2. Jalankan program:

   ```bash
   node src/index.js
   ```

3. Ikuti petunjuk di terminal:

   * Masukkan path ke file input `.txt`
   * Pilih algoritma (`greedy`, `ucs`, atau `astar`)
   * Jika memilih `greedy` atau `astar`, pilih heuristic yang diinginkan

4. Program akan menampilkan:

   * Konfigurasi papan awal
   * Setiap langkah pergeseran (dengan pewarnaan untuk primary piece, pintu keluar, dan piece yang digeser)
   * Statistics:
     * Waktu eksekusi
     * Total langkah solusi

5. Simpan ke file:    
   * Setelah statistik ditampilkan, masukkan nama file output (tanpa ekstensi). Output akan otomatis tersimpan di test/<nama_output>.txt
---

## Format Input

File teks `.txt` harus memiliki struktur:

```
A B
N
baris1
baris2
…
barisA
```

* **A** dan **B**: dimensi papan (A kolom × B baris)
* **N**: jumlah piece non-primary
* Setiap baris konfigurasi panjangnya sama dengan B, menggunakan karakter:

  * `P` : primary piece
  * `K` : pintu keluar (sejajar orientasi P dan berada di tepi)
  * Karakter lain (A–Z, angka, simbol) : piece berbeda
  * `.` : cell kosong

**Contoh**:

```
6 6
12
AAB..F
..BCDF
GPPCDFK
GH.III
GHJ...
LLJMM.
```

---

## Heuristik

1. **Manhattan Distance**
   Jarak horizontal (atau vertikal) antara ujung depan primary piece dan pintu keluar.
2. **Blocking Pieces**
   Jumlah piece yang menghalangi jalan primary piece menuju pintu keluar.

---

## Output

* **Board awal** dan **tahap per tahap** solusi dengan warna:

  * Primary piece (misal merah)
  * Pintu keluar (misal hijau)
  * Piece yang baru saja digeser (misal kuning)

* **Statistik**:

  * Waktu eksekusi (ms)
  * Jumlah langkah solusi

* **Penyimpnan Output**:
  * Masukkan nama file output (tanpa .txt):  

---

## Author
- **Nama**: Ziyan Agil Nur Ramadhan
- **NIM**: 13622076
- **Mata Kuliah**: IF2211 Strategi Algoritma
- **Tahun**: 2025
