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

function highlightActiveStory() {
    const currentPathname = window.location.pathname;
    
    // 1. Get the last segment of the current URL (e.g., 'TOF11Micah')
    const normalizedCurrentPathSegment = currentPathname
        .replace(/\/$/, '') 
        .split('/')
        .pop(); 

    const navLinks = document.querySelectorAll('.story-nav-sidebar a');

    // CRITICAL: Remove all active classes before starting the loop
    // Find all links in the sidebar that have the class and remove it.
    navLinks.forEach(link => {
        link.classList.remove('active-story');
    });

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href'); 
        
        // 2. Get the last segment of the link's href (e.g., 'TOF11Micah')
        const linkPathSegment = linkHref
            .replace(/\/$/, '') 
            .split('/')
            .pop();
        
        // 3. Compare the two isolated segments for an EXACT match
        // We ensure the link is NOT the immediate parent link that links backwards.
        if (linkPathSegment === normalizedCurrentPathSegment && linkPathSegment !== '') {
            link.classList.add('active-story');
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