const movies = [
    {
        id: "fSkgNXNiHIE",
        title: "الفيلم اجنبي | Godfather VIP",
        category: "foreign-drama",
        badge: "اجنبي VIP",
        image: "godfather.jpg",
        year: "1974",
        isSeries: false
    },
    id: "https://dai.ly/xbx8s4i",
        title: "تجربة ديلي موشن | Test",
        category: "foreign-action",
        badge: "تجربة",
        image: "banner.jpg",
        year: "2026",
        isSeries: false
},
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
        image: "attack-on-titan.jpg",
        year: "2013",
        isSeries: true,
        seasons: [
            {
                seasonNumber: 1,
                title: "الموسم الأول",
                totalEpisodes: 25,
                episodes: [
 { ep: 2, title: "الحلقة 2", link: "EM-W-WBzAbU" },
 { ep: 3, title: "الحلقة 3", link: "_nxMHb4dlJA" },
 { ep: 4, title: "الحلقة 4", link: "n0h3j0w51bM" },
 { ep: 5, title: "الحلقة 5", link: "HOrq4JN5epY" },
{ ep: 6, title: "الحلقة 6", link: "WOuJ0kkPGXE" },
 { ep: 7, title: "الحلقة 7", link: "vpG_WifRebE" },
{ ep: 8, title: "الحلقة 8", link: "sA59KDCGg7o" },
 { ep: 9, title: "الحلقة 9", link: "NTs2EFqNLB4" },                   
{ ep: 10, title: "الحلقة 10", link: "vsb0-FZdsFg" },
  { ep: 11, title: "الحلقة 11", link: "XBBgwmoltq0" }                  
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
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');

const seriesModal = document.getElementById('seriesModal');
const closeSeriesModal = document.getElementById('closeSeriesModal');
const seriesModalTitle = document.getElementById('seriesModalTitle');
const seasonsContainer = document.getElementById('seasonsContainer');
const episodesContainer = document.getElementById('episodesContainer');
const backToSeasons = document.getElementById('backToSeasons');
const selectedSeasonTitle = document.getElementById('selectedSeasonTitle');
const episodesList = document.getElementById('episodesList');

// إعدادات زر القائمة المنسدلة (⚙️ إعدادات العرض)
const dotsBtn = document.getElementById('dotsBtn');
const dotsDropdown = document.getElementById('dotsDropdown');
const hdToggleBtn = document.getElementById('hdToggleBtn');
const hdStatus = document.getElementById('hdStatus');
const subToggleBtn = document.getElementById('subToggleBtn');
const subStatus = document.getElementById('subStatus');

if (dotsBtn && dotsDropdown) {
    dotsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dotsDropdown.style.display = dotsDropdown.style.display === 'block' ? 'none' : 'block';
    });
    window.addEventListener('click', () => {
        dotsDropdown.style.display = 'none';
    });
}

if (hdToggleBtn) {
    hdToggleBtn.addEventListener('click', () => {
        hdStatus.textContent = hdStatus.textContent === 'مفعل' ? 'معطل' : 'مفعل';
    });
}

if (subToggleBtn) {
    subToggleBtn.addEventListener('click', () => {
        subStatus.textContent = subStatus.textContent === 'مفعل' ? 'معطل' : 'مفعل';
    });
}

// دالة عرض الكارتات
function displayMovies(items) {
    if (!moviesGrid) return;
    moviesGrid.innerHTML = '';
    
    if (items.length === 0) {
        moviesGrid.innerHTML = '<p style="color: #9ca3af; grid-column: 1/-1; text-align: center; padding: 20px;">لا توجد أفلام أو مسلسلات متوفرة في هذا التصنيف حالياً.</p>';
        return;
    }

    items.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${movie.image}" alt="${movie.title}">
                <span class="badge">${movie.badge}</span>
            </div>
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span>${movie.year}</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (movie.isSeries) {
                openSeriesModal(movie);
            } else {
                openVideoPlayer(movie.id, movie.title);
            }
        });
        
        moviesGrid.appendChild(card);
    });
}
// فلتر التصنيفات //
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');
        
        // --- السطرين الجداد هنا ---
        const actorsBar = document.getElementById('actorsFilterBar');
        if (actorsBar) {
            actorsBar.style.display = (category === 'foreign-action') ? 'flex' : 'none';
        }
        // -------------------------

        if (category === 'all') {
            displayMovies(movies);
        } else {
            const filtered = movies.filter(m => m.category === category);
            displayMovies(filtered);
        }
    });
});

