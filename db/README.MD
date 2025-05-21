# DATABASE

## Entity

1. `users`

   i. **Fungsi**

   Menyimpan data pengguna yang melakukan pemesanan lapangan, dan data admin yang mengelola data dalam sistem website.

   ii. **Cakupan**

   Tabel ini mencakup informasi dasar pengguna seperti nama lengkap, email, username, password, dan peran (role). Ini memungkinkan untuk melakukan otentikasi pengguna dan mengelompokkan mereka ke dalam kategori "member" atau "admin".

   iii. **Tabel**

   | Name     | Type                   | Length | Default | Mandatory | Keterangan                                             |
   | -------- | ---------------------- | ------ | ------- | --------- | ------------------------------------------------------ |
   | id       | Integer                | —      | —       | Yes       | Primary key, auto-increment                            |
   | fullname | Varchar                | 255    | —       | Yes       | Nama lengkap pengguna                                  |
   | email    | Varchar                | 255    | —       | Yes       | Alamat email, bisa digunakan sebagai login atau kontak |
   | username | Varchar                | 100    | —       | Yes       | Nama pengguna unik untuk login                         |
   | password | Varchar                | 255    | —       | Yes       | Password yang di-hash                                  |
   | role     | Enum('member','admin') | —      | 'user'  | Yes       | Peran pengguna dalam sistem                            |

2. `facilities`

   i. **Fungsi**

   Menyimpan informasi tentang lapangan yang dapat disewa.

   ii. **Cakupan**

   Tabel ini mencakup nama lapangan, deskripsi, gambar lapangan (yang bisa lebih dari satu), dan harga per sesi. Ini akan memungkinkan pengguna untuk melihat lapangan mana yang tersedia dan biaya sewa lapangan.

   iii. **Tabel**

   | Name              | Type    | Length | Default | Mandatory                          | Keterangan                                                                         |
   | ----------------- | ------- | ------ | ------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
   | id                | Integer | —      | —       | Yes                                | Primary key, auto-increment                                                        |
   | field_name        | Varchar | 255    | —       | Yes                                | Nama lapangan                                                                      |
   | field_desc        | Varchar | 255    | —       | Yes                                | Deskripsi lapangan                                                                 |
   | field_image       | Varchar | 1000   | —       | No                                 | Menyimpan URL atau path gambar (bisa lebih dari satu jika dipisah koma, JSON, dll) |
   | price_per_session | decimal | 100    | —       | Yes                                | Harga sewa per sesi                                                                |
   | avg_rating        | Float   | 0      | Yes     | Rata-rata rating dari semua review |
   | total_review      | Integer | 0      | Yes     | Total jumlah review yang diterima  |

3. `bookings`

   i. **Fungsi**

   Menyimpan data pemesanan lapangan oleh pengguna.

   ii. **Cakupan**

   Tabel ini menyimpan informasi tentang siapa yang melakukan pemesanan (user_id), lapangan yang dipesan (facilities_id), tanggal pemesanan (booking_date), dan status pemesanan (status), apakah dalam proses, berhasil, dibatalkan, atau selesai.

   iii. **Tabel**

   | Name           | Type                                             | Default   | Mandatory | Keterangan                      |
   | -------------- | ------------------------------------------------ | --------- | --------- | ------------------------------- |
   | id             | Integer                                          | —         | Yes       | Primary key, auto-increment     |
   | user_id        | Integer                                          | —         | Yes       | Foreign key ke tabel `users`    |
   | facilities_id  | Integer                                          | —         | Yes       | Foreign key ke `facilities`     |
   | booking_date   | Date                                             | —         | Yes       | Tanggal booking dibuat          |
   | booking_status | Enum('pending', 'paid', 'canceled', 'completed') | 'pending' | Yes       | Status dari booking + transaksi |
   | created_at     | Datetime                                         | NOW()     | Yes       | Waktu booking dibuat            |
   | updated_at     | Datetime                                         | NOW()     | Yes       | Waktu booking diupdate          |

4. `booking_sessions`

   i. **Fungsi**

   Menyimpan sesi yang lebih terperinci dari pemesanan lapangan.

   ii. **Cakupan**

   Tabel ini menyimpan data tentang waktu mulai (start_time) dan waktu selesai (end_time) untuk setiap sesi pemesanan lapangan. Jika pemesanan dilakukan untuk lebih dari satu sesi, setiap sesi akan tercatat dalam tabel ini.

   iii. **Tabel**

   | Name       | Type    | Default | Mandatory | Keterangan                      |
   | ---------- | ------- | ------- | --------- | ------------------------------- |
   | id         | Integer | —       | Yes       | Primary key, auto-increment     |
   | booking_id | Integer | —       | Yes       | Foreign key ke tabel `bookings` |
   | start_time | Time    | —       | Yes       | Waktu mulai sesi                |
   | end_time   | Time    | —       | Yes       | Waktu selesai sesi              |

