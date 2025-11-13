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
    // 1. Normalize the current URL to the last segment (e.g., 'TOF11Micah' if the URL ends in /TOF11Micah/)
    const currentPathname = window.location.pathname;
    
    // Remove the trailing slash and split by /. The last segment is the page's identifier.
    // Example: /.../BCollection1/TOF11Micah/ -> ['...','BCollection1','TOF11Micah',''] -> last segment is 'TOF11Micah'
    const normalizedCurrentPathSegment = currentPathname
        .replace(/\/$/, '') // Remove trailing slash
        .split('/')
        .pop(); 

    const navLinks = document.querySelectorAll('.story-nav-sidebar a');

    // CRITICAL: Remove all active classes before starting the loop
    const currentlyActive = document.querySelector('.story-nav-sidebar .active-story');
    if (currentlyActive) {
        currentlyActive.classList.remove('active-story');
    }
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href'); 
        
        // 2. Normalize the link's href to its last segment
        // Example: BookCollectionsGallery/BCollection1/TOF11Micah/ -> 'TOF11Micah'
        const linkPathSegment = linkHref
            .replace(/\/$/, '') // Remove trailing slash
            .split('/')
            .pop();
        
        // 3. Compare the two isolated segments for an EXACT match
        if (linkPathSegment === normalizedCurrentPathSegment && linkPathSegment !== '') {
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