// قائمة الأفلام المتاحة على المنصة
const movies = [
    {
        id: "fSkgNXNiHIE", // معرف الفيديو الخاص بك على يوتيوب
        title: "الفيلم الحصري | Godfather VIP",
        category: "action",
        badge: "حصري VIP",
        image: "godfather.jpg",
        year: "1974"
    }
];

const moviesGrid = document.getElementById('moviesGrid');
const videoModal = document.getElementById('videoModal');
const youtubePlayer = document.getElementById('youtubePlayer');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const dotsBtn = document.getElementById('dotsBtn');
const dotsDropdown = document.getElementById('dotsDropdown');

const hdToggleBtn = document.getElementById('hdToggleBtn');
const hdStatus = document.getElementById('hdStatus');
const subToggleBtn = document.getElementById('subToggleBtn');
const subStatus = document.getElementById('subStatus');

let currentMovieId = '';
let isHD = true;
let isSubbed = false;

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

// دالة تحميل وتشغيل المشغل
function loadPlayer() {
    let videoUrl = `https://www.youtube.com/embed/${currentMovieId}?autoplay=1`;
    if (isSubbed) {
        videoUrl += `&cc_load_policy=1&cc_lang_pref=ar`;
    }
    youtubePlayer.src = videoUrl;
}

// فتح مشغل الفيديو
function openPlayer(movie) {
    currentMovieId = movie.id;
    modalTitle.textContent = movie.title;
    loadPlayer();
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

// التحكم في زر الجودة
hdToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isHD = !isHD;
    hdStatus.textContent = isHD ? 'مفعل' : 'معطل';
});

// التحكم في زر الترجمة
subToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isSubbed = !isSubbed;
    subStatus.textContent = isSubbed ? 'مفعل' : 'معطل';
    loadPlayer();
});

// بحث الأفلام
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = movies.filter(m => m.title.toLowerCase().includes(term));
    displayMovies(filtered);
});

// فلاتر التصنيفات الجديدة
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-category');
        
        if (cat === 'all') {
            displayMovies(movies);
        } else {
            const filtered = movies.filter(m => m.category === cat);
            displayMovies(filtered);
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

// العرض الأولي للأفلام
displayMovies(movies);
