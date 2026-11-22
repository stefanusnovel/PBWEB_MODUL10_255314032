//Menampilkan sapaan pengguna
class SalamPengguna extends HTMLElement {
  connectedCallback() {
    const nama = this.getAttribute("nama") || "Tamu";
    this.textContent = `Halo, ${nama}! Selamat datang di blog.`;
  }
}
customElements.define("salam-pengguna", SalamPengguna);

//Membuat kartu artikel dengan tombol Like dan Hapus
class KartuArtikel extends HTMLElement {
  #like = 0;
  static get observedAttributes() { return ["judul", "isi", "batas-like"]; }
  connectedCallback() { this.render(); }
  disconnectedCallback() { console.log("kartu-artikel dilepas"); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    this.innerHTML = `<article class="kartu"><h3></h3><p></p>
      <button class="btn-like"></button>
      <button class="btn-hapus">Hapus</button></article>`;
    this.querySelector("h3").textContent = this.getAttribute("judul") ?? "";
    this.querySelector("p").textContent  = this.getAttribute("isi")   ?? "";
    const like = this.querySelector(".btn-like");
    const atribut = this.getAttribute("batas-like");
    const batas = Number(atribut);
    const adaBatas = atribut?.trim() && Number.isInteger(batas) && batas >= 0;
    like.textContent = `Like (${this.#like})`;
    like.disabled = adaBatas && this.#like >= batas;
    like.addEventListener("click", () => {
      this.#like++;
      like.textContent = `Like (${this.#like})`;
      like.disabled = adaBatas && this.#like >= batas;
    });
    this.querySelector(".btn-hapus")
        .addEventListener("click", () => this.remove());
  }
}
customElements.define("kartu-artikel", KartuArtikel);

//Menampilkan nama dan pesan pada kartu komentar
class KartuKomentar extends HTMLElement {
  static get observedAttributes() { return ["nama", "pesan"]; }

  connectedCallback() { this.render(); }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    this.innerHTML = `<span></span>
      <button type="button" class="btn-edit">Edit</button>
      <button type="button" class="btn-hapus">Hapus</button>`;
    const nama = this.getAttribute("nama") ?? "";
    const pesan = this.getAttribute("pesan") ?? "";
    this.querySelector("span").textContent = `${nama}: ${pesan}`;
    this.querySelector(".btn-hapus").addEventListener("click", () => this.remove());
  }
}
customElements.define("kartu-komentar", KartuKomentar);

//Mengganti tema dan menyimpan pilihan pengguna
class TombolTema extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<button type="button" id="btn-tema" class="btn-tema">Ganti Tema</button>';
    document.body.classList.toggle("dark-mode", localStorage.getItem("tema") === "dark");
    this.querySelector("button").addEventListener("click", () => this.gantiTema());
  }

  gantiTema() {
    const gelap = document.body.classList.toggle("dark-mode");
    localStorage.setItem("tema", gelap ? "dark" : "light");
  }
}
customElements.define("tombol-tema", TombolTema);
