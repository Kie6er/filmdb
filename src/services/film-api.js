export async function filmService(url) {
	const apiBase = 'https://api.themoviedb.org/3';
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDI4YWZmMjViZjAzM2U2ODliZjc1ZWE4NzEyMDc2ZSIsInN1YiI6IjY1ODQ5NGI3M2FmOTI5NGZiZDU5OWUwMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ouZ2n0QFvCxAOXDuDq0HqS3LWM6DOQsrs7UojD5vZw0',
		},
	};

	const res = await fetch(`${apiBase}${url}`, options);
	if (!res.ok) throw new Error(`Could not fetch ${url}, received ${res.status}`);
	return await res.json();
}
export async function getAllFilms(page = 1) {
	return await filmService(`/discover/movie?&language=en-US&page=${page}`);
}
export async function getSearchFilms(input, page = 1) {
	return await filmService(`/search/movie?query=${input}&language=en-US&page=${page}`);
}
export async function createSession() {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDI4YWZmMjViZjAzM2U2ODliZjc1ZWE4NzEyMDc2ZSIsInN1YiI6IjY1ODQ5NGI3M2FmOTI5NGZiZDU5OWUwMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ouZ2n0QFvCxAOXDuDq0HqS3LWM6DOQsrs7UojD5vZw0',
		},
	};

	const res = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', options);
	if (!res.ok) throw new Error(`Could not fetch ${url}, received ${res.status}`);
	return await res.json();
}
export async function fetchRatedMovies(sessionId, page = 1) {
	const _apiKey = '1d28aff25bf033e689bf75ea8712076e';

	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
		},
	};

	const response = await fetch(`https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?api_key=${_apiKey}&language=en-US&page=${page}&sort_by=created_at.asc`, options);
	if (!response.ok) throw new Error(`Could not fetch ${url}, received ${response.status}`);
	return await response.json();
}
export async function handleRateMovie(movieId, rating, sessionId) {
	// Отправка оценки фильма на сервер
	const _apiKey = '1d28aff25bf033e689bf75ea8712076e';

	const options = {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			value: rating,
		}),
	};

	const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${_apiKey}&guest_session_id=${sessionId}`, options);
	if (!response.ok) throw new Error(`Could not fetch ${url}, received ${response.status}`);
	return await response.json();
}
export async function genreMovieList() {
	const apiBase = 'https://api.themoviedb.org/3';
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDI4YWZmMjViZjAzM2U2ODliZjc1ZWE4NzEyMDc2ZSIsInN1YiI6IjY1ODQ5NGI3M2FmOTI5NGZiZDU5OWUwMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ouZ2n0QFvCxAOXDuDq0HqS3LWM6DOQsrs7UojD5vZw0',
		},
	};

	const res = await fetch(`${apiBase}/genre/movie/list?language=en`, options);
	if (!res.ok) throw new Error(`Could not fetch ${url}, received ${res.status}`);
	return await res.json();
}
export async function getRatingMovies(sessionId, page = 1) {
	const _apiKey = '1d28aff25bf033e689bf75ea8712076e';
	const apiBase = 'https://api.themoviedb.org/3';

	const url = new URL(`${apiBase}/guest_session/${sessionId}/rated/movies`);
	const searchParams = new URLSearchParams({
		api_key: _apiKey,
		language: 'en-US',
		page,
		sort_by: 'created_at.asc',
	});

	url.search = searchParams.toString();

	const res = await fetch(url.toString());

	if (!res.ok) {
		throw new Error(`getRatingMovies failed with status: ${res.status}`);
	}

	const rated = await res.json();
	const totalPages = rated.total_pages;
	const fetchPromises = [];

	for (let currentPage = 1; currentPage <= totalPages; currentPage += 1) {
		const fetchPromise = fetch(`${apiBase}/guest_session/${sessionId}/rated/movies?api_key=${_apiKey}&language=en-US&page=${currentPage}&sort_by=created_at.asc`).then(response => {
			if (!response.ok) {
				throw new Error(`getRatingMovies failed with status: ${response.status}`);
			}
			return response.json();
		});

		fetchPromises.push(fetchPromise);
	}

	const movieArrays = await Promise.all(fetchPromises);
	const ratingArr = [];

	movieArrays.forEach(movies => {
		movies.results.forEach(movie => {
			ratingArr.push({ id: movie.id, rating: movie.rating });
		});
	});

	return ratingArr;
}
