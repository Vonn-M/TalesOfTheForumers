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
    // Current URL pathname (e.g., /TalesOfTheForumers/TOF11Micah/)
    const currentPathname = window.location.pathname;

    const navLinks = document.querySelectorAll('.story-nav-sidebar a');

    navLinks.forEach(link => {
        // Link's href attribute (e.g., TOF11Micah/)
        const linkHref = link.getAttribute('href'); 
        
        // Check if the current path includes the link's folder name
        if (currentPathname.includes(linkHref) && linkHref !== '/') {
            // Remove/add active class
            const currentlyActive = document.querySelector('.active-story');
            if (currentlyActive) {
                currentlyActive.classList.remove('active-story');
            }
            link.classList.add('active-story');
        } 
    });
}

function highlightActiveNav() {
    // Current path is usually /repo-name/folder/subfolder/
    const currentPathname = window.location.pathname; 
    
    // Normalize the path by removing the trailing slash and repo name
    // Example: /TalesOfTheForumers/BookCollectionsGallery/  ->  BookCollectionsGallery
    const normalizedCurrentPath = currentPathname
        .replace(/\/$/, '') // Remove trailing slash
        .split('/')
        .pop(); // Get the last segment (e.g., TOF11Micah, or BookCollectionsGallery)
    
    // Safety check for the root home page
    const isHomePage = currentPathname === '/TalesOfTheForumers/' || currentPathname === '/';

    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href'); 
        
        // 1. Remove ALL previously applied active-nav classes
        link.classList.remove('active-nav'); 

        // 2. Check for the Home Page (if the link is just '/')
        if (linkHref === '/' && isHomePage) {
            link.classList.add('active-nav');
            return;
        }

        // 3. Check for exact matches (e.g., /about/ should match only the about page)
        // Normalize the link's href for a clean comparison
        const normalizedLinkHref = linkHref.replace(/\/$/, ''); // Remove trailing slash
        
        // This makes sure the path is an EXACT match (not just an inclusion)
        if (normalizedCurrentPath === normalizedLinkHref.split('/').pop()) {
             // Re-verify that the full current path DOES NOT contain the link's href 
             // as a sub-path, unless it's the specific target.
             link.classList.add('active-nav');
        }
    });
}

// Run the function for all global and reusable content
function loadGlobalContent() {
    // Inject the Header and Footer first (order doesn't matter much for these)
    injectHTML('header.html', 'global-header-placeholder');
    injectHTML('footer.html', 'global-footer-placeholder');

    // ----------------------------------------------------------------------
    // CRITICAL FIX: Use the Promise returned by injectHTML for the sidebar
    // ----------------------------------------------------------------------
    
    // 1. Inject the Main Sidebar
    const mainSidebarLoad = injectHTML('main-sidebar.html', 'main-sidebar-placeholder');
    
    // 2. Inject the Story Navigation Sidebar
    const storyNavLoad = injectHTML('story-nav-sidebar.html', 'story-nav-sidebar-placeholder');

    // Wait for BOTH sidebars to load (just in case they both exist on the page)
    Promise.all([mainSidebarLoad, storyNavLoad])
        .then(() => {
            // This code runs ONLY after the HTML injection is complete.
            // Now, we can safely find the links and apply the active class.
            highlightActiveStory();
        })
        .catch(error => {
            console.error("Error during sidebar injection/highlighting:", error);
        });

        const headerLoad = injectHTML('header.html', 'global-header-placeholder');

    // After the header is successfully loaded:
    headerLoad.then(() => {
        highlightActiveNav(); // <-- Run the new function
    });
}

// Run the function when the page loads
loadGlobalContent();