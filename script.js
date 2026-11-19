// رابط الـ API الخاص بـ Google Sheets
const API_URL = "https://script.google.com/macros/s/AKfycbwFzgfH4IhvCdreRibUq7wtd3swHxDP9U2KZH_Y_Bsths9pzGwUmyBzUQcUzCYV7FI/exec";

let movies = [];

async function fetchMoviesFromSheet() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // معالجة البيانات وتحويل النصوص الخاصة بالمسلسلات لمصفوفات حقيقية
        movies = data.map(movie => {
            // لو المسلسل فيه مواسم محفوظة كنص JSON، حولها لمصفوفة
            if (movie.seasons && typeof movie.seasons === 'string' && movie.seasons.trim() !== '') {
                try {
                    movie.seasons = JSON.parse(movie.seasons);
                } catch (e) {
                    movie.seasons = [];
                }
            } else {
                movie.seasons = [];
            }

            // ضبط قيمة isSeries لتعمل بشكل صحيح
            movie.isSeries = (movie.isSeries === 'true' || movie.isSeries === true);

            return movie;
        });

        console.log("تم تحميل الأفلام والمسلسلات بنجاح:", movies);
        displayMovies(movies);
    } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchMoviesFromSheet();
});

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

// دالة مساعدة لاستخراج رابط الفيديو المناسب سواء كان رابط مباشر أو داخل seasons
function resolveVideoSource(item) {
    if (item.link && typeof item.link === 'string' && item.link.trim() !== '') {
        return item.link.trim();
    }
    if (Array.isArray(item.seasons) && item.seasons.length > 0) {
        const firstSeason = item.seasons[0];
        if (firstSeason && Array.isArray(firstSeason.episodes) && firstSeason.episodes.length > 0) {
            const firstEp = firstSeason.episodes[0];
            if (firstEp && firstEp.link) {
                return firstEp.link.trim();
            }
        }
    }
    return item.id;
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
            if (movie.isSeries && Array.isArray(movie.seasons) && movie.seasons.length > 0) {
                openSeriesModal(movie);
            } else {
                const videoSource = resolveVideoSource(movie);
                openVideoPlayer(videoSource, movie.title);
            }
        });
        
        moviesGrid.appendChild(card);
    });
}

// نظام البحث
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = movies.filter(m => m.title.toLowerCase().includes(term));
        displayMovies(filtered);
    });
}