5. `transaction`

   i. **Fungsi**
   Menyimpan informasi transaksi pembayaran yang terkait dengan pemesanan lapangan.

   ii. **Cakupan**

   Tabel ini mencakup data transaksi seperti metode pembayaran (method_payment), status transaksi (transaction_status), dan hubungan ke tabel bookings untuk menghubungkan transaksi dengan pemesanan lapangan tertentu.

   iii. **Tabel**

   | Name           | Type                                    | Default    | Mandatory | Keterangan                       |
   | -------------- | --------------------------------------- | ---------- | --------- | -------------------------------- |
   | id             | Integer                                 | —          | Yes       | Primary key, auto-increment      |
   | booking_id     | Integer                                 | —          | Yes       | Foreign key ke tabel `bookings`  |
   | total          | Integer                                 | —          | Yes       | Total harga transaksi            |
   | method_payment | Enum('transfer', 'credit_card', 'cash') | 'transfer' | Yes       | Metode pembayaran yang digunakan |
   | created_at     | Datetime                                | NOW()      | Yes       | Waktu transaksi dibuat           |
   | updated_at     | Datetime                                | NOW()      | Yes       | Waktu transaksi diupdate         |

6. `reviews`

   i. **Fungsi**

   Menyimpan ulasan dan penilaian (rating) dari pengguna setelah melakukan booking.

   ii. **Cakupan**

   Satu review hanya bisa diberikan untuk satu booking yang telah selesai.

   iii. **Tabel**

   | Name       | Type     | Default | Mandatory | Keterangan                                                           |
   | ---------- | -------- | ------- | --------- | -------------------------------------------------------------------- |
   | id         | Integer  | —       | Yes       | Primary key, auto-increment                                          |
   | booking_id | Integer  | —       | Yes       | Foreign key ke tabel `bookings` untuk memastikan user pernah booking |
   | rating     | Integer  | —       | Yes       | Nilai rating, misalnya dari 1–5                                      |
   | comment    | Text     | —       | No        | Komentar opsional dari pengguna                                      |
   | created_at | Datetime | NOW()   | Yes       | Waktu review dibuat                                                  |
   | updated_at | Datetime | NOW()   | Yes       | Waktu review diupdate                                                |

7. `notifications`

   i. **Fungsi**

   Menyimpan notifikasi yang dikirimkan ke pengguna, baik karena update status pemesanan, pembayaran, pembatalan, dll.

   ii. **Cakupan**

   Notifikasi bisa diarahkan ke user (member) maupun admin, dengan isi pesan yang relevan dan status apakah notifikasi sudah dibaca.

   iii. **Tabel**

   | Name       | Type                                      | Default | Mandatory | Keterangan                                     |
   | ---------- | ----------------------------------------- | ------- | --------- | ---------------------------------------------- |
   | id         | Integer                                   | —       | Yes       | Primary key, auto-increment                    |
   | user_id    | Integer                                   | —       | Yes       | Foreign key ke tabel `users`                   |
   | message    | Text                                      | —       | Yes       | Isi notifikasi                                 |
   | type       | Enum('info','warning','success','danger') | 'info'  | Yes       | Jenis notifikasi (misal info, peringatan, dll) |
   | is_read    | Boolean                                   | false   | Yes       | Status apakah sudah dibaca oleh user           |
   | created_at | Datetime                                  | NOW()   | Yes       | Waktu notifikasi dikirimkan                    |

## B. Relasi

- users ⇄ bookings → (1:M)
- users ⇄ notifications → (1:M)
- facilities ⇄ bookings → (1:M)
- bookings ⇄ booking_sessions → (1:M)
- bookings ⇄ transactions → (1:1)
- bookings ⇄ reviews → (1:1)

<!-- ## cancellations -->

<!-- id INT PRIMARY KEY AUTO_INCREMENT
booking_id INT NOT NULL
canceled_by INT -- FK ke users (admin/member)
cancel_reason TEXT
penalty_fee DECIMAL(10,2) DEFAULT 0
created_at DATETIME DEFAULT NOW() -->
