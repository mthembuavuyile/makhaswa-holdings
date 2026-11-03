/* =====================================================
   MAKHASWA HOLDINGS — SHARED COMPONENTS
   DRY: Reusable header, footer, and <head> meta.
   Single source of truth for site-wide navigation,
   contact info, and branding.
   ===================================================== */

/**
 * Site-wide configuration — Single source of truth.
 * Update company info, nav links, or contact details
 * here and every page updates automatically.
 */
const SITE_CONFIG = {
    company: {
        name: 'Makhaswa',
        legalName: 'Holdings (Pty) Ltd',
        registration: 'K2017/307900/07',
        bbbee: 'B-BBEE Level 1 Contributor',
        tagline: 'A dynamic civil engineering and construction company committed to excellence, efficiency, and building lasting infrastructure solutions across South Africa.',
        logoSrc: 'images/transparent-logo.png',
        logoAlt: 'Makhaswa Holdings Logo',
        copyright: `\u00A9 ${new Date().getFullYear()} Makhaswa Holdings (Pty) Ltd. All Rights Reserved.`
    },

    social: {
        facebook: 'https://www.facebook.com/p/Makhaswa-Holdings-61573713636972/',
        linkedin: 'https://www.linkedin.com/company/makhaswaholdings/?originalSubdomain=za'
    },

    nav: [
        { label: 'Home', href: 'index.html' },
        { label: 'About Us', href: 'about.html' },
        { 
            label: 'Services', 
            href: 'services.html',
            sublinks: [
                { label: 'All Services Overview', href: 'services.html' },
                { label: 'Civil Infrastructure & Pipelines', href: 'services/civil-works.html' },
                { label: 'Road Construction & Surfacing', href: 'services/road-construction.html' },
                { label: 'Bulk Earthworks & Site Prep', href: 'services/earthworks.html' },
                { label: 'General Building Construction', href: 'services/general-building.html' },
                { label: 'Mechanical Engineering', href: 'services/mechanical-engineering.html' },
                { label: 'Electrical Engineering', href: 'services/electrical-engineering.html' },
            ]
        },
        { label: 'Projects', href: 'projects.html' },
        { label: 'Careers', href: 'careers.html' },
        { label: 'Contact', href: 'contact.html' },
    ],

    quickLinks: [
        { label: 'Home', href: 'index.html' },
        { label: 'About Us', href: 'about.html' },
        { label: 'Our Services', href: 'services.html' },
        { label: 'Projects', href: 'projects.html' },
        { label: 'Careers', href: 'careers.html' },
        { label: 'Contact Us', href: 'contact.html' },
        { label: 'FAQs', href: 'faq.html' },
    ],

    downloads: [
        { label: 'Company Profile', href: 'mailto:info@makhaswaholdings.co.za?subject=Company%20Profile%20Request%20-%20Makhaswa%20Holdings', icon: 'file-text' },
        { label: 'B-BBEE Certificate', href: 'mailto:info@makhaswaholdings.co.za?subject=B-BBEE%20Certificate%20Request%20-%20Makhaswa%20Holdings', icon: 'file-check' },
    ],

    capabilities: [
        { label: 'Civil Infrastructure & Pipelines', href: 'services/civil-works.html' },
        { label: 'Road Construction & Surfacing', href: 'services/road-construction.html' },
        { label: 'Bulk Earthworks & Site Prep', href: 'services/earthworks.html' },
        { label: 'General Building Construction', href: 'services/general-building.html' },
        { label: 'Mechanical Engineering', href: 'services/mechanical-engineering.html' },
        { label: 'Electrical Engineering', href: 'services/electrical-engineering.html' },
    ],

    offices: {
        pretoria: {
            label: 'Pretoria',
            address: '869 Patryshond Street, Garsfontein, Pretoria, 0042',
            phone: '012 944 1702',
            mapQuery: '869%20Patryshond%20Street%2C%20Garsfontein%20Pretoria',
            mapTitle: 'Garsfontein Office',
            mapLabel: 'Garsfontein \u2013 869 Patryshond Street',
        },
        johannesburg: {
            label: 'Johannesburg',
            phone: '011 568 0938',
        },
        limpopo: {
            label: 'Limpopo (Mokopane)',
            address: '197 Dudu Madisha Drive, Chroompark, Mokopane, 0656',
            phone: '012 944 1702',
            mapQuery: '197%20Dudu%20Madisha%20Drive%2C%20Chroompark%2C%20Mokopane%2C%200656',
            mapTitle: 'Mokopane Office',
            mapLabel: 'Mokopane – 197 Dudu Madisha Drive',
        },
        kzn: {
            label: 'KwaZulu-Natal (Durban)',
            address: '71 Bertha Mkhize Street, Durban Central, Durban, 4001',
            phone: '012 944 1702',
            mapQuery: '71%20Bertha%20Mkhize%20Street%2C%20Durban%20Central',
            mapTitle: 'Durban Office',
            mapLabel: 'Durban – 71 Bertha Mkhize Street',
        },
    },

    contact: {
        whatsapp: '+27 81 359 8003',
        emails: [
            'info@makhaswaholdings.co.za',
            'careers@makhaswaholdings.co.za',
            'tenders@makhaswaholdings.co.za',
        ],
    },
};


