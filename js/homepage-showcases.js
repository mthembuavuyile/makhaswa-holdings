document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const featuredGrid = document.getElementById('featured-projects-grid');
    const deliverGrid = document.getElementById('what-we-deliver-grid');
    if (!featuredGrid && !deliverGrid) return;

    const categories = {
        building: 'Building Construction & Housing Developments',
        civil: 'Civil Works & Infrastructure',
        earthworks: 'Earthworks & Site Prep',
        roads: 'Road Construction & Surfacing'
    };
    const projectDataPromises = new Map();

    function getProjectData(category) {
        if (!projectDataPromises.has(category)) {
            projectDataPromises.set(category, fetch(`projects/${category}.json`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${category} projects: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (!data || !Array.isArray(data.images)) {
                        throw new Error(`Invalid image data in projects/${category}.json`);
                    }
                    return data.images;
                }));
        }
        return projectDataPromises.get(category);
    }

    async function resolveSelection(selection) {
        if (!Array.isArray(selection)) {
            throw new Error('Homepage image selections must be arrays.');
        }

        return Promise.all(selection.map(async item => {
            if (!item || !categories[item.category] || typeof item.imageId !== 'string') {
                throw new Error('Homepage image selection has an invalid category or image ID.');
            }

            const images = await getProjectData(item.category);
            const image = images.find(candidate => candidate.id === item.imageId);
            if (!image) {
                throw new Error(`Image "${item.imageId}" was not found in projects/${item.category}.json`);
            }
            if (typeof image.src !== 'string' || typeof image.alt !== 'string' || typeof image.title !== 'string') {
                throw new Error(`Image "${item.imageId}" is missing required project image data.`);
            }

            return { ...image, category: item.category, categoryName: categories[item.category] };
        }));
    }

    function showUnavailable(grid, message) {
        if (!grid) return;
        const notice = document.createElement('p');
        notice.textContent = message;
        grid.appendChild(notice);
    }

    function renderFeaturedProjects(projects) {
        if (!featuredGrid) return;
        if (projects.length === 0) {
            showUnavailable(featuredGrid, 'No featured projects available.');
            return;
        }

        projects.forEach(project => {
            const card = document.createElement('a');
            card.href = `projects.html?filter=${encodeURIComponent(project.category)}`;
            card.className = 'project-card';
            card.setAttribute('aria-label', `View ${project.categoryName} projects`);

            const skeleton = document.createElement('div');
            skeleton.className = 'project-skeleton';

            const image = document.createElement('img');
            image.src = project.src;
            image.alt = project.alt;
            image.loading = 'lazy';
            image.width = 600;
            image.height = 400;
            image.style.opacity = '0';
            image.style.transition = 'opacity 0.4s ease';
            image.addEventListener('load', () => {
                skeleton.style.display = 'none';
                image.style.opacity = '1';
            });

            const overlay = document.createElement('div');
            overlay.className = 'project-overlay';
            const categoryName = document.createElement('span');
            categoryName.textContent = project.categoryName;
            const title = document.createElement('h4');
            title.textContent = project.title;
            overlay.append(categoryName, title);
            card.append(skeleton, image, overlay);
            featuredGrid.appendChild(card);
        });
    }

    function renderWhatWeDeliver(images) {
        if (!deliverGrid) return;
        if (images.length === 0) {
            showUnavailable(deliverGrid, 'Showcase images are currently unavailable.');
            return;
        }

        images.forEach(project => {
            const image = document.createElement('img');
            image.src = project.src;
            image.alt = project.alt;
            image.loading = 'lazy';
            image.width = 600;
            image.height = 400;
            deliverGrid.appendChild(image);
        });
    }

    let selections;
    try {
        const response = await fetch('data/homepage-selections.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch homepage image selections: ${response.status}`);
        }
        selections = await response.json();
    } catch (error) {
        console.error('Error loading homepage image selections:', error);
        showUnavailable(featuredGrid, 'Featured projects are currently unavailable.');
        showUnavailable(deliverGrid, 'Showcase images are currently unavailable.');
        return;
    }

    if (featuredGrid) {
        try {
            renderFeaturedProjects(await resolveSelection(selections.featuredProjects));
        } catch (error) {
            console.error('Error loading featured projects:', error);
            showUnavailable(featuredGrid, 'Featured projects are currently unavailable.');
        }
    }

    if (deliverGrid) {
        try {
            renderWhatWeDeliver(await resolveSelection(selections.whatWeDeliver));
        } catch (error) {
            console.error('Error loading showcase images:', error);
            showUnavailable(deliverGrid, 'Showcase images are currently unavailable.');
        }
    }
});
