//Mencari elemen dengan class "daftar-portofolio" dan menyimpannya dalam variabel daftarPortofolio
const daftarPortofolio = document.querySelector(".daftar-portofolio");
//Mencari tombol dengan id "btn-tambah" dan menyimpannya dalam variabel tombolTambah
const tombolTambah = document.getElementById("btn-tambah");

function renderItem(data) {
    const kartu = document.createElement("kartu-artikel");
    kartu.setAttribute("judul", data.judul);
    kartu.setAttribute("isi", data.deskripsi);
    kartu.setAttribute("batas-like", "5");
    daftarPortofolio.appendChild(kartu);
}

//Jika tombolTambah ada, maka akan ditambahkan event listener yang akan menambahkan item baru ke daftar portofolio saat tombol diklik.  
if (tombolTambah) {
    tombolTambah.addEventListener("click", () => {
        const inputJudul = document.getElementById("input-judul");
        const inputDeskripsi = document.getElementById("input-deskripsi");
        
        //Jika input judul atau deskripsi kosong, maka akan menampilkan alert dan menghentikan eksekusi fungsi.
        if (inputJudul.value.trim() === "" || inputDeskripsi.value.trim() === "") {
            alert("Judul dan deskripsi harus diisi!");
            return;
        }
        const itemBaru = {
            judul: inputJudul.value,
            deskripsi: inputDeskripsi.value
        };
        renderItem(itemBaru);
        inputJudul.value = "";
        inputDeskripsi.value = "";
    });
}
//Form komentar ,validasi, error di halaman, daan tombol hapus masing-masing
const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");
const errorMessage = document.querySelector("#error-message");
const inputPesanKomen = document.querySelector("#input-pesan");
const tombolKirimKomentar = formKomentar.querySelector('button[type="submit"]');
let komentarDiedit = null;

//Pesan berdasarkan status code
function pesanDariStatus(status) {
    if (status === 404) return "Data tidak ditemukan di server.";
    if (status === 400) return "Data yang dikirim tidak valid.";
    if (status >= 500) return "Server sedang bermasalah, coba lagi nanti.";
    return "Terjadi kesalahan tidak terduga.";
}

//Mengirim komentar dengan POST 
async function kirimKomentarKeServer(nama, pesan) {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nama, body: pesan, postId: 1 }),
    });

    if (!response.ok) {
        const error = new Error("Gagal mengirim komentar, status: " + response.status);
        error.status = response.status;
        throw error;
    }
    return await response.json();
}

//Mengedit komentar dengan PATCH 
async function perbaruiKomentarKeServer(id, nama, pesan) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nama, body: pesan }),
    });

    if (!response.ok) {
        const error = new Error("Status: " + response.status);
        error.status = response.status;
        throw error;
    }
    return await response.json();
}

//Menampilkan respons POST 
function tampilkanKomentar(hasil) {
    const kartu = document.createElement("kartu-komentar");
    kartu.setAttribute("role", "listitem");
    kartu.setAttribute("nama", hasil.name);
    kartu.setAttribute("pesan", hasil.body);
    kartu.dataset.id = hasil.id;
    daftarKomentar.appendChild(kartu);
}

if (formKomentar) {
    formKomentar.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nama = document.querySelector("#input-nama").value.trim();
        const pesan = document.querySelector("#input-pesan").value.trim();

        //Validasi kosong
        if (nama === "" || pesan === "") {
            errorMessage.textContent = "Nama dan komentar wajib diisi!";
            errorMessage.classList.add("show");
            return;
        }

        //Validasi minimal 5 Karakter 
        if (pesan.length < 5) {
            errorMessage.textContent = "Komentar terlalu pendek! Minimal 5 karakter.";
            errorMessage.classList.add("show");
            return;
        }

        //Sembunyikan error jika berhasil
        errorMessage.classList.remove("show");
        tombolKirimKomentar.disabled = true; 

        try {
            if (komentarDiedit) {
                const hasil = await perbaruiKomentarKeServer(komentarDiedit.dataset.id, nama, pesan);
                komentarDiedit.setAttribute("nama", hasil.name);
                komentarDiedit.setAttribute("pesan", hasil.body);
                komentarDiedit = null;
                tombolKirimKomentar.textContent = "Kirim";
            } else {
                const hasil = await kirimKomentarKeServer(nama, pesan);
                console.log("Komentar tersimpan di server, id:", hasil.id);
                tampilkanKomentar(hasil);
            }
            formKomentar.reset();
            sessionStorage.removeItem("draftKomentar");
        } catch (error) {
            alert(pesanDariStatus(error.status));
            console.error(error);
        } finally {
            tombolKirimKomentar.disabled = false;
        }
    });
}

