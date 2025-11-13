function injectHTML(fileName, elementId) {
    fetch(fileName)
        .then(response => response.text())
        .then(html => {
            const placeholder = document.getElementById(elementId);
            if (placeholder) {
                placeholder.innerHTML = html;
            }
        })
        .catch(err => {
            console.error('Error loading ' + fileName + ':', err);
        });
}

// Run the function for both header and footer when the page loads
function loadGlobalContent() {
    // Inject the Header
    injectHTML('header.html', 'global-header-placeholder');
    
    // Inject the Footer
    injectHTML('footer.html', 'global-footer-placeholder');
}

// Run the function when the page loads
loadGlobalContent();