// نظام البحث
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = movies.filter(m => m.title.toLowerCase().includes(term));
        displayMovies(filtered);
    });
}
// فتح مشغل الفيديو الداخلي (يدعم يوتيوب، ديلي موشن، والروابط المباشرة)
function openVideoPlayer(sourceId, title) {
    if (!videoModal) return;
    modalTitle.textContent = title;

    let player = document.getElementById('youtubePlayer');
    if (!player) return;

    // دالة مساعدة للتأكد إن العنصر الموجود هو iframe (عشان يوتيوب وديلي موشن)
    const ensureIframe = (embedUrl) => {
        if (player.tagName.toLowerCase() === 'video') {
            const iframeTag = document.createElement('iframe');
            iframeTag.id = 'youtubePlayer';
            iframeTag.width = '100%';
            iframeTag.height = '100%';
            iframeTag.frameBorder = '0';
            iframeTag.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
            iframeTag.allowFullscreen = true;
            iframeTag.src = embedUrl;
            player.replaceWith(iframeTag);
        } else {
            player.src = embedUrl;
        }
    };

    // 1. لو الرابط من Dailymotion (سواء dai.ly أو dailymotion.com)
    if (sourceId.includes('dai.ly/') || sourceId.includes('dailymotion.com/')) {
        let dmId = '';
        if (sourceId.includes('dai.ly/')) {
            dmId = sourceId.split('dai.ly/')[1].split('?')[0].split('/')[0];
        } else if (sourceId.includes('/video/')) {
            dmId = sourceId.split('/video/')[1].split('?')[0].split('_')[0];
        }
        ensureIframe(`https://www.dailymotion.com/embed/video/${dmId}?autoplay=1`);

    // 2. لو رابط مباشر لفيديو (http/https ومش ديلي موشن)
    } else if (sourceId.startsWith('http://') || sourceId.startsWith('https://')) {
        if (player.tagName.toLowerCase() === 'iframe') {
            const videoTag = document.createElement('video');
            videoTag.id = 'youtubePlayer';
            videoTag.controls = true;
            videoTag.autoplay = true;
            videoTag.style.width = '100%';
            videoTag.style.height = '100%';
            videoTag.style.backgroundColor = '#000';
            videoTag.src = sourceId;
            player.replaceWith(videoTag);
        } else {
            player.src = sourceId;
        }

    // 3. لو معرف يوتيوب (الوضع الافتراضي بدون أي تغيير)
    } else {
        ensureIframe(`https://www.youtube.com/embed/${sourceId}?autoplay=1`);
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

// أزرار الإغلاق وتفريغ المشغل
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
// التشغيل الأولي للمنصة وإخفاء سلاسل الأفلام بره قسم الأكشن
document.addEventListener("DOMContentLoaded", () => {
    const seriesGrid = document.getElementById('seriesGrid');
    if (seriesGrid) seriesGrid.style.display = 'none';
    displayMovies(movies);
});

// دالة فلترة التصنيفات العامة
document.querySelectorAll('.filter-bar .filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const category = this.getAttribute('data-category');
        const moviesGrid = document.getElementById('moviesGrid');
        const seriesGrid = document.getElementById('seriesGrid');
        const actorsBar = document.getElementById('actorsFilterBar');

        // إخفاء فلاتر الممثلين والسلاسل افتراضياً في كل الأقسام
        if (actorsBar) actorsBar.style.display = 'none';
        if (seriesGrid) seriesGrid.style.display = 'none';
        if (moviesGrid) moviesGrid.style.display = 'grid';

     if (category === 'all') {
            if (moviesGrid) moviesGrid.style.display = 'grid';
            if (seriesGrid) seriesGrid.style.display = 'none';
            displayMovies(movies);
        } else if (category === 'foreign-action') {
            if (actorsBar) actorsBar.style.display = 'flex';
            if (seriesGrid) seriesGrid.style.display = 'grid';
            if (moviesGrid) moviesGrid.style.display = 'none';
        } else {
            if (moviesGrid) moviesGrid.style.display = 'grid';
            if (seriesGrid) seriesGrid.style.display = 'none';
            const filtered = movies.filter(item => item.category === category);
            displayMovies(filtered);
        } 
    });
});

// دالة فلترة الممثلين داخل أكشن أجنبي
function filterByActor(actorName, btnElement) {
    document.querySelectorAll('#actorsFilterBar .filter-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

 if (actorName === 'all') {
        if (seriesGrid) seriesGrid.style.display = 'grid';
        if (moviesGrid) moviesGrid.style.display = 'none';
    } else {
        if (seriesGrid) seriesGrid.style.display = 'none';
        if (moviesGrid) moviesGrid.style.display = 'grid';
        const filtered = actionMovies.filter(item => item.actor === actorName);
        displayMovies(filtered);
    } 
        const filtered = actionMovies.filter(item => item.actor === actorName);
        displayMovies(filtered);
    }
}
