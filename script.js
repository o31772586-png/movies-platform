// قائمة الأفلام المتاحة على المنصة
const movies = [
    {
        id: "fSkgNXNiHIE", // معرف الفيديو الخاص بك على يوتيوب
        title: "الفيلم الحصري | Godfather VIP",
        category: "action",
        badge: "حصري VIP",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600",
        year: "2026"
    }
];

const moviesGrid = document.getElementById('moviesGrid');
const videoModal = document.getElementById('videoModal');
const youtubePlayer = document.getElementById('youtubePlayer');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const downloadLink = document.getElementById('downloadLink');
const enhanceBtn = document.getElementById('enhanceBtn');
const enhanceStatus = document.getElementById('enhanceStatus');
const dotsBtn = document.getElementById('dotsBtn');
const dotsDropdown = document.getElementById('dotsDropdown');

let isEnhanced = true;

// عرض الأفلام في الشبكة
function displayMovies(moviesToDisplay) {
    moviesGrid.innerHTML = '';
    if (moviesToDisplay.length === 0) {
        moviesGrid.innerHTML = '<p style="color: #9ca3af; grid-column: 1/-1; text-align: center; padding: 40px;">لا توجد أفلام مطابقة للبحث...</p>';
        return;
    }

    moviesToDisplay.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <span class="badge">${movie.badge}</span>
            <img src="${movie.image}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span>إصدار ${movie.year}</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            openPlayer(movie);
        });
        
        moviesGrid.appendChild(card);
    });
}

// فتح مشغل الفيديو السينمائي وتجهيز زر VidMate
function openPlayer(movie) {
    modalTitle.textContent = movie.title;
    youtubePlayer.src = `https://www.youtube.com/embed/${movie.id}?autoplay=1`;
    
    const youtubeUrl = `https://www.youtube.com/watch?v=${movie.id}`;
    downloadLink.href = youtubeUrl;
    downloadLink.textContent = "📥 نسخ الرابط للتحميل عبر VidMate";
    
    // عند الضغط: ينسخ الرابط فوراً ويحاول فتح تطبيق VidMate مباشرة
    downloadLink.onclick = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(youtubeUrl).then(() => {
            downloadLink.textContent = "✅ تم نسخ الرابط! افتح VidMate للتحميل";
            
            // محاولة فتح VidMate مباشرة على الموبايل (Android Intent)
            const isMobile = /Android/i.test(navigator.userAgent);
            if (isMobile) {
                window.location.href = `intent://www.youtube.com/watch?v=${movie.id}#Intent;scheme=https;package=com.nemo.vidmate;end`;
            } else {
                alert("تم نسخ رابط الفيلم بنجاح!\nافتح برنامج VidMate أو محاكي الأندرويد والصق الرابط للتحميل بأعلى جودة.");
            }

            setTimeout(() => {
                downloadLink.textContent = "📥 نسخ الرابط للتحميل عبر VidMate";
            }, 3000);
        });
    };
    
    videoModal.style.display = 'flex';
}

// إغلاق المشغل وإيقاف الفيديو
function closePlayer() {
    youtubePlayer.src = '';
    videoModal.style.display = 'none';
}

closeModal.addEventListener('click', closePlayer);
window.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        closePlayer();
    }
});

// بحث الأفلام
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = movies.filter(m => m.title.toLowerCase().includes(term));
    displayMovies(filtered);
});

// فلاتر التصنيفات
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-category');
        if (cat === 'all' || cat === 'action') {
            displayMovies(movies);
        } else {
            displayMovies([]); 
        }
    });
});

// القائمة المنسدلة للخيارات
dotsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dotsDropdown.style.display = dotsDropdown.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', () => {
    dotsDropdown.style.display = 'none';
});

enhanceBtn.addEventListener('click', () => {
    isEnhanced = !isEnhanced;
    enhanceStatus.textContent = isEnhanced ? 'مفعل' : 'معطل';
});

// العرض الأولي
displayMovies(movies);
