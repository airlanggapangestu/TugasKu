# 📝 TugasKu – Task Management App

Website **to‑do list full‑stack** untuk manajemen tugas pribadi maupun tim.  
Dibangun dengan **React + Vite + Tailwind CSS** (frontend) dan **PHP + MySQL** (backend), berjalan di lingkungan XAMPP.

---

## ✨ Fitur

### 🔐 Autentikasi
- Register, Login, dan Logout (dengan token)
- Enkripsi password menggunakan `bcrypt`
- Modal konfirmasi logout khusus

### 📋 Manajemen Tugas
- CRUD lengkap: Buat, Baca, Ubah, Hapus tugas
- Atribut: Judul, Deskripsi, Prioritas (Low/Med/High), Kategori, Tenggat Waktu
- Status: Aktif / Selesai
- Restore tugas yang sudah selesai (Done → Aktif)

### 🔍 Pencarian & Filter
- **Search real‑time** di halaman Active Tasks, Done Tasks, dan Categories
- **Filter ganda**: berdasarkan Prioritas dan Kategori

### 📊 Dashboard
- Diagram batang (7 hari) penyelesaian tugas
- Efisiensi total (persentase selesai)
- Open Issues (tugas aktif)
- Top Priorities (tugas prioritas tinggi terbaru)
- Recent Folders (kategori terbaru dengan jumlah tugas)

### 🎨 Kustomisasi Tampilan
- **Mode Gelap / Terang** – disimpan di `localStorage`
- Sidebar responsif (hamburger menu di layar kecil)
- Desain gelap ala Material Design dengan palet warna konsisten

### 🔔 Notifikasi
- Dropdown dengan badge jumlah notifikasi
- Menampilkan tugas yang **overdue**, **due today**, dan **due tomorrow**
- Klik langsung menuju halaman Active Tasks

### ⚙️ Pengaturan Profil
- Ubah nama tampilan
- Ubah password (memverifikasi password saat ini)
- Avatar otomatis berdasarkan inisial nama (UI Avatars)

---

## 🛠️ Teknologi

| Lapisan   | Teknologi                                                                 |
|-----------|---------------------------------------------------------------------------|
| Frontend  | React 19, Vite 5, Tailwind CSS 3, Lucide React (ikon), React Router DOM |
| Backend   | PHP 8 (native), MySQL 8                                                  |
| Server    | XAMPP (Apache + MySQL)                                                   |

---

## 📦 Instalasi

### Prasyarat
- [XAMPP](https://www.apachefriends.org) (atau Apache + MySQL terpisah)
- [Node.js](https://nodejs.org) & npm

### 1. Clone Repository
```bash
git clone https://github.com/airlanggapangestu/TugasKu.git
cd TugasKu
```

### 2. Setup Database
- Nyalakan **Apache** dan **MySQL** di XAMPP.
- Buka `http://localhost/phpmyadmin`, buat database baru bernama `todo_db`.
- Jalankan semua query dari file `todo_db.sql` (jika tersedia), atau buat tabel sesuai kebutuhan backend.

### 3. Konfigurasi Backend
- Salin `todo-backend/config.example.php` menjadi `config.php`.
- Isi kredensial database:
  ```php
  <?php
  $host = 'localhost';
  $db   = 'todo_db';
  $user = 'root';
  $pass = '';
  $charset = 'utf8mb4';
  ```

### 4. Install Dependencies Frontend
```bash
cd todo-frontend
npm install
```

### 5. Jalankan Frontend
```bash
npm run dev
```
Buka `http://localhost:5173` di browser.

> Pastikan folder `todolist` (yang berisi `todo-frontend` dan `todo-backend`) berada di dalam `htdocs` XAMPP agar API dapat diakses melalui `http://localhost/todolist/todo-backend/api/...`.

---

## 📁 Struktur Proyek

```
TugasKu/
├── todo-frontend/
│   ├── public/                    # Asset statis (logo, dll.)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # Sidebar, Topbar, Layout wrapper
│   │   │   ├── ActiveTasks.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── CreateTask.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DoneTasks.jsx
│   │   │   ├── Help.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── LogoutModal.jsx
│   │   │   ├── NotificationDropdown.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Settings.jsx
│   │   ├── context/
│   │   │   └── LayoutContext.jsx  # State layout global
│   │   ├── App.jsx               # Routing
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Styling global + variabel tema
│   └── vite.config.js
├── todo-backend/
│   ├── api/                      # Kumpulan endpoint REST
│   │   ├── login.php
│   │   ├── register.php
│   │   ├── create_task.php
│   │   ├── update_task.php
│   │   ├── delete_task.php
│   │   ├── complete_task.php
│   │   ├── restore_task.php
│   │   ├── get_active_tasks.php
│   │   ├── get_done_tasks.php
│   │   ├── get_dashboard.php
│   │   ├── create_category.php
│   │   ├── delete_category.php
│   │   ├── get_categories.php
│   │   ├── get_categories_full.php
│   │   ├── update_profile.php
│   │   ├── change_password.php
│   │   └── get_notifications.php
│   ├── config.example.php        # Template konfigurasi
│   └── ...
├── .gitignore
└── README.md
```

---

## 🧪 Testing

1. Register akun baru melalui `/register`.
2. Login dan buat beberapa tugas dari `/create-task` atau sidebar.
3. Filter dan cari tugas di `/active-tasks`.
4. Tandai selesai, lihat di `/done`, restore jika perlu.
5. Buat kategori di `/categories`.
6. Periksa dashboard di `/dashboard` untuk grafik dan statistik.
7. Ubah profil, password, atau tema di `/settings`.
8. Klik ikon lonceng untuk notifikasi tenggat waktu.

---

## 🤝 Kontribusi

Proyek ini masih dalam pengembangan. Saran dan kontribusi selalu diterima!

---

## 📧 Kontak

- **GitHub**: [@airlanggapangestu](https://github.com/airlanggapangestu)

---

© 2026 TugasKu. Dibangun oleh Airlangga Pangestu.
