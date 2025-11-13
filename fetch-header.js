function loadHeader() {
    fetch('header.html') // Path to the header file you created
        .then(response => response.text())
        .then(html => {
            const placeholder = document.getElementById('global-header-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;
            }
        })
        .catch(err => {
            console.error('Error loading header:', err);
        });
}

// Run the function when the page loads
loadHeader();