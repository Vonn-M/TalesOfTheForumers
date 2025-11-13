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
    // 1. Get the current page's URL pathname (e.g., /TalesOfTheForumers/about.html)
    const currentPathname = window.location.pathname;

    // 2. Find all navigation links in the header
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        // Get the link's href (e.g., index.html or about.html)
        const linkHref = link.getAttribute('href');
        
        // 3. Compare the current URL with the link's href
        // We use .includes() for the home page (index.html or just /) and endsWith() for others.

        // A. Handle the Home Page
        if (linkHref === '/' && currentPathname.endsWith('/')) {
            link.classList.add('active-nav');
            return; // Stop checking other links
        }

        // B. Handle all other pages (e.g., about.html, gallery.html)
        if (currentPathname.endsWith(linkHref)) {
            link.classList.add('active-nav');
        } else {
            // Safety check: remove the class if the link is not active
            link.classList.remove('active-nav'); 
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