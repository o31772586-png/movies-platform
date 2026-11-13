const moviesData = [
    {
        title: "الاب الروحي",
        mainCat: "foreign",
        subCat: "action",
        subCatAr: "أجنبي - أكشن",
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
        youtubeId: "jNQXAC9IVRw" 
    },
    {
        title: "رسالة حب",
        mainCat: "foreign",
        subCat: "romance",
        subCatAr: "أجنبي - رومانسي",
        poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500",
        youtubeId: "jNQXAC9IVRw"
    },
    {
        title: "الطريق الطويل",
        mainCat: "foreign",
        subCat: "drama",
        subCatAr: "أجنبي - دراما",
        poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500",
        youtubeId: "jNQXAC9IVRw"
    },
    {
        title: "الفيل الأزرق",
        mainCat: "arabic",
        subCat: "arabic",
        subCatAr: "فيلم عربي",
        poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500",
        youtubeId: "jNQXAC9IVRw"
    }
];

const moviesGrid = document.getElementById('moviesGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');

const videoModal = document.getElementById('videoModal');
const youtubePlayer = document.getElementById('youtubePlayer');
const modalTitle = document.getElementById('modalTitle');
const downloadLink = document.getElementById('downloadLink');
const closeModal = document.getElementById('closeModal');

const dotsBtn = document.getElementById('dotsBtn');
const dotsDropdown = document.getElementById('dotsDropdown');
const enhanceBtn = document.getElementById('enhanceBtn');
const enhanceStatus = document.getElementById('enhanceStatus');

function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <span class="badge">HD 1080p</span>
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span>${movie.subCatAr}</span>
            </div>
        `;
        card.onclick = () => openMovie(movie);
        moviesGrid.appendChild(card);
    });
}

function openMovie(movie) {
    modalTitle.textContent = movie.title;
    youtubePlayer.src = `https://www.youtube.com/embed/${movie.youtubeId}?autoplay=1`;
    downloadLink.href = `https://youtu.be/${movie.youtubeId}`;
    
    videoModal.style.display = 'flex';
}

closeModal.onclick = () => {
    youtubePlayer.src = ''; 
    videoModal.style.display = 'none';
    dotsDropdown.style.display = 'none';
};

dotsBtn.onclick = (e) => {
    e.stopPropagation();
    dotsDropdown.style.display = dotsDropdown.style.display === 'block' ? 'none' : 'block';
};

window.onclick = () => {
    dotsDropdown.style.display = 'none';
};

let isEnhanced = true;
enhanceBtn.onclick = () => {
    isEnhanced = !isEnhanced;
    enhanceStatus.textContent = isEnhanced ? 'مفعل' : 'متوقف';
};

filterBtns.forEach(btn => {
    btn.onclick = () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        if (category === 'all') {
            displayMovies(moviesData);
        } else if (category === 'arabic') {
            displayMovies(moviesData.filter(m => m.mainCat === 'arabic'));
        } else if (category === 'foreign-all') {
            displayMovies(moviesData.filter(m => m.mainCat === 'foreign'));
        } else {
            displayMovies(moviesData.filter(m => m.subCat === category));
        }
    };
});

searchInput.oninput = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = moviesData.filter(m => m.title.toLowerCase().includes(term));
    displayMovies(filtered);
};

displayMovies(moviesData);