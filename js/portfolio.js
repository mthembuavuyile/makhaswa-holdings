/* =====================================================
   MAKHASWA HOLDINGS — PORTFOLIO.JS
   Handles dynamic loading, rendering, progressive filtering,
   pagination, and lightbox display of 200+ projects/journal images.
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    'use strict';

    const categoriesList = ['civil', 'earthworks', 'roads', 'building'];
    const ITEMS_PER_PAGE = 15;

    // State variables
    let allImages = [];       // Complete consolidated dataset
    let currentDataset = [];  // Filtered subset currently active
    let renderedCount = 0;    // Number of images currently rendered in grid
    let lightboxIndex = 0;    // Current active index in the lightbox

    // DOM Elements
    const grid = document.getElementById('projects-grid');
    const paginationContainer = document.getElementById('projects-pagination');
    const countLabel = document.getElementById('projects-count');
    const filterWrapper = document.querySelector('.portfolio-filter-wrapper');

    // Lightbox DOM Elements
    let lightbox = null;
    let lbImg = null;
    let lbCap = null;
    let lbCounter = null;
    let lbClose = null;
    let lbPrev = null;
    let lbNext = null;
    let lbLoader = null;
    let lbError = null;
    let lbRetryBtn = null;

    // Fetch and initialize
    const fetchPromises = categoriesList.map(catId =>
        fetch(`projects/${catId}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${catId} projects data: ${response.statusText}`);
                }
                return response.json();
            })
            .then(cat => ({ catId, cat }))
    );

    Promise.all(fetchPromises)
        .then(results => {
            if (!grid) return;

            // Flatten JSON data into allImages array
            results.forEach(({ catId, cat }) => {
                if (cat && Array.isArray(cat.images)) {
                    cat.images.forEach(img => {
                        allImages.push({
                            src: img.src,
                            alt: img.alt,
                            title: img.title,
                            categoryId: catId,
                            categoryName: cat.title
                        });
                    });
                }
            });

            // Set default dataset
            currentDataset = allImages;

            // Setup components
            setupLightbox();
            setupFilters();
            checkURLFilter();
            renderNextBatch();
        })
        .catch(err => {
            console.error('Error loading portfolio:', err);
        });

    // Intersection Observer for fade-in animation
    const observerOptions = { threshold: 0.05 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Setup and bind events for a single project card, with skeleton loading and retry support
    function setupCard(card, img, globalIndex, cacheBust = false) {
        card.classList.remove('project-card--error');
        card.classList.add('project-card--loading');
        
        const imgSrc = cacheBust ? `${img.src}?retry=${Date.now()}` : img.src;
        
        card.innerHTML = `
            <div class="project-skeleton"></div>
            <img src="${imgSrc}" alt="${img.alt}" loading="lazy" width="600" height="400" style="opacity: 0; transition: opacity 0.4s ease;">
            <div class="project-overlay" style="opacity: 0; transition: opacity 0.4s ease;">
                <span>${img.categoryName}</span>
                <h4>${img.title}</h4>
            </div>
        `;
        
        const imgEl = card.querySelector('img');
        const overlayEl = card.querySelector('.project-overlay');
        const skeletonEl = card.querySelector('.project-skeleton');
        
        imgEl.onload = () => {
            card.classList.remove('project-card--loading');
            if (skeletonEl) skeletonEl.style.display = 'none';
            imgEl.style.opacity = '1';
            overlayEl.style.opacity = '1';
        };
        
        imgEl.onerror = () => {
            card.classList.remove('project-card--loading');
            card.classList.add('project-card--error');
            if (skeletonEl) skeletonEl.style.display = 'none';
            
            card.innerHTML = `
                <div class="project-error-state">
                    <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="2" y1="2" x2="22" y2="22"></line>
                        <path d="M10.41 10.41a2 2 0 1 1 2.83 2.83"></path>
                        <line x1="10.86" y1="20" x2="19" y2="20"></line>
                        <line x1="3" y1="20" x2="7.14" y2="20"></line>
                        <line x1="12" y1="4" x2="21" y2="4"></line>
                        <line x1="3" y1="4" x2="8" y2="4"></line>
                        <path d="M16 11.23A4.5 4.5 0 0 0 12.77 8"></path>
                        <path d="M8 12a4.5 4.5 0 0 0 4 4.46"></path>
                        <path d="M21 16.5v-3.77A4.5 4.5 0 0 0 17.5 9"></path>
                        <path d="M3 7.5v6.5a4.5 4.5 0 0 0 4.5 4.5H8"></path>
                    </svg>
                    <span>Failed to load</span>
                    <button class="btn-retry" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                        </svg>
                        Retry
                    </button>
                </div>
            `;
            
            const retryBtn = card.querySelector('.btn-retry');
            if (retryBtn) {
                retryBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Avoid triggering lightbox on retry click
                    setupCard(card, img, globalIndex, true);
                });
            }
        };

        if (imgEl.complete && imgEl.naturalWidth !== 0) {
            card.classList.remove('project-card--loading');
            if (skeletonEl) skeletonEl.style.display = 'none';
            imgEl.style.opacity = '1';
            overlayEl.style.opacity = '1';
        }
    }

    // Render next batch of items
    function renderNextBatch() {
        if (!grid) return;

        const totalItems = currentDataset.length;

        // Handle empty state
        if (totalItems === 0) {
            grid.innerHTML = '<div class="portfolio-empty-message" style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-light); font-weight: 600;">No projects found in this category.</div>';
            if (countLabel) countLabel.textContent = '';
            updatePaginationControls();
            return;
        }

        const nextBatchSize = Math.min(ITEMS_PER_PAGE, totalItems - renderedCount);
        if (nextBatchSize <= 0) return;

        const batch = currentDataset.slice(renderedCount, renderedCount + nextBatchSize);
        batch.forEach((img, index) => {
            const globalIndex = renderedCount + index;
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Open project image: ${img.title}`);

            // Set initial styles for fade-in
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';

            setupCard(card, img, globalIndex, false);

            // Click and keyboard logic
            const handleCardClick = () => {
                if (!card.classList.contains('project-card--error')) {
                    openLightbox(globalIndex);
                }
            };

            card.addEventListener('click', handleCardClick);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick();
                }
            });

            grid.appendChild(card);
            observer.observe(card);
        });

        renderedCount += nextBatchSize;

        // Re-initialize Lucide Icons if loaded
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Update count label
        if (countLabel) {
            countLabel.textContent = `Showing 1–${renderedCount} of ${totalItems} projects`;
        }

        updatePaginationControls();
    }

    // Load More pagination controls builder
    function updatePaginationControls() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        if (renderedCount < currentDataset.length) {
            const btn = document.createElement('button');
            btn.className = 'btn-load-more';
            btn.innerHTML = `
                <span>LOAD MORE PROJECTS</span>
                <i data-lucide="arrow-down" width="16" height="16"></i>
            `;
            btn.addEventListener('click', () => {
                btn.disabled = true;
                btn.classList.add('is-loading');
                btn.innerHTML = `
                    <span>LOADING PROJECTS...</span>
                    <div class="btn-spinner"></div>
                `;
                setTimeout(() => {
                    renderNextBatch();
                }, 400);
            });
            paginationContainer.appendChild(btn);

            if (window.lucide) {
                window.lucide.createIcons();
            }
        } else if (currentDataset.length > 0) {
            const msg = document.createElement('div');
            msg.className = 'journal-end-message';
            msg.textContent = 'You have viewed all projects in this category.';
            paginationContainer.appendChild(msg);
        }
    }

    // Category filters logic
    function setupFilters() {
        if (!filterWrapper) return;

        filterWrapper.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            // Reset active states
            const buttons = filterWrapper.querySelectorAll('.filter-btn');
            buttons.forEach(b => {
                b.classList.remove('active');
                b.removeAttribute('aria-selected');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Apply filter value
            const filterValue = btn.getAttribute('data-filter');

            if (filterValue === 'all') {
                currentDataset = allImages;
            } else {
                currentDataset = allImages.filter(img => img.categoryId === filterValue);
            }

            // Reset grid & count
            if (grid) {
                grid.innerHTML = '';
            }
            renderedCount = 0;
            renderNextBatch();

            // Smooth scroll to top of grid
            if (grid) {
                const headerOffset = 120;
                const elementPosition = grid.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Check for '?filter=' in the URL
    function checkURLFilter() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        if (filterParam && filterWrapper) {
            const targetBtn = filterWrapper.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
            if (targetBtn) {
                setTimeout(() => {
                    targetBtn.click();
                }, 100);
            }
        }
    }

    function setupLightbox() {
        lightbox = document.getElementById('lightbox');
        lbImg = document.getElementById('lightbox-img');
        lbCap = document.getElementById('lightbox-caption');
        lbCounter = document.getElementById('lightbox-counter');
        lbClose = document.getElementById('lightbox-close-btn');
        lbPrev = document.getElementById('lightbox-prev-btn');
        lbNext = document.getElementById('lightbox-next-btn');
        lbLoader = document.getElementById('lightbox-loader');
        lbError = document.getElementById('lightbox-error');
        lbRetryBtn = document.getElementById('lightbox-retry-btn');

        if (lightbox) {
            if (lbClose) lbClose.addEventListener('click', closeLightbox);
            if (lbPrev) lbPrev.addEventListener('click', showPrev);
            if (lbNext) lbNext.addEventListener('click', showNext);

            if (lbRetryBtn) {
                lbRetryBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    updateLightbox(true);
                });
            }

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                    closeLightbox();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('active')) return;
                if (e.key === 'Escape') closeLightbox();
                else if (e.key === 'ArrowLeft') showPrev();
                else if (e.key === 'ArrowRight') showNext();
            });

            // Swipe support for mobile
            let touchStartX = 0;
            lightbox.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            lightbox.addEventListener('touchend', (e) => {
                const dx = e.changedTouches[0].screenX - touchStartX;
                const threshold = 55;
                if (Math.abs(dx) > threshold) {
                    dx < 0 ? showNext() : showPrev();
                }
            }, { passive: true });
        }
    }

    // Lightbox controls
    function openLightbox(index) {
        if (!lightbox) return;
        lightboxIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
        if (lbImg) lbImg.focus();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    }

    function showPrev(e) {
        if (e) e.stopPropagation();
        lightboxIndex = (lightboxIndex - 1 + renderedCount) % renderedCount;
        updateLightbox();
    }

    function showNext(e) {
        if (e) e.stopPropagation();
        lightboxIndex = (lightboxIndex + 1) % renderedCount;
        updateLightbox();
    }

    function updateLightbox(cacheBust = false) {
        if (!lbImg || !lbCap || !lbCounter) return;
        const img = currentDataset[lightboxIndex];

        // Hide image & error state, show loader spinner
        lbImg.style.opacity = '0';
        lbImg.style.display = 'none';
        if (lbError) lbError.style.display = 'none';
        if (lbLoader) lbLoader.style.display = 'block';

        const imgSrc = cacheBust ? `${img.src}?retry=${Date.now()}` : img.src;

        // Load image
        lbImg.src = imgSrc;
        lbImg.alt = img.alt;

        lbImg.onload = () => {
            if (lbLoader) lbLoader.style.display = 'none';
            lbImg.style.display = 'block';
            setTimeout(() => {
                lbImg.style.opacity = '1';
            }, 50);
        };

        lbImg.onerror = () => {
            if (lbLoader) lbLoader.style.display = 'none';
            lbImg.style.display = 'none';
            if (lbError) lbError.style.display = 'flex';
        };

        if (lbImg.complete && lbImg.naturalWidth !== 0) {
            if (lbLoader) lbLoader.style.display = 'none';
            lbImg.style.display = 'block';
            lbImg.style.opacity = '1';
        }

        // Setup badge and title
        lbCap.innerHTML = `
            <div class="lightbox-caption-header">
                <span class="lightbox-log-badge">PROJECT</span>
                <span class="lightbox-category">${img.categoryName}</span>
            </div>
            <p class="lightbox-caption-text">${img.title}</p>
        `;
        lbCounter.textContent = `${lightboxIndex + 1} / ${renderedCount}`;
    }

});
