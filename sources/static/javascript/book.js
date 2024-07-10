function searchBooks() {
    const query = document.getElementById('search-input').value;
    const author = document.getElementById('select-autors').value;
    const genre = document.getElementById('select-generos').value;

    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (author) params.append('author', author);
    if (genre) params.append('genre', genre);

    fetch(`/search?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('card-container');
            container.innerHTML = '';
            data.forEach(book => {
                const card = document.createElement('div');
                card.className = 'card';
                const imageUrl = book.image_url ? `/static/img/${book.image_url}` : '/static/img/default-image.png';
                const bookUrl = `/${encodeURIComponent(book.name.replace(/\s+/g, '-').toLowerCase())}`;
                card.innerHTML = `
                    <a href="${bookUrl}">
                        <h3>${book.name}</h3>
                        <img src="${imageUrl}" alt="${book.name}">
                    </a>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error:', error));
}
