const movies = [
    {
        id: "FSkqNXtHlZE",
        title: "الفيلم اجنبي | Godfather VIP",
        category: "foreign-drama",
        badge: "اجنبي VIP",
        image: "godfather.jpg",
        year: "1974",
        isSeries: false
    },
    {
        id: "xlTt10NhdeA",
        title: "Tom and Jerry",
        category: "cartoons",
        badge: "كرتون",
        image: "tom-and-jerry-poster.jpg",
        year: "2024",
        isSeries: false
    },
    {
        id: "aot-series",
        title: "Attack on Titan | هجوم العمالقة",
        category: "anime-series",
        badge: "مسلسل أنمي",
        image: "attack-on-titan-poster.jpg",
        year: "2013",
        isSeries: true,
        seasons: [
            {
                seasonNumber: 1,
                title: "الموسم الأول",
                totalEpisodes: 25,
                episodes: [
                    { ep: 1, title: "الحلقة 1", link: "https://t.me/omar_cinema_aot/2" }
                    // الحلقات الباقية هتتضاف هنا تباعاً
                ]
            },
            {
                seasonNumber: 2,
                title: "الموسم الثاني",
                totalEpisodes: 12,
                episodes: []
            },
            {
                seasonNumber: 3,
                title: "الموسم الثالث",
                totalEpisodes: 22,
                episodes: []
            },
            {
                seasonNumber: 4,
                title: "الموسم الرابع",
                totalEpisodes: 28,
                episodes: []
            }
        ]
    }
];

// عناصر DOM
const moviesGrid = document.getElementById('moviesGrid');
const videoModal = document.getElementById('videoModal');
const youtubePlayer = document.getElementById('youtubePlayer');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');

const seriesModal = document.getElementById('seriesModal');
const closeSeriesModal = document.getElementById('closeSeriesModal');
const seriesModalTitle = document.getElementById('seriesModalTitle');
const seasonsContainer = document.getElementById('seasonsContainer');
const episodesContainer = document.getElementById('episodesContainer');
const backToSeasons = document.getElementById('backToSeasons');
const selectedSeasonTitle = document.getElementById('selectedSeasonTitle');
const episodesList = document.getElementById('episodesList');

// دالة عرض الكارتات
function displayMovies(items) {
    if (!moviesGrid) return;
    moviesGrid.innerHTML = '';
    items.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${movie.image}" alt="${movie.title}">
                <span class="badge">${movie.badge}</span>
            </div>
            <div class="card-info">
                <h3>${movie.title}</h3>
                <span>${movie.year}</span>
            </div>
        `;
        
        // عند الضغط على الكارت
        card.addEventListener('click', () => {
            if (movie.isSeries) {
                // لو مسلسل: افتح نافذة المواسم
                openSeriesModal(movie);
            } else {
                // لو فيلم: افتح مشغل الفيديو مباشرة
                openVideoPlayer(movie.id, movie.title);
            }
        });
        
        moviesGrid.appendChild(card);
    });
}

// فتح مشغل الفيديو الداخلي
function openVideoPlayer(sourceId, title) {
    if (!videoModal) return;
    modalTitle.textContent = title;
    
    if (sourceId.startsWith('http')) {
        let embedUrl = sourceId;
        if (sourceId.includes('t.me') && !sourceId.includes('embed=1')) {
            embedUrl += (sourceId.includes('?') ? '&' : '?') + 'embed=1';
        }
        youtubePlayer.outerHTML = `<iframe id="youtubePlayer" src="${embedUrl}" width="100%" height="450px" frameborder="0" allowfullscreen></iframe>`;
    } else {
        youtubePlayer.outerHTML = `<iframe id="youtubePlayer" src="https://www.youtube.com/embed/${sourceId}?autoplay=1" width="100%" height="450px" frameborder="0" allowfullscreen></iframe>`;
    }
    
    videoModal.style.display = 'flex';
}

// فتح نافذة المواسم للمسلسلات
function openSeriesModal(series) {
    if (!seriesModal) return;
    seriesModalTitle.textContent = series.title;
    seasonsContainer.style.display = 'grid';
    episodesContainer.style.display = 'none';
    seasonsContainer.innerHTML = '';

    series.seasons.forEach(season => {
        const seasonCard = document.createElement('div');
        seasonCard.className = 'season-card';
        seasonCard.innerHTML = `
            <h4>${season.title}</h4>
            <p>${season.totalEpisodes} حلقة</p>
        `;
        seasonCard.addEventListener('click', () => {
            showEpisodes(season, series.title);
        });
        seasonsContainer.appendChild(seasonCard);
    });

    seriesModal.style.display = 'flex';
}

// عرض حلقات الموسم المختار
function showEpisodes(season, seriesTitle) {
    seasonsContainer.style.display = 'none';
    episodesContainer.style.display = 'block';
    selectedSeasonTitle.textContent = `${seriesTitle} - ${season.title}`;
    episodesList.innerHTML = '';

    for (let i = 1; i <= season.totalEpisodes; i++) {
        const epData = season.episodes.find(e => e.ep === i);
        const epBtn = document.createElement('button');
        epBtn.className = 'episode-btn';
        epBtn.textContent = `الحلقة ${i}`;

        if (epData && epData.link) {
            epBtn.classList.add('available');
            epBtn.addEventListener('click', () => {
                seriesModal.style.display = 'none';
                openVideoPlayer(epData.link, `${seriesTitle} - ${season.title} - الحلقة ${i}`);
            });
        } else {
            epBtn.classList.add('locked');
            epBtn.title = "قريباً...";
            epBtn.addEventListener('click', () => {
                alert("هذه الحلقة ستتوفر قريباً في الدفعات القادمة!");
            });
        }
        episodesList.appendChild(epBtn);
    }
}

// أزرار الإغلاق
if (closeModal) {
    closeModal.addEventListener('click', () => {
        videoModal.style.display = 'none';
        const player = document.getElementById('youtubePlayer');
        if (player) player.src = '';
    });
}

if (closeSeriesModal) {
    closeSeriesModal.addEventListener('click', () => {
        seriesModal.style.display = 'none';
    });
}

if (backToSeasons) {
    backToSeasons.addEventListener('click', () => {
        episodesContainer.style.display = 'none';
        seasonsContainer.style.display = 'grid';
    });
}

// التشغيل الأولي
displayMovies(movies);
