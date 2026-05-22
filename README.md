Berikut adalah file **README.md** lengkap untuk proyek **TugasKu**. Simpan di root folder proyek (`todolist/`).

````markdown
# 📝 TugasKu - Task Management App

[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![PHP](https://img.shields.io/badge/PHP-8.0-777bb3?logo=php)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-00758f?logo=mysql)](https://mysql.com)

**TugasKu** adalah aplikasi manajemen tugas (to‑do list) full‑stack yang dibangun dengan React, Vite, Tailwind CSS, PHP, dan MySQL. Aplikasi ini memungkinkan pengguna untuk membuat, mengedit, mengkategorikan, dan melacak tugas mereka dalam antarmuka yang bersih, responsif, dan mendukung mode gelap/terang.

---

## ✨ Fitur Utama

### 🔐 Autentikasi

- Register & Login dengan enkripsi password (bcrypt)
- Token‑based authentication untuk request API
- Logout dengan modal konfirmasi kustom

### 📋 Manajemen Tugas

- **CRUD Lengkap**: Buat, baca, ubah, hapus tugas
- **Prioritas**: Low, Medium, High
- **Kategori**: Kustom dengan 6 ikon & 8 pilihan warna
- **Due Date**: Pilih tanggal dengan kalender browser
- **Status**: Tandai selesai (done) atau kembalikan ke aktif

### 🔍 Pencarian & Filter

- **Search real‑time** di halaman Active Tasks, Done Tasks, dan Categories
- **Filter ganda**: Filter by Priority + Filter by Category

### 📊 Dashboard

- **Diagram batang** penyelesaian tugas 7 hari terakhir
- **Efisiensi** keseluruhan (persentase completed)
- **Open Issues** yang masih aktif
- **Top Priorities** – tugas prioritas tinggi yang paling mendesak
- **Recent Folders** – kategori terbaru dengan jumlah tugas

### 🎨 Kustomisasi Tampilan

- **Mode Gelap & Terang** (dark/light) – disimpan di localStorage
- Sidebar responsif dengan hamburger menu di layar kecil
- Desain terinspirasi Material Design dengan palet warna konsisten

### 🔔 Notifikasi

- Dropdown notifikasi dengan badge jumlah
- Menampilkan tugas yang **overdue**, **due today**, dan **due tomorrow**
- Klik langsung menuju halaman Active Tasks

### ⚙️ Pengaturan Profil

- Ubah nama tampilan
- Ubah password (validasi current password)
- Avatar otomatis berdasarkan inisial nama (via UI Avatars)

---

## 🛠️ Teknologi

| Bagian       | Teknologi                             |
| ------------ | ------------------------------------- |
| **Frontend** | React 19, Vite 5, Tailwind CSS 3      |
| **Backend**  | PHP 8 (native), MySQL 8               |
| **Library**  | Lucide React (ikon), React Router DOM |
| **Server**   | XAMPP (Apache + MySQL)                |

---

## 📦 Cara Install

### Prasyarat

- [XAMPP](https://www.apachefriends.org) (atau Apache + MySQL terpisah)
- [Node.js](https://nodejs.org) & npm

### Langkah‑langkah

1. **Clone repository**
   ```bash
   git clone https://github.com/airlanggapangestu/TugasKu.git
   cd TugasKu
   ```
````

2. **Setup database**
   - Nyalakan Apache & MySQL di XAMPP.
   - Buka `http://localhost/phpmyadmin`, buat database baru bernama `todo_db`.
   - Jalankan query SQL dari file `todo_db.sql` (atau salin manual dari `api/` backend).

3. **Konfigurasi backend**
   - Salin `config.example.php` menjadi `config.php` di folder `todo-backend/`.
   - Isi dengan kredensial database kamu:
     ```php
     <?php
     $host = 'localhost';
     $db   = 'todo_db';
     $user = 'root';
     $pass = '';
     $charset = 'utf8mb4';
     ```

4. **Install dependencies frontend**

   ```bash
   cd todo-frontend
   npm install
   ```

5. **Jalankan frontend**

   ```bash
   npm run dev
   ```

   Buka `http://localhost:5173` di browser.

6. **Backend API** sudah tersedia di `http://localhost/todolist/todo-backend/api/...` (pastikan folder `todolist` ada di dalam `htdocs` XAMPP).

---

## 📁 Struktur Proyek

```
TugasKu/
├── todo-frontend/
│   ├── public/
│   │   └── tugasku.png              # Logo aplikasi
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx       # Layout utama (sidebar + topbar)
│   │   │   │   ├── Sidebar.jsx      # Sidebar navigasi
│   │   │   │   └── Topbar.jsx       # Topbar + notifikasi
│   │   │   ├── ActiveTasks.jsx      # Halaman tugas aktif
│   │   │   ├── Categories.jsx       # Halaman kategori
│   │   │   ├── CreateTask.jsx       # Halaman buat tugas baru
│   │   │   ├── Dashboard.jsx        # Halaman dashboard
│   │   │   ├── DoneTasks.jsx        # Halaman tugas selesai
│   │   │   ├── Help.jsx             # Halaman FAQ
│   │   │   ├── Login.jsx            # Halaman login
│   │   │   ├── LogoutModal.jsx      # Modal konfirmasi logout
│   │   │   ├── NotificationDropdown.jsx  # Dropdown notifikasi
│   │   │   ├── Register.jsx         # Halaman register
│   │   │   └── Settings.jsx         # Halaman pengaturan
│   │   ├── context/
│   │   │   └── LayoutContext.jsx     # Context untuk state layout
│   │   ├── App.jsx                  # Routing utama
│   │   ├── main.jsx                 # Entry point React
│   │   └── index.css                # Styling global + variabel tema
│   └── vite.config.js               # Konfigurasi Vite
├── todo-backend/
│   ├── api/
│   │   ├── change_password.php
│   │   ├── complete_task.php
│   │   ├── create_category.php
│   │   ├── create_task.php
│   │   ├── delete_category.php
│   │   ├── delete_task.php
│   │   ├── get_active_tasks.php
│   │   ├── get_categories.php
│   │   ├── get_categories_full.php
│   │   ├── get_dashboard.php
│   │   ├── get_done_tasks.php
│   │   ├── get_notifications.php
│   │   ├── login.php
│   │   ├── register.php
│   │   ├── restore_task.php
│   │   ├── update_profile.php
│   │   └── update_task.php
│   ├── config.example.php           # Template konfigurasi database
│   └── ...
├── .gitignore
└── README.md
```

---

## 🧪 Testing

1. **Register** akun baru.
2. **Login** dengan email & password.
3. **Buat task** dari sidebar atau halaman Create Task.
4. **Lihat task** di Active Tasks, filter & search.
5. **Edit task** dengan klik detail → Edit.
6. **Tandai selesai** (complete), lihat di Done Tasks.
7. **Buat kategori** baru di halaman Categories.
8. **Cek dashboard** untuk grafik & statistik.
9. **Ubah pengaturan** di Settings (nama, password, tema).

---

## 📸 Screenshots (Opsional)

> _Tambahkan screenshot aplikasi di sini setelah deploy atau saat berjalan di localhost._

---

## 🤝 Kontribusi

Proyek ini masih dalam pengembangan. Saran dan kontribusi selalu diterima!

---

## 📧 Kontak

- **GitHub**: [@airlanggapangestu](https://github.com/airlanggapangestu)
- **Email**: [airlangga@example.com](mailto:airlangga@example.com)

---

**© 2025 TugasKu. Dibangun dengan ❤️ oleh Airlangga Pangestu.**

```

Simpan file di atas sebagai `README.md` di root folder proyek (`todolist/`), lalu push ke GitHub. README ini akan langsung muncul di halaman utama repository kamu.
```
