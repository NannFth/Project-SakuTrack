# SakuTrack - Capstone Project CC26-PS075
SakuTrack adalah aplikasi manajemen keuangan pribadi berbasis web yang dirancang khusus untuk pelajar dan mahasiswa guna membantu mereka dalam membangun kebiasaan finansial yang sehat. Aplikasi ini hadir sebagai solusi atas sulitnya memantau arus kas harian secara terstruktur di tengah tingginya intensitas pengeluaran akademik dan gaya hidup.

## Anggota Tim

|          Nama          |      ID      |         Path         |
|:----------------------:|:------------:|:--------------------:|
| Muhammad Adnan Al Fathir | CFS254D6Y318 | Full Stack Developer |
|     Syahrul Ma'Arif    | CFS254D6Y319 | Full Stack Developer |
|         Amira          | CFS254D6X320 | Full Stack Developer |
| Adinda Amelia Rahmadani| CFS254D6X321 | Full Stack Developer |
|       Nur Aisyah       | CFS254D6X322 | Full Stack Developer |

## Akses Website Produksi
Untuk mengakses website yang telah selesai dibuat, anda dapat mengaksesnya melalui link berikut: https://sakutrack.netlify.app/

## Fitur Utama
SakuTrack memiliki beberapa halaman dan fitur utama yang dirancang untuk bertindak sebagai asisten keuangan proaktif:

* **Dashboard (Pusat Kendali)**
  Halaman utama yang menyajikan kondisi keuangan pengguna secara real-time. Dilengkapi dengan grafik arus kas dan fitur Budget Wallets, yaitu dompet visual yang otomatis memisahkan saldo ke dalam pos Kebutuhan, Keinginan, dan Tabungan sesuai rasio alokasi pengguna (misal: 50/30/20).

* **Manajemen Transaksi**
  Halaman pencatatan kas masuk dan keluar yang praktis. Keunggulan utamanya ada pada pemisahan kategori cerdas. Saat mencatat pengeluaran, pengguna diwajibkan untuk mengklasifikasikan transaksi tersebut sebagai pengeluaran pokok atau sekadar keinginan.

* **Proyeksi Keuangan (Forecasting)**
  Halaman analisis yang memprediksi masa depan keuangan pengguna menggunakan Logika Pacing (Ritme Berjalan). Fitur ini menghitung rata-rata pengeluaran harian, mengkalkulasi daya tahan saldo saat ini, dan memberikan estimasi sisa saldo di akhir bulan dengan status peringatan (Aman/Waspada/Bahaya).

* **Rekomendasi Harian (Asisten Saku)**
  Halaman penasihat cerdas yang memberikan rekomendasi batas aman pengeluaran harian dalam bentuk nominal pasti (Rupiah). Batas ini bersifat dinamis, jika pemasukan pengguna bertambah, batas aman pengeluaran akan otomatis menyesuaikan agar tidak terjadi defisit.

* **Target Tabungan (Savings Goals)**
  Fitur yang memungkinkan pengguna untuk menetapkan tujuan menabung secara spesifik, seperti untuk membeli laptop, biaya kursus, atau dana darurat. Pengguna dapat memantau progres tabungan secara visual dari angka 0% hingga 100%, sehingga memberikan gambaran yang jelas mengenai sejauh mana pencapaian finansial mereka.

* **Wishlist Impian**
  Halaman khusus untuk mencatat daftar barang atau keinginan yang ingin dicapai di masa depan. Fitur ini berfungsi sebagai pengingat jangka panjang agar pengguna tetap fokus pada prioritas menabung dan membantu menekan keinginan belanja impulsif yang tidak terencana.

* **Smart Alerts & Daily Reminders**
  Sistem proaktif yang bekerja di latar belakang. Meliputi **Morning Briefing (09:00)** untuk mengingatkan batas anggaran harian, dan **Evening Review (20:00)** untuk mengingatkan pencatatan transaksi sebelum tidur. Sistem juga akan memunculkan peringatan jika mendeteksi pengeluaran abnormal atau kebocoran anggaran pada kategori tertentu.

* **Gamifikasi (Pencapaian & Konsistensi)**
  Fitur engagement yang memberikan apresiasi visual (pop-up achievement) saat target tabungan tercapai, serta memberikan penghargaan streak bagi pengguna yang disiplin mencatat transaksi selama 3, 7, hingga 30 hari berturut-turut.

## Dependensi Proyek
Proyek ini dipisahkan menjadi dua environment (Frontend dan Backend) dengan dependensi masing-masing:

### Frontend
* **`react` & `react-dom`:** Library utama untuk membangun User Interface (UI) berbasis komponen.
* **`react-router-dom`:** Menangani routing dan navigasi antar halaman secara Single Page Application (SPA).
* **`axios`:** HTTP Client untuk melakukan request data (GET, POST, PUT, DELETE) ke API backend.
* **`firebase`:** SDK untuk integrasi Firebase Authentication (Sistem Login/Register).
* **`chart.js` & `react-chartjs-2`:** Mengelola dan merender visualisasi data (grafik arus kas dan kategori) secara interaktif.
* **`framer-motion`:** Memberikan efek animasi transisi dan mikro-interaksi yang mulus pada antarmuka.
* **`lucide-react`:** Menyediakan pustaka ikon yang modern, ringan, dan mudah dikustomisasi.
* **`sweetalert2` & `react-hot-toast`:** Menampilkan pop-up alert, notifikasi sukses/gagal, dan pesan konfirmasi yang elegan.
* **`socket.io-client`:** Client-side library untuk menerima notifikasi real-time dari backend (fitur Smart Alerts).
* **`vite` & `@vitejs/plugin-react`:** Build tool generasi baru yang memberikan pengalaman development server super cepat.
* **`tailwindcss`, `postcss`, `autoprefixer`:** Framework CSS berbasis utility-first untuk styling aplikasi yang responsif.
* **`eslint` & plugin terkait:** Linter untuk menjaga konsistensi dan kualitas penulisan kode JavaScript/React.

