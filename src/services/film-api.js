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