// فتح مشغل الفيديو الداخلي (دعم Google Drive /preview والروابط المباشرة ويوتيوب)
function openVideoPlayer(sourceId, title) {
    if (!videoModal) return;
    modalTitle.textContent = title;

    let player = document.getElementById('youtubePlayer');
    if (!player) return;

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

    const cleanSource = String(sourceId || '').trim();

    if (cleanSource.includes('drive.google.com')) {
        // ضمان تحويل أي رابط درايف لصيغة /preview
        const drivePreviewUrl = cleanSource.includes('/preview')
            ? cleanSource
            : cleanSource.replace(/\/view(\?.*)?$/, '/preview');
        ensureIframe(drivePreviewUrl);
    } else if (cleanSource.startsWith('http://') || cleanSource.startsWith('https://')) {
        ensureIframe(cleanSource);
    } else {
        ensureIframe(`https://www.youtube.com/embed/${cleanSource}?autoplay=1`);
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

// دالة عرض مواسم أو أفلام السلاسل المربوطة بقاعدة البيانات
// دالة عرض مواسم أو أفلام السلاسل المربوطة بقاعدة البيانات
function openSeries(seriesKey) {
    const cleanKey = String(seriesKey || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    const filteredMovies = movies.filter(movie => {
        const idClean = String(movie.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const seriesClean = String(movie.series || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const titleClean = String(movie.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');

        return (
            movie.id === seriesKey ||
            movie.series === seriesKey ||
            movie.category === seriesKey ||
            (seriesKey === 'foreign-action' && movie.category === 'Action') ||
            (seriesKey === 'Action' && movie.category === 'foreign-action') ||
            (cleanKey && (idClean.includes(cleanKey) || seriesClean.includes(cleanKey) || titleClean.includes(cleanKey)))
        );
    });

    const targetMoviesGrid = document.getElementById('moviesGrid');
    const seriesGrid = document.getElementById('seriesGrid');
    const actorsBar = document.getElementById('actorsFilterBar');

    if (seriesGrid) seriesGrid.style.display = 'none';
    if (actorsBar) actorsBar.style.display = 'none';
    if (targetMoviesGrid) targetMoviesGrid.style.display = 'grid';

    if (filteredMovies.length === 0) {
        targetMoviesGrid.innerHTML = `<p style="color: #9ca3af; grid-column: 1/-1; text-align: center; padding: 20px;">جاري إيراد وتجهيز أفلام هذه السلسلة في قاعدة البيانات قريباً!</p>`;
        return;
    }

    // استخراج الأفلام أو الحلقات من داخل seasons لعرضها ككروت جاهزة للتشغيل الفوري
    const expandedItems = [];
    filteredMovies.forEach(movie => {
        if (Array.isArray(movie.seasons) && movie.seasons.length > 0) {
            movie.seasons.forEach(season => {
                if (Array.isArray(season.episodes) && season.episodes.length > 0) {
                    season.episodes.forEach(ep => {
                        if (ep && ep.link) {
                            expandedItems.push({
                                id: ep.link,
                                title: ep.title || movie.title,
                                badge: movie.badge || 'أكشن أجنبي',
                                image: movie.image,
                                year: movie.year,
                                isSeries: false
                            });
                        }
                    });
                }
            });
        } else {
            expandedItems.push(movie);
        }
    });

    displayMovies(expandedItems.length > 0 ? expandedItems : filteredMovies);
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
        const targetMoviesGrid = document.getElementById('moviesGrid');
        const seriesGrid = document.getElementById('seriesGrid');
        const actorsBar = document.getElementById('actorsFilterBar');

        if (actorsBar) actorsBar.style.display = 'none';
        if (seriesGrid) seriesGrid.style.display = 'none';
        if (targetMoviesGrid) targetMoviesGrid.style.display = 'grid';

        if (category === 'all') {
            if (targetMoviesGrid) targetMoviesGrid.style.display = 'grid';
            if (seriesGrid) seriesGrid.style.display = 'none';
            displayMovies(movies);
        } else if (category === 'foreign-action') {
            if (actorsBar) actorsBar.style.display = 'flex';
            if (seriesGrid) seriesGrid.style.display = 'grid';
            if (targetMoviesGrid) targetMoviesGrid.style.display = 'none';
        } else {
            if (targetMoviesGrid) targetMoviesGrid.style.display = 'grid';
            if (seriesGrid) seriesGrid.style.display = 'none';
            const filtered = movies.filter(item =>
                item.category === category ||
                (category === 'foreign-action' && item.category === 'Action')
            );
            displayMovies(filtered);
        }
    });
});

// دالة فلترة الممثلين داخل أكشن أجنبي
function filterByActor(actorName, btnElement) {
    document.querySelectorAll('#actorsFilterBar .filter-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    const actionMovies = movies.filter(item => item.category === 'foreign-action' || item.category === 'Action');
    const targetMoviesGrid = document.getElementById('moviesGrid');
    const seriesGrid = document.getElementById('seriesGrid');

    if (actorName === 'all') {
        if (seriesGrid) seriesGrid.style.display = 'grid';
        if (targetMoviesGrid) targetMoviesGrid.style.display = 'none';
    } else {
        if (seriesGrid) seriesGrid.style.display = 'none';
        if (targetMoviesGrid) targetMoviesGrid.style.display = 'grid';
        displayMovies(actionMovies);
    }
}

// محتوى الصفحات القانونية والمساعدة عند الضغط على روابط الفوتر
const footerPagesContent = {
    terms: {
        title: "شروط الاستخدام (Terms of Use)",
        body: "مرحباً بك في منصة Cima Hub. باستخدامك للمنصة فإنك توافق على استخدام المحتوى المتاح للمشاهدة الشخصية فقط. يُمنع إعادة بيع أو استغلال الروابط بشكل تجاري أو محاولة إلحاق الضرر بخوادم العرض."
    },
    privacy: {
        title: "سياسة الخصوصية (Privacy Policy)",
        body: "نحن نحترم خصوصيتك بالكامل. منصة Cima Hub لا تطلب منك أي بيانات بنكية أو معلومات شخصية حساسة للمشاهدة، ويتم حفظ تفضيلاتك محلياً على متصفحك لتحسين تجربة التصفح فقط."
    },
    cookies: {
        title: "إعدادات ملفات تعريف الارتباط (Cookies)",
        body: "تستخدم المنصة ملفات تعريف ارتباط أساسية وتخزين محلي (Local Storage) لتذكر إعدادات العرض وتسهيل سرعة تحميل الواجهة."
    },
    legal: {
        title: "المعلومات القانونية (Legal Notices)",
        body: "منصة Cima Hub هي واجهة عرض وتنظيم للمحتوى المرئي، وجميع العلامات التجارية وأسماء الأعمال الفنية مملوكة لأصحابها الأصليين."
    },
    faq: {
        title: "مركز المساعدة والأسئلة الشائعة (FAQ)",
        body: "• <b>الفيديو لا يعمل؟</b> تأكد من اتصالك بالإنترنت أو جرب تحديث الصفحة (F5).<br>• <b>الجودة ضعيفة؟</b> يمكنك تغيير جودة الفيديو من علامة الترس داخل مشغل الفيديو مباشرة."
    },
    contact: {
        title: "اتصل بنا (Contact Us)",
        body: "للاستفسارات التقنية أو الإبلاغ عن رابط لا يعمل، يمكنك التواصل مع إدارة المنصة عبر البريد الإلكتروني الرسمي أو صفحات التواصل الخاصة بنا."
    },
    devices: {
        title: "طرق المشاهدة والأجهزة المدعومة",
        body: "المنصة متوافقة بالكامل وتعمل بسلاسة على جميع الأجهزة: الهواتف الذكية (Android و iOS)، أجهزة الكمبيوتر واللابتوب، الشاشات الذكية (Smart TV)، والأجهزة اللوحية."
    },
    about: {
        title: "من نحن (About Us)",
        body: "Cima Hub هي منصة ترفيهية عربية تهدف لتقديم تجربة مشاهدة عصرية وسريعة بتصميم مستوحى من كبرى المنصات العالمية وبدون أي تعقيدات."
    },
    dmca: {
        title: "إخلاء مسؤولية حقوق الملكية (DMCA)",
        body: "المنصة لا تستضيف أي ملفات فيديو على خوادمها الخاصة، وإنما تقوم بتضمين روابط متاحة للعامة من منصات خارجية مثل YouTube و Google Drive."
    },
    request: {
        title: "طلب فيلم أو مسلسل جديد",
        body: "هل تبحث عن فيلم أو مسلسل معين غير موجود في القائمة؟ أرسل اسم العمل وسنقوم بإضافته في أقرب تحديث للمنصة!"
    }
};

function openInfoModal(pageKey) {
    const data = footerPagesContent[pageKey];
    if (!data) return;
    document.getElementById("infoModalTitle").innerText = data.title;
    document.getElementById("infoModalBody").innerHTML = data.body;
    document.getElementById("infoModal").style.display = "flex";
}

function closeInfoModal(event, forceClose = false) {
    if (forceClose || event.target.id === "infoModal") {
        document.getElementById("infoModal").style.display = "none";
    }
}
