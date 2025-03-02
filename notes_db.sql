-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 02 Mar 2025 pada 08.39
-- Versi server: 10.4.24-MariaDB
-- Versi PHP: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `notes_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `notes`
--

INSERT INTO `notes` (`id`, `title`, `content`, `created_at`) VALUES
(2, 'Mau makan', 'ayam kecap, sapi lada hitam dan ayam asam manis', '2025-03-01 10:10:38'),
(4, 'Aku siapa', 'bukan siapa - siapa', '2025-03-01 10:36:58'),
(6, 'tes', 'ini hanya uji coba', '2025-03-01 12:02:54'),
(9, 'trump', '\"Pria kuat menciptakan perdamaian, sementara pria lemah menciptakan perang. Hari ini, Presiden @realDonaldTrump dengan berani membela perdamaian, meskipun sulit diterima oleh banyak orang. Terima kasih, Tuan Presiden!\" tulis Orban dalam sebuah unggahan di X.\n\nCuitan Orban itu keluar tak lama setelah berita soal pertemuan Trump dan Zelensky yang berakhir bencana beredar luas.\n\nOrban memang merupakan negara Eropa sekutu dekat Presiden Rusia Vladimir Putin. Ia bahkan terang-terangan mendukung invasi Rusia ke Ukraina.\n\nSementara itu, Trump mengusir Zelensky dari Gedung Putih dan membatalkan rangkaian pertemuan keduanya mulai dari jamuan makan siang hingga pernyataan pers bersama yang biasanya digelar ketika ada pemimpin negara yang berkunjung.\n\nBaca artikel CNN Indonesia \"Negara Eropa Ini Malah Dukung Trump Keras ke Zelensky usai Pengusiran\" selengkapnya di sini: ', '2025-03-01 14:09:55'),
(10, 'TCC', 'Ketentuan Tugas :\n1. Spesifikasi detail penugasan ada di file pdf\n2. Tugas tenggat waktu 2 minggu, sudah sama laporannya\n3. Template laporan : https://docs.google.com/document/d/1SzvOZFinTdPtp8qZdje9ibJnbOeiBf09/edit?usp=sharing&ouid=103829383931896782496&rtpof=true&sd=true\n4. Format pengumpulan : nim_nama_laporan_tugas2', '2025-03-01 14:10:45'),
(13, 'tes markdown', '# Catatan Harian ????  \n\n## Rencana Hari Ini  \n- [x] Belajar **Markdown**  \n- [ ] Mengimplementasikan di aplikasi catatan  \n- [ ] Review kode di **GitHub**  \n\n*Italic Text*\n`Inline Code`\n> This is a blockquote.\n---\n~~Strikethrough~~\n[Link Github](https://github.com/NaufalR12)\n', '2025-03-01 14:57:21');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