/* =====================================================
   HELPER: Determine the active page and path prefix
   ===================================================== */
function getPathPrefix() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/projects/') || path.includes('/services/')) {
        return '../';
    }
    return '';
}

function getActivePage() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return filename;
}


/* =====================================================
   BUILD HEADER HTML
   ===================================================== */
function buildHeader() {
    const activePage = getActivePage();
    const cfg = SITE_CONFIG;
    const prefix = getPathPrefix();
    const isServicesFolder = window.location.pathname.toLowerCase().includes('/services/');
    const isServicesActive = isServicesFolder || activePage === 'services.html';

    const navLinksDesktop = cfg.nav.map(link => {
        const isServicesLink = link.href === 'services.html';
        const isCurrentActive = isServicesLink ? isServicesActive : (activePage === link.href || (activePage === '' && link.href === 'index.html'));
        let classes = isCurrentActive ? 'active' : '';
        if (link.label === 'Contact' || link.label === 'Contact Us') {
            classes += (classes ? ' ' : '') + 'nav-contact-btn';
        }
        const classAttr = classes ? ` class="${classes}"` : '';
        const href = link.href.startsWith('http') ? link.href : prefix + link.href;

        if (link.sublinks && link.sublinks.length > 0) {
            const dropdownItemsHtml = link.sublinks.map(sub => {
                const subHref = sub.href.startsWith('http') ? sub.href : prefix + sub.href;
                const isSubActive = activePage === sub.href.replace('services/', '') || (activePage === 'services.html' && sub.href === 'services.html');
                const subClass = isSubActive ? 'nav-dropdown-item active' : 'nav-dropdown-item';
                return `<a href="${subHref}" class="${subClass}" role="menuitem">${sub.label}</a>`;
            }).join('\n                    ');

            return `
            <div class="nav-item nav-item--dropdown">
                <a href="${href}"${classAttr} class="${classes} nav-link--with-dropdown" aria-haspopup="true" aria-expanded="false">
                    ${link.label}
                    <i data-lucide="chevron-down" width="12" height="12" class="dropdown-chevron"></i>
                </a>
                <div class="nav-dropdown-menu" role="menu">
                    ${dropdownItemsHtml}
                </div>
            </div>`;
        }

        return `<a href="${href}"${classAttr}>${link.label}</a>`;
    }).join('\n            ');

    const navLinksMobile = cfg.nav.map(link => {
        const href = link.href.startsWith('http') ? link.href : prefix + link.href;

        if (link.sublinks && link.sublinks.length > 0) {
            const sublinksMobileHtml = link.sublinks.map(sub => {
                const subHref = sub.href.startsWith('http') ? sub.href : prefix + sub.href;
                const isSubActive = activePage === sub.href.replace('services/', '') || (activePage === 'services.html' && sub.href === 'services.html');
                const subActiveClass = isSubActive ? ' active' : '';
                return `<a href="${subHref}" class="mobile-sublink${subActiveClass}">${sub.label}</a>`;
            }).join('\n                ');

            return `
        <div class="mobile-nav-item mobile-nav-item--accordion">
            <button type="button" class="mobile-accordion-toggle" id="mobile-services-toggle" aria-expanded="false">
                <span>${link.label}</span>
                <i data-lucide="chevron-down" width="18" height="18" class="mobile-chevron"></i>
            </button>
            <div class="mobile-submenu" id="mobile-services-submenu">
                ${sublinksMobileHtml}
            </div>
        </div>`;
        }

        const isActive = activePage === link.href || (activePage === '' && link.href === 'index.html');
        return `<a href="${href}" class="mobile-nav-link${isActive ? ' active' : ''}">${link.label}</a>`;
    }).join('\n        ');

    return `
    <!-- =====================================================
         HEADER (Auto-generated by components.js)
    ===================================================== -->
    <header>
        <a href="${prefix}index.html" class="logo">
            <img src="${prefix}${cfg.company.logoSrc}" alt="${cfg.company.logoAlt}">
            <div class="logo-text">${cfg.company.name}<small>${cfg.company.legalName}</small></div>
        </a>

        <!-- Desktop Navigation -->
        <nav id="desktop-nav" aria-label="Primary navigation">
            ${navLinksDesktop}
        </nav>

        <!-- Burger Button -->
        <button class="burger" id="burger-btn" aria-label="Toggle menu" aria-expanded="false">
            <span class="burger-line"></span>
            <span class="burger-line"></span>
            <span class="burger-line"></span>
        </button>
    </header>

    <!-- Mobile Navigation Drawer -->
    <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
        ${navLinksMobile}
    </nav>`;
}


