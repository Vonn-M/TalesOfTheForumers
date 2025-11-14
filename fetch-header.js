function normalizePath(path) {
    // 1. Remove the repository name (case-insensitive)
    let cleanPath = path.replace(/\/talesoftheforumers\//i, '/');
    
    // 2. Remove any leading/trailing slashes, resulting in a clean string
    cleanPath = cleanPath.replace(/^\/|\/$/g, '');
    
    return cleanPath;
}

function injectHTML(fileName, elementId) {
    const placeholder = document.getElementById(elementId);
    
    // Only attempt to fetch if the placeholder exists on the current page
    if (placeholder) {
        return fetch(fileName) // <-- Start returning the fetch promise
            .then(response => response.text())
            .then(html => {
                placeholder.innerHTML = html;
            })
            .catch(err => {
                console.error('Error loading ' + fileName + ':', err);
            });
    }
    // Return a resolved promise if the element doesn't exist to allow chaining
    return Promise.resolve(); 
}



function highlightActiveStory() {
    // A. Get the current page's normalized path
    const currentPathname = window.location.pathname;
    const cleanCurrentPath = normalizePath(currentPathname); 

    const navLinks = document.querySelectorAll('.story-nav-sidebar a');

    // CRITICAL: Remove all active classes before starting the loop
    const currentlyActive = document.querySelector('.story-nav-sidebar .active-story');
    if (currentlyActive) {
        currentlyActive.classList.remove('active-story');
    }
    
    // Define the specific path for the Collections Gallery page (parent)
    const collectionsGalleryPath = 'BookCollectionsGallery'; 
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href'); 
        
        // B. Get the link's normalized path
        const tempAnchor = document.createElement('a');
        tempAnchor.href = linkHref;
        const cleanLinkPath = normalizePath(tempAnchor.pathname); 

        // 3. Compare the two cleaned strings for an EXACT match
        if (cleanCurrentPath === cleanLinkPath && cleanCurrentPath !== '') {
            
            // **NEW EXCLUSION RULE:** // Do NOT highlight the "Back to Collections" link if we are on the collections page itself.
            if (cleanLinkPath === collectionsGalleryPath) {
                // If the link is the "Back to Collections" link AND the current page is the collections page, skip highlighting.
                return; 
            }
            
            link.classList.add('active-story');
        } 
    });
}

function highlightActiveNav() {
    // 1. Get the current page's normalized path
    const currentPathname = window.location.pathname;
    const cleanCurrentPath = normalizePath(currentPathname); // Example: "BookCollectionsGallery/BCollection1/TOF11Micah"
    
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href'); 
        
        // Always remove the class first
        link.classList.remove('active-nav'); 
        
        // 2. Get the link's normalized path
        // Use a temporary anchor to resolve relative links if necessary, and then clean.
        const tempAnchor = document.createElement('a');
        tempAnchor.href = linkHref;
        const cleanLinkPath = normalizePath(tempAnchor.pathname); // Example: "BookCollectionsGallery" or "about"

        // --- Highlight Logic ---

        // A. Home Page Check (Link is '/')
        if (linkHref === '/' && currentPathname.replace(/\/$/, '') === '/TalesOfTheForumers') {
            link.classList.add('active-nav');
            return;
        }

        // B. Top-Level Page Check (Perfect Match)
        if (cleanCurrentPath === cleanLinkPath) {
            link.classList.add('active-nav');
            return;
        }
        
        // C. Sub-Page Check (Does the current path START with the link's path?)
        // This makes sure the "BookCollectionsGallery" link is highlighted when you are on a chapter sub-page.
        if (cleanCurrentPath.startsWith(cleanLinkPath) && cleanLinkPath !== '') {
            link.classList.add('active-nav');
        }
    });
}

// Run the function for all global and reusable content
function loadGlobalContent() {
    // 1. Inject Header (and save the promise)
    const headerLoad = injectHTML('header.html', 'global-header-placeholder'); 
    
    // 2. Inject Footer
    injectHTML('footer.html', 'global-footer-placeholder');

    // 3. Inject Sidebars (and save promises)
    const mainSidebarLoad = injectHTML('main-sidebar.html', 'main-sidebar-placeholder');
    const storyNavLoad = injectHTML('story-nav-sidebar.html', 'story-nav-sidebar-placeholder');

    // Wait for the elements to load before highlighting
    headerLoad.then(() => {
        highlightActiveNav();
    });
    
    Promise.all([mainSidebarLoad, storyNavLoad])
        .then(() => {
            highlightActiveStory();
        })
        .catch(error => {
            console.error("Error during sidebar injection/highlighting:", error);
        });
}

// Run the function when the page loads
loadGlobalContent();