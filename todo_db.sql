-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2026 at 10:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `todo_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `color` varchar(7) DEFAULT '#5865f2',
  `icon` varchar(50) DEFAULT 'folder',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `user_id`, `name`, `color`, `icon`, `created_at`) VALUES
(1, 1, 'Pekerjaan', '#5865f2', 'folder', '2026-05-25 06:30:29'),
(2, 1, 'Kuliah', '#ffb959', 'megaphone', '2026-05-25 06:30:29'),
(3, 1, 'Belanja', '#73dc8d', 'folder', '2026-05-25 06:30:29'),
(4, 1, 'Kesehatan', '#f43f5e', 'home', '2026-05-25 06:30:29'),
(5, 1, 'Keuangan', '#8f8fa0', 'landmark', '2026-05-25 06:30:29'),
(6, 1, 'Proyek', '#06b6d4', 'code', '2026-05-25 06:30:29'),
(7, 1, 'Rumah', '#f59e0b', 'home', '2026-05-25 06:30:29'),
(8, 1, 'Olahraga', '#00813e', 'folder', '2026-05-25 06:30:29'),
(9, 1, 'Hobi', '#ffb4ab', 'palette', '2026-05-25 06:30:29'),
(10, 1, 'Liburan', '#ffb959', 'landmark', '2026-05-25 06:30:29'),
(11, 1, 'Keluarga', '#e91e63', 'home', '2026-05-25 06:30:29'),
(12, 1, 'Pendidikan', '#9c27b0', 'megaphone', '2026-05-25 06:30:29'),
(13, 1, 'Bisnis', '#00bcd4', 'code', '2026-05-25 06:30:29'),
(14, 1, 'Investasi', '#4caf50', 'landmark', '2026-05-25 06:30:29'),
(15, 1, 'Hiburan', '#ff9800', 'palette', '2026-05-25 06:30:29'),
(16, 1, 'Makanan', '#795548', 'folder', '2026-05-25 06:30:29'),
(17, 1, 'Transportasi', '#607d8b', 'landmark', '2026-05-25 06:30:29'),
(18, 1, 'Hewan Peliharaan', '#ff5722', 'home', '2026-05-25 06:30:29'),
(19, 1, 'Acara', '#673ab7', 'megaphone', '2026-05-25 06:30:29'),
(20, 1, 'Belajar', '#2196f3', 'code', '2026-05-25 06:30:29'),
(21, 4, 'mmk', '#5865f2', 'home', '2026-05-25 07:21:17'),
(23, 6, 'help', '#FF9800', 'folder', '2026-05-30 18:48:44'),
(26, 8, 'Sekolah', '#5865F2', 'folder', '2026-06-01 04:58:19'),
(27, 9, 'BISNIS', '#06b6d4', 'landmark', '2026-06-02 05:11:08');

-- --------------------------------------------------------

--
-- Table structure for table `todos`
--

CREATE TABLE `todos` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `priority` enum('Low','Med','High') DEFAULT 'Med',
  `status` enum('active','done') DEFAULT 'active',
  `due_date` date DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `todos`
--

INSERT INTO `todos` (`id`, `user_id`, `category_id`, `title`, `description`, `priority`, `status`, `due_date`, `completed_at`, `created_at`, `updated_at`) VALUES
(50, 1, 6, 'Mengerjakan laporan proyek akhir', 'Menyusun laporan akhir proyek pengembangan sistem informasi manajemen', 'High', 'done', '2026-05-14', '2026-06-01 08:15:06', '2026-05-25 06:31:32', '2026-06-01 08:15:06'),
(53, 1, 5, 'Membayar tagihan listrik', 'Tagihan bulan April sebesar Rp 350.000', 'High', 'done', '2026-05-10', '2026-06-01 08:15:05', '2026-05-25 06:31:32', '2026-06-01 08:15:05'),
(54, 1, 1, 'Rapat evaluasi kinerja tim', 'Rapat mingguan dengan tim pengembangan produk', 'High', 'done', '2026-05-13', '2026-06-01 08:15:05', '2026-05-25 06:31:32', '2026-06-01 08:15:05'),
(55, 1, 13, 'Menghadiri webinar bisnis digital', 'Webinar tentang strategi pemasaran digital untuk UMKM', 'Med', 'done', '2026-05-09', '2026-06-01 08:15:10', '2026-05-25 06:31:32', '2026-06-01 08:15:10'),
(56, 1, 7, 'Membersihkan dan merapikan rumah', 'Menyapu, mengepel, dan merapikan seluruh ruangan', 'Low', 'done', '2026-05-17', '2026-06-01 08:02:57', '2026-05-25 06:31:32', '2026-06-01 08:02:57'),
(57, 1, 2, 'Mengerjakan tugas akhir semester', 'Membuat makalah tentang kecerdasan buatan', 'High', 'done', '2026-05-12', '2026-06-01 08:15:05', '2026-05-25 06:31:32', '2026-06-01 08:15:05'),
(58, 1, 12, 'Membaca buku \"Atomic Habits\"', 'Menyelesaikan membaca 2 bab terakhir', 'Low', 'done', '2026-05-08', '2026-06-01 08:09:25', '2026-05-25 06:31:32', '2026-06-01 08:09:25'),
(59, 1, 1, 'Menyiapkan presentasi untuk klien', 'Membuat slide deck pitch deck produk baru', 'High', 'done', '2026-05-14', '2026-06-01 08:15:07', '2026-05-25 06:31:32', '2026-06-01 08:15:07'),
(61, 1, 9, 'Menanam bibit cabai di pot', 'Mengisi waktu luang dengan berkebun', 'Low', 'active', '2026-05-22', NULL, '2026-05-25 06:31:32', '2026-06-01 08:15:59'),
(62, 1, 5, 'Membuat anggaran bulan depan', 'Rencana pengeluaran dan pemasukan Juni 2026', 'High', 'done', '2026-05-15', '2026-06-01 08:15:07', '2026-05-25 06:31:32', '2026-06-01 08:15:07'),
(63, 1, 10, 'Merencanakan liburan ke Bali', 'Mencari tiket pesawat dan hotel untuk akhir tahun', 'Low', 'done', '2026-05-05', '2026-06-01 08:16:12', '2026-05-25 06:31:32', '2026-06-01 08:16:12'),
(64, 1, 20, 'Belajar Kotlin untuk Android', 'Mengikuti course online tentang pengembangan aplikasi Android', 'Med', 'active', '2026-05-25', NULL, '2026-05-25 06:31:32', '2026-06-01 08:16:00'),
(65, 1, 15, 'Mengunjungi pameran fotografi', 'Pameran di Galeri Nasional akhir pekan ini', 'Low', 'done', '2026-05-28', '2026-06-01 08:16:28', '2026-05-25 06:31:32', '2026-06-01 08:16:28'),
(66, 1, 11, 'Membeli kado ulang tahun ibu', 'Mencari tas atau sepatu sebagai hadiah', 'Med', 'done', '2026-05-18', '2026-06-01 08:15:10', '2026-05-25 06:31:32', '2026-06-01 08:15:10'),
(67, 1, 17, 'Servis rutin sepeda motor', 'Ganti oli, cek rem, dan tune-up mesin', 'High', 'done', '2026-05-07', '2026-05-25 06:38:45', '2026-05-25 06:31:32', '2026-05-25 06:38:45'),
(69, 1, 12, 'Menyelesaikan kursus Data Science', 'Tugas akhir course online Coursera', 'High', 'done', '2026-05-30', '2026-06-01 08:15:08', '2026-05-25 06:31:32', '2026-06-01 08:15:08'),
(71, 1, 18, 'Vaksinasi kucing peliharaan', 'Bawa kucing ke dokter hewan untuk vaksin tahunan ejeiehdieine ejee. rnryrnydnydyne yy ey ey r yyd ry r 6e 6 6ry r ye ey e yye. e e ye 6d6 yd hdh dhdhdhdhd ud du. dhu d\n\n\n\nh dh d dmeme\ne\ne\ne\n\ne\nee', 'Med', 'done', '2026-05-19', '2026-06-01 08:15:10', '2026-05-25 06:31:32', '2026-06-01 08:15:10'),
(72, 1, 19, 'Menyiapkan acara bakti sosial', 'Koordinasi dengan tim untuk acara amal di panti asuhan', 'High', 'done', '2026-05-23', '2026-06-01 08:15:07', '2026-05-25 06:31:32', '2026-06-01 08:15:07'),
(73, 1, 14, 'Membeli reksadana pasar uang', 'Investasi dana darurat ke instrumen pasar uang', 'High', 'done', '2026-05-04', '2026-06-01 08:15:04', '2026-05-25 06:31:32', '2026-06-01 08:15:04'),
(76, 4, NULL, 'kontol', 'sesresrsrsesrsesserse\n\ndrdersresrxdxrrzsxfxdxdxf', 'Low', 'done', '2026-05-24', '2026-05-25 07:21:06', '2026-05-25 07:20:38', '2026-05-25 07:21:06'),
(77, 4, 21, 'kontol mmk pangestu gede', 'knp mmk beradu', 'Med', 'done', NULL, '2026-05-25 07:22:15', '2026-05-25 07:22:09', '2026-05-25 07:22:15'),
(84, 6, NULL, 'Help me', 'tes', 'Med', 'done', '2026-05-30', '2026-05-30 18:49:02', '2026-05-30 18:48:35', '2026-05-30 18:49:02'),
(90, 8, 26, 'ASSALAMUALAIMUM', 'asalamjalaikjm', 'Low', 'active', '2026-06-02', NULL, '2026-06-01 04:58:32', '2026-06-01 04:58:32'),
(91, 8, NULL, 'l', 'l', 'High', 'active', NULL, NULL, '2026-06-01 04:59:14', '2026-06-01 04:59:14'),
(97, 1, NULL, 'Membuat PPT tugas sejarah', '', 'High', 'active', '2026-06-01', NULL, '2026-06-01 08:05:15', '2026-06-01 08:05:15'),
(98, 1, NULL, 'Lari page 5 kilometer', '', 'Med', 'done', '2026-06-03', '2026-06-01 08:15:12', '2026-06-01 08:07:31', '2026-06-01 08:15:12'),
(99, 1, 6, 'Membuat laporan projek android dan website', '', 'Med', 'active', '2026-06-01', NULL, '2026-06-01 08:08:21', '2026-06-01 08:08:21'),
(100, 1, 12, 'Rapat evaluasi OSIS', '', 'Med', 'active', '2026-06-05', NULL, '2026-06-01 08:09:21', '2026-06-01 08:09:21'),
(101, 1, 9, 'Olahraga lari pagi', '', 'Low', 'active', '2026-06-07', NULL, '2026-06-01 08:10:36', '2026-06-01 08:10:36'),
(102, 1, 1, 'Rapat evaluasi kinerja Q2', 'Rapat tim untuk review target kuartal', 'High', 'active', '2026-05-31', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(103, 1, 1, 'Menyusun laporan bulanan', 'Rangkuman progres ke manajer', 'High', 'done', '2026-05-29', '2026-05-31 01:30:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(104, 1, 2, 'Mengerjakan tugas AI', 'Makalah tentang kecerdasan buatan', 'Med', 'active', '2026-06-01', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(105, 1, 2, 'Baca jurnal internasional', 'Review 5 paper untuk seminar', 'Low', 'done', '2026-05-28', '2026-05-28 18:45:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(106, 1, 3, 'Beli perlengkapan mandi', 'Sabun, sampo, pasta gigi', 'Low', 'active', '2026-06-05', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(107, 1, 3, 'Belanja buah mingguan', 'Apel, pisang, jeruk', 'Low', 'done', '2026-05-27', '2026-05-27 23:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(108, 1, 4, 'Medical check-up tahunan', 'Cek darah, rontgen, konsultasi', 'Med', 'active', '2026-06-03', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(109, 1, 4, 'Ambil obat resep', 'Antibiotik untuk flu', 'High', 'done', '2026-05-25', '2026-05-25 20:20:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(110, 1, 5, 'Bayar tagihan WiFi', 'Tagihan bulan Mei', 'High', 'active', '2026-05-31', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(111, 1, 5, 'Transfer cicilan KPR', 'Cicilan ke-12', 'High', 'done', '2026-05-30', '2026-05-30 19:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(112, 1, 6, 'Presentasi proposal proyek', 'Pitch ke stakeholder internal', 'High', 'active', '2026-05-30', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(113, 1, 6, 'Testing fitur baru', 'QA pada modul pembayaran', 'Med', 'done', '2026-05-26', '2026-05-27 02:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(114, 1, 7, 'Bersihkan gudang', 'Pilah barang bekas', 'Low', 'active', '2026-06-07', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(115, 1, 7, 'Ganti bohlam teras', 'Lampu mati, perlu diganti', 'Low', 'done', '2026-05-25', '2026-05-25 17:15:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(116, 1, 8, 'Lari pagi 5 km', 'Rute taman kota', 'Med', 'active', '2026-05-31', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(117, 1, 8, 'Yoga sore', 'Relaksasi 30 menit', 'Low', 'done', '2026-05-29', '2026-05-30 03:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(118, 1, 9, 'Menanam bibit cabai', 'Pot di halaman belakang', 'Low', 'active', '2026-06-10', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(119, 1, 9, 'Baca novel baru', 'Selesaikan 2 bab', 'Low', 'done', '2026-05-24', '2026-05-25 05:30:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(120, 1, 10, 'Rencanakan liburan ke Bali', 'Cari tiket dan hotel', 'Low', 'active', '2026-06-15', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(121, 1, 10, 'Booking penginapan', 'Villa di Ubud', 'Med', 'done', '2026-05-30', '2026-05-30 18:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(122, 1, 11, 'Beli kado ulang tahun ibu', 'Tas atau sepatu', 'Med', 'active', '2026-06-01', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(123, 1, 11, 'Telepon nenek', 'Ngobrol rutin mingguan', 'Low', 'done', '2026-05-29', '2026-05-30 00:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(124, 1, 12, 'Ikuti kursus online', 'Module 3 - React Hooks', 'Med', 'active', '2026-06-02', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(125, 1, 12, 'Kerjakan kuis mingguan', 'Deadline tadi malam', 'High', 'done', '2026-05-30', '2026-05-31 08:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(126, 1, 13, 'Webinar digital marketing', 'Zoom pukul 10.00', 'Med', 'active', '2026-06-04', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(127, 1, 13, 'Follow-up klien', 'Kirim proposal via email', 'High', 'done', '2026-05-26', '2026-05-26 21:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(128, 1, 14, 'Setor reksadana bulanan', 'Top-up portofolio', 'High', 'active', '2026-06-01', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(129, 1, 14, 'Cek laporan investasi', 'Review kinerja bulan lalu', 'Med', 'done', '2026-05-27', '2026-05-27 17:30:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(130, 1, 15, 'Nonton film baru', 'Bioskop akhir pekan', 'Low', 'active', '2026-06-06', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(131, 1, 15, 'Dengarkan podcast', 'Episode terbaru', 'Low', 'done', '2026-05-24', '2026-05-25 04:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(132, 1, 16, 'Masak rendang', 'Resep keluarga', 'Med', 'active', '2026-06-02', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(133, 1, 16, 'Beli bumbu dapur', 'Lengkuas, serai, daun jeruk', 'Low', 'done', '2026-05-29', '2026-05-29 19:30:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(134, 1, 17, 'Servis motor', 'Ganti oli & cek rem', 'High', 'active', '2026-05-30', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(135, 1, 17, 'Isi bensin full tank', 'Pertamax', 'Low', 'done', '2026-05-31', '2026-05-31 16:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(136, 1, 18, 'Vaksinasi kucing', 'Dokter hewan pukul 4', 'High', 'active', '2026-05-31', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(137, 1, 18, 'Beli makanan kucing', 'Stok untuk 2 minggu', 'Med', 'done', '2026-05-28', '2026-05-28 22:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(138, 1, 19, 'Rapat panitia acara', 'Koordinasi bakti sosial', 'Med', 'active', '2026-06-05', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(139, 1, 19, 'Cetak spanduk', 'Ukuran 2x1 meter', 'Low', 'done', '2026-05-27', '2026-05-28 01:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(140, 1, 20, 'Latihan Kotlin', 'Buat aplikasi sederhana', 'Med', 'active', '2026-06-08', NULL, '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(141, 1, 20, 'Selesaikan kursus Android', 'Module terakhir', 'High', 'done', '2026-05-30', '2026-05-31 07:00:00', '2026-06-01 10:15:58', '2026-06-01 10:15:58'),
(142, 9, NULL, 'mengerjakan tugas', 'tda', 'High', 'active', '2026-06-02', NULL, '2026-06-02 05:09:31', '2026-06-02 05:10:28'),
(143, 9, 27, 'MEMBUAT BISNIS', '', 'Med', 'active', NULL, NULL, '2026-06-02 05:11:21', '2026-06-02 05:11:21');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(64) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `token`, `created_at`) VALUES
(1, 'Airlangga', 'airlanggapangestuu@gmail.com', '$2y$10$.0j2j8Z75FxJ/.o98hlT4.RDc56gFsGyE1YDqhk1V.RfJ274f6M7m', 'd81d11eb984c9dac90a1d51a3d500417388b986a79b5b19581b5fda38076374f', '2026-05-12 18:19:35'),
(2, 'Izin', 'airlangga.pangestu49@smk.belajar.id', '$2y$10$I.O91dJlpswzDD2kpW4YoOEVp5h9G3Uufd98/X0CCqXoapdi8l1bu', 'c1e296f3e00bea23d6b6aeb6883cf93e376e4dbec09921466ee90912133b7e1e', '2026-05-12 18:47:11'),
(3, 'android', 'android@gmail.com', '$2y$10$uJDIF/VoVZqPqBsmj3imdejA.DhzPoDwWnkIJIstMHONUhAT4mDpa', 'b83dd134a9e4b7eb57d3aee44e7190d7ad94f787a172a486e970837eeecb4cd3', '2026-05-23 13:54:16'),
(4, 'albi memek', 'albi@gmail.com', '$2y$10$TLwOlpcJtxUKxLEAl64ENu79i1QgRyXioJsFR/N1hC6zOUAZhPWAO', 'c67951e80af8cc9132478e69ed368055422daf4034327a8d6eb57b2a2e75f119', '2026-05-25 07:19:35'),
(5, 'brengsek', 'brengsek@gmail.com', '$2y$10$r8Om8loXg.tGg5XP/Z0mPub0.R3oMR3AanHcE0gfTiPsDc934dvzW', '8e9941a2d46bb91c518f65a43efc93b618885f2c52869af3a22c5e43952b2795', '2026-05-30 05:14:16'),
(6, 'p', 'p@gmail.com', '$2y$10$6ZiEXNUcwrwO76d8gOTe7.1vuS.Aq3FvH6MDwO24sqiMSqGvpSs.2', 'd28d90177a3a08408423b0ddc30501eccc093b69a1a972936f0fd24a3794da73', '2026-05-30 18:48:08'),
(7, 'e', 'e@gmail.com', '$2y$10$iBWdvhZ.CgTvHnRdEpUGEuW98S9cDGgizmXqBr9k53vTk.ZPFowW6', 'd6074ef08074a33ae69baa6550097f5362864b38802efd0dffed0dee722b5782', '2026-05-31 11:17:02'),
(8, 'pangestu', 'o@gmail.com', '$2y$10$zEjTCbrltwOFew/kfSNneueigPmtFj3d2rE8ZtvksTi0W7B0iKhOO', '1c6330463ba65aa6e57872f948c40f25aeb1b3120d66e45db19184dbb803adee', '2026-06-01 04:57:11'),
(9, 'airlangga pangestu', 'airlangga@gmail.com', '$2y$10$UC/15F0.8uVLUfyOcVe69OHt3InK/AFkbhv7fUAyqPIC2f9/.ROoK', 'f9a02afeeaa7094b9fdfaf995e7fa94667159bd74090888a601232ec836889ee', '2026-06-02 05:07:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `todos`
--
ALTER TABLE `todos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `todos`
--
ALTER TABLE `todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=144;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `todos`
--
ALTER TABLE `todos`
  ADD CONSTRAINT `todos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `todos_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
