Di code/Profil-255314032.html, saya menautkan komponen.js lebih dahulu agar semua komponen sudah terdaftar ketika script.js membuat kartu dari data.
<script src="../script/komponen.js"></script>
<script src="../script/script.js"></script>
1. Sapaan dan artikel
Komponen <salam-pengguna> membaca atribut nama. Saya memasang contoh menggunakan nilai bawaan Tamu.

Untuk daftar artikel, fungsi muatArtikel() meminta lima artikel melalui endpoint /posts?_limit=5. Selama menunggu, halaman menampilkan pesan pemuatan. Setelah respons berhasil, fungsi mengosongkan wadah dan membuat satu kartu untuk setiap artikel. Berikut potongan kode di dalam perulangan.
const kartu = document.createElement("kartu-artikel");
kartu.setAttribute("judul", post.title);
kartu.setAttribute("isi", post.body);
kartu.setAttribute("batas-like", "5");
wadah.appendChild(kartu);
Formulir portofolio membuat jenis kartu yang sama dari judul dan deskripsi yang saya masukkan. Kartu manual dan kartu dari API ditampilkan pada dua daftar terpisah. Jika pengambilan artikel gagal, pesan kesalahan muncul di daftar API.
2. Tugas mandiri
Saya membuat <kartu-komentar> dengan atribut nama dan pesan. Tombol Hapus berada di dalam komponen dan menjalankan this.remove() untuk melepas komentar dari halaman. Penghapusan ini hanya berlaku pada tampilan halaman saat itu.

Komponen <tombol-tema> mengganti kelas dark-mode pada elemen body. Pilihannya disimpan menggunakan key tema dengan nilai dark atau light. Untuk bagian opsional, saya menetapkan batas-like="5" pada kartu artikel. Saat jumlah Like mencapai lima, komponen menonaktifkan tombolnya.