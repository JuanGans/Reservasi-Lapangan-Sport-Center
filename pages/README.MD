## Struktur Halaman (Pages)

### Halaman Utama

- `/` (`index.tsx`) - Halaman beranda
- `/about` (`about.tsx`) - Halaman tentang kami
- `/catalog` (`catalog.tsx`) - Halaman katalog lapangan
- `/detail_catalog` (`detail_catalog.tsx`) - Halaman detail katalog lapangan

### Autentikasi

- `/login` (`login.tsx`) - Halaman login
- `/register` (`register.tsx`) - Halaman pendaftaran
- `/forget_password` (`forget_password.tsx`) - Halaman lupa password
- `/ubah_password` (`ubah_password.tsx`) - Halaman ubah password

### Area Member

- `/member/*` - Halaman-halaman khusus member
  - Dashboard member
  - Riwayat reservasi
  - Pengaturan akun

### Area Admin

- `/admin/*` - Halaman-halaman khusus admin
  - Dashboard admin
  - Manajemen lapangan
  - Manajemen reservasi
  - Manajemen user

### API Routes

- `/api/*` - Endpoint API untuk:
  - Autentikasi
  - Manajemen data
  - Integrasi sistem

### Profile

- `/profile/*` - Halaman-halaman terkait profil pengguna

### File Konfigurasi

- `_app.tsx` - File konfigurasi utama Next.js
- `_document.tsx` - File konfigurasi HTML document

## Alur Navigasi

1. **Pengunjung (Guest)**

   - Dapat mengakses halaman beranda, about, dan catalog
   - Harus login/register untuk melakukan reservasi

2. **Member**

   - Akses ke semua fitur reservasi
   - Dapat melihat riwayat reservasi
   - Dapat mengelola profil

3. **Admin**
   - Akses ke dashboard admin
   - Dapat mengelola semua data sistem
   - Dapat melihat laporan dan statistik
