// Get the button and counter elements
const likeButton = document.getElementById('likeButton');
const likeCountSpan = document.getElementById('likeCount');

// Initialize the count (starts at 0 when the page loads)
let count = 0;

// Add a click listener to the button
likeButton.addEventListener('click', function() {
    // 1. Increment the count
    count++;
    
    // 2. Update the number displayed on the page
    likeCountSpan.textContent = count;
    
    // Optional: Visually indicate it was liked
    likeButton.disabled = true; // Disable after first click if you want a user to only click once
    likeButton.textContent = "Liked!";
});