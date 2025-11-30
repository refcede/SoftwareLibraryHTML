document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. FUNGSI DARK MODE
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Cek tema yang tersimpan di local storage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Simpan preferensi tema
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // ==========================================
    // 2. FUNGSI SEARCH BAR + NO RESULT MESSAGE
    // ==========================================
    const searchBar = document.getElementById('search-bar');
    const cards = document.getElementsByClassName('software-card');
    const noResultMsg = document.getElementById('no-result');

    if (searchBar) { // Pastikan search bar ada
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            let hasVisibleCard = false;

            Array.from(cards).forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const desc = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                    card.style.display = 'flex'; // Kembalikan ke flex (sesuai CSS baru)
                    hasVisibleCard = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // Tampilkan pesan jika tidak ada hasil
            if (hasVisibleCard) {
                noResultMsg.style.display = 'none';
            } else {
                noResultMsg.style.display = 'block';
            }
        });
    }

    // ==========================================
    // 3. FUNGSI VERSION TOGGLE (DROPDOWN)
    // ==========================================
    const versionButtons = document.querySelectorAll('.version-toggle-btn');

    versionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Mencegah klik tembus
            
            const versionList = button.nextElementSibling;
            const toggleIcon = button.querySelector('.toggle-icon');

            // Toggle logika
            if (versionList.style.display === 'none' || versionList.style.display === '') {
                versionList.style.display = 'block';
                toggleIcon.classList.remove('fa-chevron-down');
                toggleIcon.classList.add('fa-chevron-up');
            } else {
                versionList.style.display = 'none';
                toggleIcon.classList.remove('fa-chevron-up');
                toggleIcon.classList.add('fa-chevron-down');
            }
        });
    });

    // ==========================================
    // 4. FUNGSI HAMBURGER MENU (RESPONSIVE)
    // ==========================================
    const hamburger = document.getElementById('hamburger-btn');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Pastikan elemen hamburger ada sebelum menjalankan script (mencegah error)
    if (hamburger && navbar) {
        
        // Toggle Menu saat tombol hamburger diklik
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Tutup menu saat salah satu link diklik
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
            });
        });

        // Tutup menu jika user klik di luar area menu (UX Enhancement)
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navbar.contains(e.target)) {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
            }
        });
    }

});

