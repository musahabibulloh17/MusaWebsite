# Galeri Portofolio 3D - Musa

Website galeri portofolio interaktif dengan teknologi 3D yang memungkinkan pengunjung untuk berjalan-jalan di dalam ruang virtual galeri seni dan menikmati pengalaman immersive.

## 🚀 Cara Menjalankan Website

### **Metode 1: Python HTTP Server (Direkomendasikan)**

1. **Buka Terminal/Command Prompt** di folder project
2. **Jalankan server HTTP**:
   ```bash
   python -m http.server 8000
   ```
3. **Buka browser** dan akses: `http://localhost:8000`

### **Metode 2: Live Server (VS Code)**

1. **Install Live Server extension** di VS Code
2. **Right-click** pada `index.html`
3. **Pilih "Open with Live Server"**

### **Metode 3: Browser Langsung**

1. **Buka file** `index.html` langsung di browser
2. **Catatan**: Beberapa fitur mungkin tidak berfungsi karena CORS policy

## 🎮 Fitur Utama

- **Navigasi 3D**: Berjalan-jalan di dalam galeri menggunakan WASD
- **Mouse Look**: Lihat sekeliling dengan mouse
- **Background Music**: Musik otomatis saat mulai eksplorasi
- **Keyboard Shortcuts**: Enter untuk mulai, ESC/Shift untuk keluar
- **Performance Optimized**: Smooth 60fps di laptop standar
- **Room Containment**: Kamera tetap di dalam galeri

## 🎯 Kontrol Navigasi

- **W**: Maju
- **A**: Kiri  
- **S**: Mundur
- **D**: Kanan
- **Mouse**: Lihat sekeliling
- **Enter**: Mulai navigasi
- **ESC/Shift**: Keluar dari navigasi

## 🛠️ Teknologi yang Digunakan

- **Three.js**: Library 3D JavaScript untuk rendering
- **GLTFLoader**: Loading model 3D GLB/GLTF
- **PointerLockControls**: First-person camera controls
- **HTML5 Audio**: Background music
- **CSS3**: Modern styling dengan gradient
- **JavaScript ES6**: Logika interaksi dan navigasi 3D

## 📁 Struktur File

```
├── index.html                              # Halaman utama
├── styles.css                              # Styling CSS
├── script.js                               # Logika JavaScript 3D
├── asset/
│   ├── richards_art_gallery_-_audio_tour.glb  # Model 3D galeri
│   └── Song.mp3                               # Background music
└── README.md                               # Dokumentasi
```

## 🎨 Kustomisasi

### **Mengganti Model 3D**

1. **Ganti file GLB** di folder `asset/`
2. **Update path** di `script.js`:
   ```javascript
   const glbPath = './asset/your-new-model.glb';
   ```

### **Mengubah Background Music**

1. **Ganti file audio** di folder `asset/`
2. **Update path** di `index.html`:
   ```html
   <audio id="background-music" loop>
       <source src="asset/your-new-music.mp3" type="audio/mpeg">
   </audio>
   ```

### **Mengubah Tema Warna**

Edit variabel CSS di file `styles.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🔧 Troubleshooting

### **GLB Model Tidak Muncul**
- Pastikan file GLB ada di folder `asset/`
- Jalankan dengan HTTP server (bukan file://)
- Cek console browser untuk error

### **Musik Tidak Berfungsi**
- Pastikan file audio ada di folder `asset/`
- Browser mungkin memblokir autoplay
- Klik manual untuk memulai musik

### **Navigasi Tidak Responsif**
- Pastikan menggunakan browser modern
- Cek apakah JavaScript enabled
- Refresh halaman dan coba lagi

## 🌐 Browser yang Didukung

- **Chrome 60+** (Direkomendasikan)
- **Firefox 55+**
- **Safari 12+**
- **Edge 79+**

## 📋 Requirements

- **Python 3.x** (untuk HTTP server)
- **Browser modern** dengan WebGL support
- **JavaScript enabled**

## 🚀 Deployment

### **GitHub Pages**
1. Upload semua file ke repository GitHub
2. Enable GitHub Pages di Settings
3. Pilih branch main sebagai source

### **Netlify**
1. Drag & drop folder project ke Netlify
2. Website akan otomatis deploy
3. Dapatkan URL publik

### **Vercel**
1. Install Vercel CLI
2. Run `vercel` di folder project
3. Follow setup instructions

## 📄 Lisensi

MIT License - bebas digunakan untuk proyek pribadi dan komersial.

## 👨‍💻 Author

**Musa** - 3D Portfolio Gallery
