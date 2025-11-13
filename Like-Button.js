// Get the button and counter elements
// Ensure this script runs AFTER the Firebase SDKs and initialization code in your HTML

const likeButton = document.getElementById('likeButton');
const likeCountSpan = document.getElementById('likeCount');
const pathSegments = window.location.pathname.split('/').filter(segment => segment);

// Get the last meaningful segment (which is the chapter/page folder name, 
// e.g., 'TOF11Micah' from the URL path)
let pageId = pathSegments[pathSegments.length - 1] || 'homepage';

// If the page is the root index (e.g., 'homepage'), ensure the ID is unique
if (pageId === 'TalesOfTheForumers' || pageId === '') {
    pageId = 'homepage'; 
}

// Key for Local Storage to prevent repeated clicks from the same user
const likedFlagKey = pageId + '-liked';
const hasLiked = localStorage.getItem(likedFlagKey) === 'true';

// -------------------------------------------------------------------
// 1. Initial Load: Get the current public count from Firebase
// -------------------------------------------------------------------

// Reference to the document in Firestore that stores this page's count
const pageRef = db.collection('pageLikes').doc(pageId);

// Fetch the data once
pageRef.get().then((doc) => {
    if (doc.exists) {
        // Data exists, use the stored count
        const currentCount = doc.data().count;
        likeCountSpan.textContent = currentCount;
    } else {
        // Data doesn't exist (first like), set it to 0
        likeCountSpan.textContent = 0;
        // Optionally create the document with a count of 0
        pageRef.set({ count: 0 });
    }
}).catch((error) => {
    console.error("Error getting document:", error);
});


// -------------------------------------------------------------------
// 2. Button State Setup
// -------------------------------------------------------------------

if (hasLiked) {
    likeButton.textContent = "Liked!";
    likeButton.disabled = true;
}


// -------------------------------------------------------------------
// 3. Button Click: Update the counter in Firebase
// -------------------------------------------------------------------

likeButton.addEventListener('click', function() {
    if (!hasLiked) {
        // Use Firebase's server-side increment (ensures accuracy with multiple simultaneous clicks)
        pageRef.update({
            count: firebase.firestore.FieldValue.increment(1)
        })
        .then(() => {
            // Update the display optimistically
            const currentCount = parseInt(likeCountSpan.textContent);
            likeCountSpan.textContent = currentCount + 1;
            
            // Set local flag to prevent future clicks from this user
            localStorage.setItem(likedFlagKey, 'true');
            likeButton.textContent = "Liked!";
            likeButton.disabled = true;
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
            alert("Could not update the like count. Please check your network connection.");
        });
    }
});