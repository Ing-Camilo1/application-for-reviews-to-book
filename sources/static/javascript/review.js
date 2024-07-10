document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('review-form');
    const reviewsContainer = document.getElementById('reviews');
    const bookId = 1; // Asegúrate de definir cómo obtener el ID del libro en tu aplicación

    // Fetch existing reviews
    function loadReviews() {
        fetch(`/book/reviews/${bookId}`)
            .then(response => response.json())
            .then(reviews => {
                reviewsContainer.innerHTML = reviews.map(review => `
                    <div class="review">
                        <p><strong>${review.full_name}</strong> - ${review.rating} stars</p>
                        <p>${review.review}</p>
                    </div>
                `).join('');
            });
    }

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const rating = document.getElementById('rating').value;
        const review = document.getElementById('review').value;

        fetch('/book/review/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                book_id: bookId,
                rating: rating,
                review: review
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                loadReviews();
                form.reset();
            } else {
                alert('Error submitting review');
            }
        });
    });

    // Load reviews on page load
    loadReviews();
});