### Backend 
* **`express`:** Framework web minimalis untuk Node.js, digunakan untuk membangun RESTful API dan routing server.
* **`mysql2`:** Driver database yang efisien untuk menghubungkan server Node.js dengan database MySQL.
* **`firebase-admin`:** SDK Admin Firebase untuk memverifikasi token autentikasi pengguna secara aman di sisi server.
* **`cors`:** Middleware keamanan komunikasi untuk mengizinkan (atau memblokir) permintaan HTTP antar domain (Cross-Origin).
* **`dotenv`:** Mengelola konfigurasi variabel lingkungan (environment variables) yang sensitif secara terpusat.
* **`socket.io`:** Mengelola koneksi WebSockets untuk mengirim notifikasi peringatan secara real-time ke frontend pengguna.
* **`node-cron`:** Task scheduler berbasis waktu (cron) untuk menjalankan perintah secara otomatis sesuai jadwal (digunakan pada fitur Morning Briefing dan Evening Review harian).
* **`nodemon`:** Utility pengembangan yang secara otomatis me-restart server ketika ada perubahan pada source code.

## Tools & Environment yang Digunakan
Pastikan perangkat Anda memiliki tools berikut sebelum menjalankan proyek ini:
* **Node.js:** Versi 18.x atau yang lebih baru (Disarankan v20.x LTS).
* **Package Manager:** `npm` (Bawaan dari Node.js).
* **Database Server:** MySQL (Dapat menggunakan XAMPP, WAMP, atau MySQL Server standalone).
* **Code Editor:** Visual Studio Code (Disarankan).
* **Layanan Cloud (Produksi):** AWS EC2 (Backend Server), Netlify (Frontend Hosting), Firebase (Authentication).

## Panduan Penginstalan
Untuk menjalankan proyek SakuTrack di komputer lokal, Anda dapat memilih satu dari dua skenario di bawah ini sesuai kebutuhan Anda:

### Skenario 1: Menjalankan Frontend Lokal
Skenario ini adalah yang paling praktis karena Anda hanya perlu menjalankan antarmuka (Frontend) secara lokal. Aplikasi akan secara otomatis terhubung ke server dan database utama kami yang saat ini beroperasi di lingkungan AWS.
1. Buka **Command Prompt (CMD)** atau Terminal di komputer Anda.
2. Arahkan terminal ke dalam folder utama proyek SakuTrack yang sudah diunduh.
3. Masuk ke folder frontend dengan perintah: cd sakutrack-app-frontend
4. Instal semua dependensi yang dibutuhkan: npm install
5. Jalankan aplikasi frontend: npm run dev
6. Buka browser dan akses alamat yang tertera di terminal (http://localhost:5173) Aplikasi siap untuk dijalankan.

### Skenario 2: Menjalankan Full Localhost
Skenario ini digunakan jika ingin melakukan pengujian menyeluruh secara offline, di mana Frontend, Backend, dan Database semuanya dijalankan secara mandiri di komputer lokal.

Langkah A: Setup Database & Backend Lokal
1. Buka XAMPP (atau web server lokal lainnya) dan jalankan modul Apache serta MySQL.
2. Buka browser dan masuk ke phpMyAdmin (http://localhost/phpmyadmin). Buat database baru bernama sakutrack_db, lalu impor file struktur database .sql yang telah disertakan ke dalamnya.
3. Buka Command Prompt (CMD) atau Terminal, lalu masuk ke folder backend: cd sakutrack-app-backend
4. Siapkan file environment: Buat file .env (atau salin dari .env.example) dan isi dengan kredensial database lokal Anda (Host, User, Password, DB Name).
5. Siapkan kredensial Firebase: Pastikan file serviceAccountKey.json sudah berada di dalam folder utama backend.
6. Instal dependensi backend: npm install
7. Jalankan server backend: npm run start:dev
Pastikan terminal menampilkan pesan bahwa server berjalan dan database berhasil terhubung.

Langkah B: Setup Frontend Lokal
1. Buka code editor (seperti VS Code) dan masuk ke folder sakutrack-app-frontend.
2. Buka file src/connection.js dan src/App.jsx. Ubah alamat IP server AWS yang tertera di dalamnya menjadi IP lokal Anda (http://localhost:3000).
3. Buka Command Prompt (CMD) baru (biarkan terminal backend di Langkah A tetap berjalan), lalu masuk ke folder frontend: cd sakutrack-app-frontend
4. Instal dependensi frontend: npm install
5. Jalankan aplikasi frontend: npm run dev
6. Buka http://localhost:5173 di browser. Aplikasi sekarang berjalan sepenuhnya di lingkungan lokal komputer Anda.