// ==========================================
    // 5. TOAST NOTIFICATION SYSTEM
    // ==========================================
    
    // Fungsi membuat notifikasi
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        
        // Buat elemen toast baru
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Icon berdasarkan tipe
        let iconMarkup = '<i class="fas fa-check-circle"></i>';
        if (type === 'info') iconMarkup = '<i class="fas fa-info-circle"></i>';
        
        toast.innerHTML = `${iconMarkup} <span>${message}</span>`;
        
        // Masukkan ke container
        container.appendChild(toast);
        
        // Trigger animasi masuk (perlu delay sedikit biar CSS transition jalan)
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Hapus toast setelah 3 detik
        setTimeout(() => {
            toast.classList.remove('show');
            // Hapus elemen dari DOM setelah animasi keluar selesai
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
    }

    // Pasang Event Listener ke SEMUA tombol download (termasuk link download & dropdown)
    const allDownloadBtns = document.querySelectorAll('a[download], .version-link');

    allDownloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Ambil nama software dari elemen terdekat (h3 atau strong)
            let softwareName = "File";
            
            // Coba cari nama di dalam kartu parent
            const card = this.closest('.software-card');
            if (card) {
                const title = card.querySelector('h3');
                if (title) softwareName = title.textContent;
            }
            
            // Jika yang diklik adalah link versi (dropdown)
            if (this.classList.contains('version-link')) {
                const versionText = this.querySelector('strong').textContent;
                showToast(`Mengunduh ${versionText}...`);
            } else {
                showToast(`Mengunduh ${softwareName}...`);
            }
        });
    });

    // ==========================================
    // 6. MODAL PANDUAN INSTALL (POP-UP)
    // ==========================================

    // A. DATABASE PANDUAN (Isi teks panduan di sini)
    const guidesData = {
        'java': `
            <ol>
                <li>Download file <strong>JDK Installer</strong> sesuai versi.</li>
                <li>Jalankan file <code>.exe</code> dan klik Next terus sampai Finish.</li>
                <li><strong>PENTING:</strong> Setting Environment Variable.</li>
                <li>Buka Search Windows > ketik "env" > Pilih "Edit the system environment variables".</li>
                <li>Klik tombol <strong>Environment Variables</strong>.</li>
                <li>Di bagian "System Variables", cari <strong>Path</strong> lalu klik Edit > New.</li>
                <li>Paste lokasi bin Java (Cth: <code>C:\\Program Files\\Java\\jdk-24\\bin</code>).</li>
                <li>Klik OK semua window. Cek di CMD ketik <code>java -version</code>.</li>
            </ol>
        `,
        'java 17': `
            <ol>
                <li>Download file <strong>JDK Installer</strong> sesuai versi.</li>
                <li>Jalankan file <code>.exe</code> dan klik Next terus sampai Finish.</li>
                <li><strong>PENTING:</strong> Setting Environment Variable.</li>
                <li>Buka Search Windows > ketik "env" > Pilih "Edit the system environment variables".</li>
                <li>Klik tombol <strong>Environment Variables</strong>.</li>
                <li>Di bagian "System Variables", cari <strong>Path</strong> lalu klik Edit > New.</li>
                <li>Paste lokasi bin Java (Cth: <code>C:\\Program Files\\Java\\jdk-17\\bin</code>).</li>
                <li>Klik OK semua window. Cek di CMD ketik <code>java -version</code>.</li>
            </ol>
        `,
        'java 8': `
            <ol>
                <li>Download file <strong>JDK Installer</strong> sesuai versi.</li>
                <li>Jalankan file <code>.exe</code> dan klik Next terus sampai Finish.</li>
                <li><strong>PENTING:</strong> Setting Environment Variable.</li>
                <li>Buka Search Windows > ketik "env" > Pilih "Edit the system environment variables".</li>
                <li>Klik tombol <strong>Environment Variables</strong>.</li>
                <li>Di bagian "System Variables", cari <strong>Path</strong> lalu klik Edit > New.</li>
                <li>Paste lokasi bin Java (Cth: <code>C:\\Program Files\\Java\\jdk-8\\bin</code>).</li>
                <li>Klik OK semua window. Cek di CMD ketik <code>java -version</code>.</li>
            </ol>
        `,
        'mysql': `
            <ol>
                <li>Download file <strong>MYSQL Connector.rar</strong>.</li>
                <li>Ekstrak file <code>mysql-connector-j-9.4.0.rar</code> taruh dimana saja.</li>
                <li><strong>Buka netbeans, dan buka proyek java elu pada:</strong> Lihat pada panel sebelah kiri di tab Projects (Proyek).</li>
                <li>Cari folder bernama Libraries di dalam struktur proyek elu pada.</li>
                <li>Klik Kanan pada folder <code> Libraries </code> tersebut Pilih menu <strong>Add JAR/Folder....</strong>.</li>
                <li>Jendela file explorer akan muncul. Cari lokasi di mana Anda menyimpan file <code>mysql-connector-j-9.4.0.jar</code>.</li>
                <li>Pilih file tersebut dan klik Open (atau Add)..</li>
                <li>Selesai. Anda akan melihat file tersebut sekarang terdaftar di bawah folder Libraries.</li>
            </ol>
        `,
        'flatlaf': `
            <ol>
                <li>Download file <strong>Flatlaf.jar</strong>.</li>
                <li>jika file <code>flatlaf.jar</code> sudah didownload.</li>
                <li><strong>Buka netbeans, dan buka proyek java elu pada:</strong> Lihat pada panel sebelah kiri di tab Projects (Proyek).</li>
                <li>Cari folder bernama Libraries di dalam struktur proyek elu pada.</li>
                <li>Klik Kanan pada folder <code> Libraries </code> tersebut Pilih menu <strong>Add JAR/Folder....</strong>.</li>
                <li>Jendela file explorer akan muncul. Cari lokasi di mana Anda menyimpan file <code>flatlaf.jar</code>.</li>
                <li>Pilih file tersebut dan klik Open (atau Add)..</li>
                <li>Selesai. Anda akan melihat file tersebut sekarang terdaftar di bawah folder Libraries, untuk memanggil flatlaf nya nya, lu pada cari aja sendiri di google yah.</li>
            </ol>
        `,
        'xampp': `
            <ol>
                <li>Jalankan installer XAMPP.</li>
                <li>Jika muncul peringatan UAC, klik OK saja.</li>
                <li>Pilih komponen yang mau diinstall (Default saja sudah cukup).</li>
                <li>Pilih folder instalasi (Saran: <code>C:\\xampp</code> jangan di Program Files).</li>
                <li>Setelah selesai, buka <strong>XAMPP Control Panel</strong>.</li>
                <li>Klik <strong>Start</strong> pada module Apache dan MySQL.</li>
                <li>Buka browser, ketik <code>localhost</code> untuk mengetes.</li>
            </ol>
        `,
        'netbeans': `
            <ol>
                <li>Pastikan kamu <strong>SUDAH</strong> menginstall Java JDK terlebih dahulu.</li>
                <li>Jalankan installer Apache Netbeans.</li>
                <li>Installer akan otomatis mendeteksi lokasi JDK.</li>
                <li>Klik Next sampai proses instalasi selesai.</li>
                <li>Buka Netbeans, tunggu proses "Activating Java SE" selesai.</li>
            </ol>
        `,
        'cisco': `
            <ol>
                <li>Matikan koneksi internet (Opsional, agar proses instalasi lebih lancar).</li>
                <li>Ekstrak file hasil download jika berbentuk <code>.rar</code> atau <code>.zip</code>.</li>
                <li>Jalankan file installer <code>Setup.exe</code>.</li>
                <li>Pilih <strong>"I accept the agreement"</strong> lalu klik Next.</li>
                <li>Biarkan lokasi instalasi default, klik Next terus sampai <strong>Install</strong>.</li>
                <li>Setelah selesai, jalankan Cisco Packet Tracer.</li>
                <li>Jika diminta login: Gunakan akun <strong>NetAcad</strong> atau pilih "Guest Login" (jika tersedia).</li>
            </ol>
        `,
        'npp': `
            <ol>
                <li>Jalankan installer Notepad++.</li>
                <li>Pilih bahasa (English/Indonesia), klik OK.</li>
                <li>Klik Next > I Agree.</li>
                <li>Biarkan lokasi default (Program Files), klik Next.</li>
                <li>Centang <strong>"Create Shortcut on Desktop"</strong> agar mudah dicari.</li>
                <li>Klik Install dan Finish. Software siap digunakan!</li>
            </ol>
        `,
        'python': `
            <ol>
                <li>Jalankan installer Python.</li>
                <li><strong>SANGAT PENTING:</strong> Lihat bagian bawah, CENTANG opsi <code style="border: 1px solid red;">Add Python x.x to PATH</code>.</li>
                <li>Jika tidak dicentang, Python tidak akan bisa dipanggil lewat CMD.</li>
                <li>Klik tombol <strong>Install Now</strong> bagian atas.</li>
                <li>Tunggu proses selesai. Jika muncul opsi "Disable path length limit", klik saja itu.</li>
                <li>Cek instalasi: Buka CMD, ketik <code>python --version</code>.</li>
            </ol>
        `,
        'bukasql': `
            <ol>
                <li>Ini software handmade dari gw</li>
                <li>Tinggal download aja <code>bukamysql.exe</code>.</li>
                <li>Terus lu run <code>bukamysql.exe</code>.</li>
                <li>jadi fungsi software ini biar lu pada ga ribet pindah path ke instalasi folder xampp, bahasa ringan nya ga perlu "cd..", "cd.." tinggal jalanin program ini aja udah langsung bisa bikin database.</li>
            </ol>
        `,
        'game': `
            <p>Cara install game secara umum:</p>
            <ol>
                <li>Download file game (biasanya format .RAR atau .ZIP).</li>
                <li>Matikan Antivirus sementara jika file terdeteksi sebagai false alarm.</li>
                <li>Ekstrak file menggunakan <strong>WinRAR</strong>.</li>
                <li>Cari file bernama <code>setup.exe</code> atau <code>Start.exe</code>.</li>
                <li>Mainkan dan jangan lupa waktu kuliah! 🎮</li>
            </ol>
        `
    };

    // B. LOGIKA MODAL
    const modalOverlay = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const guideButtons = document.querySelectorAll('.guide-btn');

    // 1. Event saat tombol panduan diklik
    guideButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id'); // Ambil ID (java/xampp/dll)
            const content = guidesData[id]; // Cari teks di database

            if (content) {
                // Isi konten modal
                modalTitle.textContent = `Panduan Install ${btn.closest('.software-card').querySelector('h3').textContent}`;
                modalBody.innerHTML = content;
                
                // Tampilkan modal
                modalOverlay.classList.add('active');
            } else {
                showToast('Panduan belum tersedia untuk software ini.', 'info');
            }
        });
    });

    // 2. Fungsi Tutup Modal
    function closeModal() {
        modalOverlay.classList.remove('active');
    }

    closeModalBtn.addEventListener('click', closeModal);

    // 3. Tutup jika klik area gelap di luar kotak
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // 4. Tutup pakai tombol ESC keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // ==========================================
    // 16. DYNAMIC GREETING (SAPAAN WAKTU) - VERSI ICON FONT AWESOME
    // ==========================================
    const greetingElement = document.getElementById('greeting-text');
    if (greetingElement) {
        const hour = new Date().getHours();
        let greeting = "";
        let iconHtml = "";

        if (hour >= 4 && hour < 11) {
            // Pagi: Ikon Kopi (Warna Coklat)
            greeting = "Selamat Pagi, Semangat Ngoding!";
            iconHtml = '<i class="fas fa-coffee" style="color: #A0522D;"></i>'; 
        } else if (hour >= 11 && hour < 15) {
            // Siang: Ikon Matahari (Warna Kuning Emas)
            greeting = "Selamat Siang, Jangan Lupa Makan!";
            iconHtml = '<i class="fas fa-sun" style="color: #FFD700;"></i>'; 
        } else if (hour >= 15 && hour < 18) {
            // Sore: Ikon Matahari Berawan (Warna Oranye)
            greeting = "Selamat Sore, Waktunya Santai!";
            iconHtml = '<i class="fas fa-cloud-sun" style="color: #FF8C00;"></i>'; 
        } else {
            // Malam: Ikon Bulan Sabit (Warna Putih/Kuning Pucat)
            // Menggunakan fa-moon agar seragam dengan tombol dark mode
            greeting = "Halo!, Selamat Malam, Jangan Bergadang yahh!";
            iconHtml = '<i class="fas fa-moon" style="color: #f2ff92ff;"></i>'; 
        }

        // Masukkan HTML icon + Teks greeting
        greetingElement.innerHTML = `${iconHtml} ${greeting}`;
    }