# RESERVASI LAPANGAN SPORT CENTER (JTI Sport Center)

## Logo

<img src="./public/assets/logo/jtisportcenter_large.png" alt="JTI Sport Center Logo" style="width: 50%; height: auto; background-color: white; border-radius: 100%;">

## Overview

### Landing Page

<img src="./public/assets/overview/overview_1.png" alt="JTI Sport Center Logo">

### Katalog

<img src="./public/assets/overview/overview_2.png" alt="JTI Sport Center Logo">

### Responsive Mobile

<div style="display: flex; gap: 10px;">
  <img src="./public/assets/overview/mobile_1.png" alt="JTI Sport Center Logo" style="height: 300px">
  <img src="./public/assets/overview/mobile_2.png" alt="JTI Sport Center Logo" style="height: 300px">
  <img src="./public/assets/overview/mobile_3.png" alt="JTI Sport Center Logo" style="height: 300px">
</div>

## Tim Pengembang

<div style="display: flex; gap: 10px; margin-bottom:20px;">
  <img src="./public/assets/team/alifia_team.png" alt="Tim Pengembang" style="height: 100px">
  <img src="./public/assets/team/ello_team.png" alt="Tim Pengembang" style="height: 100px">
  <img src="./public/assets/team/juan_team.png" alt="Tim Pengembang" style="height: 100px">
  <img src="./public/assets/team/imam_team.png" alt="Tim Pengembang" style="height: 100px">
  <img src="./public/assets/team/abhel_team.png" alt="Tim Pengembang" style="height: 100px;">
</div>

- Alifia Bilqi Firajulkha (2241720024)
- Ellois Karina Handoyo (2241720154)
- Juan Felix Antonio Nathan Tote (2241720042)
- Mochamad Imam Hanafi (2241720151)
- Zhubair Abhel Frisky Maulana Zidhane (2141720248)

## Deskripsi Proyek

Aplikasi web untuk sistem reservasi lapangan olahraga di Sport Center JTI Polinema.

## Teknologi yang Digunakan

<div style="display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0;">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</div>

## Tools

<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="https://img.shields.io/badge/Laragon-0E83CD?style=for-the-badge&logo=laragon&logoColor=white" alt="Laragon">
  <img src="https://img.shields.io/badge/XAMPP-FB7A24?style=for-the-badge&logo=xampp&logoColor=white" alt="XAMPP">
  <img src="https://img.shields.io/badge/phpMyAdmin-6C78AF?style=for-the-badge&logo=phpmyadmin&logoColor=white" alt="phpMyAdmin">
  <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma">
  <img src="https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="VSCode">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="NPM">
  <img src="https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white" alt="Yarn">
</div>

## Persyaratan Sistem

- Node.js (versi 18.x atau lebih baru)
- npm atau yarn
- Git
- Database (sesuaikan dengan konfigurasi Prisma)
- Laragon / XAMPP (Run PhpMyAdmin)

## Cara Menjalankan Proyek

### 1. Clone Repository

```bash
git clone [URL_REPOSITORY]
cd Reservasi-Lapangan-Sport-Center
```

### 2. Install Dependencies (Node.js)

```bash
npm install
# atau
yarn install
```

### 3. Konfigurasi Environment

1. Buat file `.env` di root proyek (untuk Prisma) dan sesuaikan dengan konfigurasi berikut:

   ```env
   DATABASE_URL="[URL_DATABASE_ANDA]"

   CONTOH:
   DATABASE_URL="mysql://[dbuser]:[dbpass]@[dbhost]:3306/[namadb]"
   ```

2. Buat file `.env.local` di root proyek (untuk MySQL + Login) dan sesuaikan dengan konfigurasi berikut:

   ```env.local
   # CONN_DB
    DB_HOST=[dbhost]
    DB_USER=[dbuser]
    DB_PASS=[dbpass]
    DB_NAME=[dbname]

    # JWT SECRET
    JWT_SECRET=[nama_bebas_sebagai_kunci]
   ```

### 4. Setup Database

1. Buat Database MySQL (phpmyadmin) -> Nama DB (Bebas) -> **Buat Database Baru supaya tidak tabrakan!**

2. Run Migrasi + Seeder PRISMA

   ```bash
   npx prisma migrate reset
   ```

   - Peringatan:

     Jika di local banyak data saat development, **Jangan Migrate Reset jika tidak ingin kehilangan data selain di Seeder**, karena sistemnya akan mereset semua data dan mengulangi kembali migrasi + seeder Prisma!

   - Saran:

     Tambah atau ubah saja isi seeder supaya aman untuk `migrate reset`, tapi akan tetap hilang data jika memasukkan data didalam CRUD, jadi ingat!!

3. Ingin Update Model dan Seeder PRISMA

   -> Pergi ke folder `/prisma` dan update

   a. `schema.prisma` untuk mengupdate model Prisma

   b. `seed` untuk mengatur seeder database

### 5. Jalankan Aplikasi

```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Struktur Proyek

- `/components` - Komponen React yang dapat digunakan kembali
- `/pages` - Halaman-halaman aplikasi dan API
- `/prisma` - Konfigurasi dan skema database
- `/public` - Aset statis
- `/styles` - File CSS dan styling
- `/context` - React Context untuk state management (Experimental)
- `/lib` - Utility functions dan konfigurasi

## Troubleshooting

Jika mengalami masalah saat instalasi atau menjalankan proyek:

1. Pastikan Node.js dan npm terinstall dengan benar (versi terbaru)
2. Hapus folder `node_modules` dan file `package-lock.json`
3. Jalankan `npm install` kembali
4. Pastikan konfigurasi database sudah benar di file `.env` dan `.env.local`
