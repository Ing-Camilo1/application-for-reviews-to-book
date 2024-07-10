document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
});

function loadProfile() {
    fetch('/book/profile', {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('user-name').textContent = data.user.full_name;
            document.getElementById('user-email').textContent = data.user.email;

            const container = document.getElementById('reviews-container');
            container.innerHTML = ''; // Clear existing reviews

            data.reviews.forEach(review => {
                const reviewItem = document.createElement('div');
                reviewItem.className = 'review-item';
                reviewItem.innerHTML = `
                    <h3>${review.book_name}</h3>
                    <p>Rating: ${review.rating}/5</p>
                    <p>Review: ${review.review}</p>
                    <div class="review-actions">
                        <button class="edit-btn" onclick="editReview(${review.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteReview(${review.id})">Delete</button>
                    </div>
                `;
                container.appendChild(reviewItem);
            });
        })
        .catch(error => console.error('Error:', error));
}

function editReview(reviewId) {
    const rating = prompt("Enter new rating (1-5):");
    const reviewText = prompt("Enter new review:");

    if (rating && reviewText) {
        fetch(`/review/update/${reviewId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating, review: reviewText }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            window.location.reload(); // Reload the page to reflect changes
        })
        .catch(error => console.error('Error:', error));
    }
}

function deleteReview(reviewId) {
    fetch(`/review/delete/${reviewId}`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.reload(); // Reload the page to reflect changes
    })
    .catch(error => console.error('Error:', error));
}