/* =====================================================
   BUILD FOOTER HTML
   ===================================================== */
function buildFooter() {
    const cfg = SITE_CONFIG;
    const pta = cfg.offices.pretoria;
    const jhb = cfg.offices.johannesburg;
    const lmp = cfg.offices.limpopo;
    const kzn = cfg.offices.kzn;
    const prefix = getPathPrefix();

    /* Quick Links list items */
    const quickLinksHtml = cfg.quickLinks.map(link => {
        const href = link.href.startsWith('http') ? link.href : prefix + link.href;
        return `<li><i data-lucide="chevron-right" width="14" height="14" class="footer-icon"></i><a href="${href}">${link.label}</a></li>`;
    }).join('\n                    ');

    /* Downloads list items */
    const downloadsHtml = cfg.downloads.map(link => {
        const isMailto = link.href.startsWith('mailto:');
        const href = (link.href.startsWith('http') || isMailto) ? link.href : prefix + link.href;
        const isPdf = link.href.endsWith('.pdf');
        const isProfileViewer = link.href.includes('company-profile-viewer.html') || link.href.includes('profile-brochure.html');
        const extraAttr = isPdf 
            ? ' target="_blank" download="Makhaswa-Holdings-Company-Profile.pdf"' 
            : (isProfileViewer ? ' target="_blank"' : '');
        const titleAttr = isMailto ? ' title="Request copy via email"' : '';
        const iconName = link.icon || (isMailto ? 'mail' : (isPdf ? 'file-text' : (isProfileViewer ? 'book-open' : 'download')));
        return `<li><i data-lucide="${iconName}" width="14" height="14" class="footer-icon"></i><a href="${href}"${extraAttr}${titleAttr}>${link.label}</a></li>`;
    }).join('\n                    ');

    /* Capabilities list items */
    const capabilitiesHtml = cfg.capabilities.map(cap => {
        if (typeof cap === 'object' && cap.href) {
            const href = cap.href.startsWith('http') ? cap.href : prefix + cap.href;
            return `<li><i data-lucide="chevron-right" width="14" height="14" class="footer-icon"></i><a href="${href}">${cap.label}</a></li>`;
        }
        return `<li><i data-lucide="chevron-right" width="14" height="14" class="footer-icon"></i>${cap}</li>`;
    }).join('\n                    ');

    /* Emails list items */
    const emailsHtml = cfg.contact.emails.map(email =>
        `<li>
                        <i data-lucide="mail" width="14" height="14" class="footer-icon"></i>
                        ${email}
                    </li>`
    ).join('\n                    ');

    return `
    <!-- =====================================================
         FOOTER (Auto-generated by components.js)
    ===================================================== -->
    <footer>
        <div class="footer-inner">

            <!-- Col 1: Brand -->
            <div class="footer-col footer-col--brand">
                <div class="footer-brand-header">
                    <div class="footer-logo-hero">
                        <img src="${prefix}images/logo.jpeg" alt="Makhaswa Holdings Logo">
                    </div>
                    <div class="footer-logo-text">${cfg.company.name}<small>${cfg.company.legalName}</small></div>
                </div>
                <div class="footer-brand-info">
                    <p class="footer-desc">${cfg.company.tagline}</p>
                    <div class="footer-social">
                        <a href="${cfg.social.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                        <a href="${cfg.social.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Col 2: Quick Links & Downloads -->
            <div class="footer-col">
                <h4>Quick Links</h4>
                <ul>
                    ${quickLinksHtml}
                </ul>
                <h4 style="margin-top: 24px;">Downloads</h4>
                <ul>
                    ${downloadsHtml}
                </ul>
            </div>

            <!-- Col 3: Capabilities -->
            <div class="footer-col">
                <h4>Capabilities</h4>
                <ul>
                    ${capabilitiesHtml}
                </ul>
            </div>

            <!-- Col 4: Contact -->
            <div class="footer-col">
                <h4>Contact Us</h4>
                <ul>
                    <!-- Locations -->
                    <li><strong>Locations</strong></li>
                    <li style="align-items: flex-start;">
                        <i data-lucide="map-pin" width="14" height="14" class="footer-icon" style="margin-top: 4px;"></i>
                        <div>
                            ${pta.label}:<br>
                            <a href="https://maps.google.com/?q=${pta.mapQuery}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; display: inline-block; margin-top: 4px;">${pta.address}</a>
                        </div>
                    </li>
                    <li style="align-items: flex-start;">
                        <i data-lucide="map-pin" width="14" height="14" class="footer-icon" style="margin-top: 4px;"></i>
                        <div>
                            ${lmp.label}:<br>
                            <a href="https://maps.google.com/?q=${lmp.mapQuery}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; display: inline-block; margin-top: 4px;">${lmp.address}</a>
                        </div>
                    </li>
                    <li style="align-items: flex-start;">
                        <i data-lucide="map-pin" width="14" height="14" class="footer-icon" style="margin-top: 4px;"></i>
                        <div>
                            ${kzn.label}:<br>
                            <a href="https://maps.google.com/?q=${kzn.mapQuery}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; display: inline-block; margin-top: 4px;">${kzn.address}</a>
                        </div>
                    </li>

                    <!-- Phones -->
                    <li class="footer-contact-separator"><strong>Phone</strong></li>
                    <li>
                        <i data-lucide="phone" width="14" height="14" class="footer-icon"></i>
                        ${pta.label}: ${pta.phone}
                    </li>
                    <li>
                        <i data-lucide="phone" width="14" height="14" class="footer-icon"></i>
                        ${jhb.label}: ${jhb.phone}
                    </li>
                    <li>
                        <i data-lucide="message-square" width="14" height="14" class="footer-icon"></i>
                        WhatsApp: ${cfg.contact.whatsapp}
                    </li>

                    <!-- Emails -->
                    <li class="footer-contact-separator"><strong>Email</strong></li>
                    ${emailsHtml}
                </ul>
            </div>

            <!-- Col 5: Our Footprint (maps) -->
            <div class="footer-col footer-col--footprint">
                <h4>Our Footprint</h4>
                <div class="footer-maps">
                    <div class="map-item map-item--spaced">
                        <span class="map-title">${pta.mapLabel}</span>
                        <iframe class="footer-map"
                            src="https://maps.google.com/maps?q=${pta.mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            loading="lazy" title="${pta.mapTitle}" allowfullscreen="">
                        </iframe>
                    </div>
                    <div class="map-item map-item--spaced">
                        <span class="map-title">${lmp.mapLabel}</span>
                        <iframe class="footer-map"
                            src="https://maps.google.com/maps?q=${lmp.mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            loading="lazy" title="${lmp.mapTitle}" allowfullscreen="">
                        </iframe>
                    </div>
                    <div class="map-item">
                        <span class="map-title">${kzn.mapLabel}</span>
                        <iframe class="footer-map"
                            src="https://maps.google.com/maps?q=${kzn.mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            loading="lazy" title="${kzn.mapTitle}" allowfullscreen="">
                        </iframe>
                    </div>
                </div>
            </div>

        </div>

        <div class="footer-bottom">
            <p>${cfg.company.copyright} | Developed by <a href="https://vylex.co.za" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">Vylex</a></p>
            <div class="footer-bottom-reg">
                <span>REG: ${cfg.company.registration}</span>
                <span>${cfg.company.bbbee}</span>
            </div>
        </div>
    </footer>`;
}


