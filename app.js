const apiKey = 'da63548086e399ffc910fbc08526df05';
const movieResults = document.getElementById('movie-results');
const watchlist = document.getElementById('watchlist-movies');

async function searchMovies() {
    const query = document.getElementById('search-input').value;
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
    const data = await response.json();
    displayMovies(data.results);
}

function displayMovies(movies) {
    movieResults.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <h3>${movie.title}</h3>
            <p>Rating: ${movie.vote_average}</p>
            <button onclick="showMovieDetails(${movie.id})">View Details</button>
            <button onclick="addToWatchlist(${movie.id}, '${movie.title}')">Add to Watchlist</button>
        `;
        movieResults.appendChild(movieCard);
    });
}
async function showMovieDetails(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
    const movie = await response.json();

    const modal = document.getElementById('movie-modal');
    const movieDetails = document.getElementById('movie-details');
    movieDetails.innerHTML = `
        <h2>${movie.title}</h2>
        <p>${movie.overview}</p>
        <p>Release Date: ${movie.release_date}</p>
        <p>Rating: ${movie.vote_average}</p>
    `;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('movie-modal').style.display = 'none';
}
function addToWatchlist(movieId, title) {
    let watchlistMovies = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlistMovies.some(movie => movie.id === movieId)) {
        watchlistMovies.push({ id: movieId, title });
        localStorage.setItem('watchlist', JSON.stringify(watchlistMovies));
        displayWatchlist();
    }
}

function displayWatchlist() {
    const watchlistMovies = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist.innerHTML = '';
    watchlistMovies.forEach(movie => {
        const watchlistCard = document.createElement('div');
        watchlistCard.className = 'watchlist-card';
        watchlistCard.innerHTML = `
            <h3>${movie.title}</h3>
            <button onclick="removeFromWatchlist(${movie.id})">Remove</button>
        `;
        watchlist.appendChild(watchlistCard);
    });
}

function removeFromWatchlist(movieId) {
    let watchlistMovies = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlistMovies = watchlistMovies.filter(movie => movie.id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlistMovies));
    displayWatchlist();
}

document.addEventListener('DOMContentLoaded', displayWatchlist);