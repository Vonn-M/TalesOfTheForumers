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
    // 1. Get the current page's full path (e.g., /TalesOfTheForumers/BookCollectionsGallery/BCollection1/TOF11Micah/)
    const currentPathname = window.location.pathname;
    
    // Normalize the current path by removing the repository name and trailing slash for clean comparison
    // Assuming your repo name is 'TalesOfTheForumers'
    const cleanCurrentPath = currentPathname
        .replace(/\/TalesOfTheForumers\//i, '/') // Replace repo name with a single slash
        .replace(/\/$/, ''); // Remove trailing slash

    const navLinks = document.querySelectorAll('.story-nav-sidebar a');

    // CRITICAL: Remove all active classes before starting the loop
    const currentlyActive = document.querySelector('.story-nav-sidebar .active-story');
    if (currentlyActive) {
        currentlyActive.classList.remove('active-story');
    }
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href'); 
        
        // Normalize the link's href (it's often a relative path like ../../)
        // We use a temporary anchor element to resolve the relative path to an absolute path.
        const tempAnchor = document.createElement('a');
        tempAnchor.href = linkHref;
        
        // Get the resolved, clean path of the link (e.g., /BookCollectionsGallery/BCollection1/)
        const cleanLinkPath = tempAnchor.pathname
            .replace(/\/TalesOfTheForumers\//i, '/')
            .replace(/\/$/, '');

        // 3. Compare the cleaned full paths
        // Check for an EXACT match. A chapter link MUST NOT be a parent of the current page.
        if (cleanCurrentPath === cleanLinkPath) {
            link.classList.add('active-story');
        } else {
             link.classList.remove('active-story');
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