/* =====================================================
/* =====================================================
   INJECT LIGHTBOX MODAL DYNAMICALLY
   ===================================================== */
function injectLightbox() {
    if (document.getElementById('lightbox')) return;

    const activePage = getActivePage();
    if (activePage !== 'projects.html') return;

    const lightboxDiv = document.createElement('div');
    lightboxDiv.id = 'lightbox';
    lightboxDiv.className = 'lightbox-modal';
    lightboxDiv.setAttribute('role', 'dialog');
    lightboxDiv.setAttribute('aria-modal', 'true');
    lightboxDiv.setAttribute('aria-label', 'Image viewer');

    lightboxDiv.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-btn lightbox-close" id="lightbox-close-btn" aria-label="Close image viewer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <button class="lightbox-btn lightbox-prev" id="lightbox-prev-btn" aria-label="Previous image">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <div class="lightbox-loader-spinner" id="lightbox-loader" style="display: none;"></div>
            <div class="lightbox-error-container" id="lightbox-error" style="display: none;">
                <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                <p>Failed to load image. Please check your connection.</p>
                <button class="btn-retry lightbox-retry" id="lightbox-retry-btn" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <path d="M3 3v5h5"></path>
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                        <path d="M16 16h5v5"></path>
                    </svg>
                    Retry
                </button>
            </div>
            <img id="lightbox-img" src="" alt="Active Gallery Image" tabindex="0">
            <div class="lightbox-caption" id="lightbox-caption"></div>
            <div class="lightbox-counter" id="lightbox-counter"></div>
            <button class="lightbox-btn lightbox-next" id="lightbox-next-btn" aria-label="Next image">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    `;

    document.body.appendChild(lightboxDiv);
}

/* =====================================================
   INJECT COMPONENTS INTO THE DOM
   ===================================================== */
function injectComponents() {
    const headerSlot = document.getElementById('site-header');
    const footerSlot = document.getElementById('site-footer');

    if (headerSlot) {
        headerSlot.outerHTML = buildHeader();
    }

    if (footerSlot) {
        footerSlot.outerHTML = buildFooter();
    }

    injectLightbox();
}

/* Export for app.js to call after DOMContentLoaded */
window.MakhaswaComponents = { injectComponents, SITE_CONFIG };