daftarKomentar.addEventListener("click", (e) => {
    const kartu = e.target.closest("kartu-komentar");
    if (e.target.matches(".btn-edit")) {
        komentarDiedit = kartu;
        document.querySelector("#input-nama").value = kartu.getAttribute("nama");
        inputPesanKomen.value = kartu.getAttribute("pesan");
        tombolKirimKomentar.textContent = "Simpan Perubahan";
    }
    if (e.target.matches(".btn-hapus") && kartu === komentarDiedit) {
        komentarDiedit = null;
        tombolKirimKomentar.textContent = "Kirim";
        formKomentar.reset();
        sessionStorage.removeItem("draftKomentar");
    }
});

//Tombol hapus semua komentar
const btnHapusSemua = document.getElementById("btn-hapus-semua");
if (btnHapusSemua) {
    btnHapusSemua.addEventListener("click", () => {
        daftarKomentar.replaceChildren();
        komentarDiedit = null;
        tombolKirimKomentar.textContent = "Kirim";
    });
}

//scroll untuk tombol "Kembali ke Atas"
const btnKembaliAtas = document.getElementById("btn-kembali-atas");
if (btnKembaliAtas) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            btnKembaliAtas.style.display = "block";
        } else {
            btnKembaliAtas.style.display = "none";
        }
    });

    btnKembaliAtas.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

//Keyboard shortcut dark mode
document.addEventListener("keydown", (e) => {
    //Abaikan jika sedang mengetik di kolom input atau textarea
    const sedangMengetik = ["INPUT", "TEXTAREA"].includes(e.target.tagName);
    if (!sedangMengetik && e.key.toLowerCase() === "d") {
        document.querySelector("tombol-tema").gantiTema();
    }
});

const btnReset = document.querySelector("#btn-reset");
if(btnReset){
    btnReset.addEventListener("click", () => {
        const konfirmasi = confirm("Hapus semua data");
        if(konfirmasi){
            localStorage.clear();
            location.reload();
        }
    });
}

if(inputPesanKomen){
    inputPesanKomen.addEventListener("input", function(){
        sessionStorage.setItem("draftKomentar", this.value);
    });

    const draft = sessionStorage.getItem("draftKomentar");
    if(draft){
        inputPesanKomen.value = draft;
    }
}

const btnTampilAside = document.getElementById("btn-tampil-aside");
const sidebar = document.querySelector("aside");

if(btnTampilAside && sidebar){
    const isAsideHidden = localStorage.getItem("asideStatus") === "true";
    if(isAsideHidden){
        sidebar.style.display = "none";
    }

    btnTampilAside.addEventListener("click", () => {
        const isHidden = sidebar.style.display === "none";
        if(isHidden){
            sidebar.style.display = "block";
            localStorage.setItem("asideStatus", "false");
        }else{
            sidebar.style.display = "none";
            localStorage.setItem("asideStatus", "true");
        }
    });
}

const wadah = document.querySelector(".daftar-artikel");
async function muatArtikel() {
  wadah.textContent = "Memuat artikel...";
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    if (!res.ok) throw new Error("Status: " + res.status);
    const data = await res.json();
    wadah.replaceChildren();
    data.forEach((post) => {
      const kartu = document.createElement("kartu-artikel");
      kartu.setAttribute("judul", post.title);
      kartu.setAttribute("isi", post.body);
      kartu.setAttribute("batas-like", "5");
      wadah.appendChild(kartu);
    });
  } catch (error) {
    wadah.textContent = "Gagal memuat artikel, silakan coba lagi.";
    console.error(error);
  }
}
muatArtikel();

//Mengambil komentar awal dari API
async function muatKomentarAPI() {
    const loading = document.querySelector("#loading");
    loading.style.display = "block";

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1/comments");

        if (!response.ok) {
            throw new Error("Status: " + response.status);
        }

        const daftar = await response.json();

        daftar.forEach((komentar) => {
            tampilkanKomentar(komentar);
        });

    } catch (error) {
        daftarKomentar.textContent = "Gagal memuat komentar, silakan coba lagi nanti.";
        console.error("Gagal memuat komentar:", error);
    } finally {
        loading.style.display = "none";
    }
}

muatKomentarAPI();

