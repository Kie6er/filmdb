import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import { Offline, Online } from 'react-detect-offline';
import debounce from 'lodash.debounce';
import { Alert } from 'antd';

import Header from '../components/Header/Header';
import FilmList from '../components/FilmList/FilmList';
import Footer from '../components/Footer/Footer';
import { getAllFilms, getSearchFilms, createSession, fetchRatedMovies, handleRateMovie, getRatingMovies } from '../services/film-api';

const App = () => {
	const [data, setData] = useState([]);
	const [load, setLoad] = useState(true);
	const [error, setError] = useState(false);
	const [page, setPage] = useState({
		current: 1,
		total: null,
	});
	const [value, setValue] = useState();
	const [results, setResults] = useState(false);
	const [sessionID, setSessionID] = useState();
	const [tab, setTab] = useState();
	const [currentRating, setCurrentRating] = useState([]);

	useEffect(() => {
		newSession();
		allFilmsQuery();
	}, []);
	const changePage = page => {
		setLoad(true);
		tab === 'rated' ? ratedMovies(tab, page) : value ? searchFilmsQuery(value, page) : allFilmsQuery(page);
	};
	const onError = () => {
		setError(true);
		setLoad(false);
	};

	const allFilmsQuery = (page = 1) => {
		setLoad(true);
		getAllFilms(page)
			.then(data => {
				setData(data.results);
				setLoad(false);
				setPage({
					current: data.page,
					total: data.total_pages,
				});
			})
			.catch(onError);
	};

	const searchFilmsQuery = useCallback(
		debounce((value, page) => {
			setLoad(true);
			if (value !== undefined && value.trim() !== '') {
				getSearchFilms(value, page)
					.then(data => {
						setPage({
							current: data.page,
							total: data.total_pages,
						});
						if (data.results.length !== 0) {
							setData(data.results);
							setLoad(false);
						} else {
							setResults(true);
							setLoad(false);
						}
					})
					.catch(onError);
			}
		}, 1500),
		[]
	);

	const newSession = () => {
		createSession()
			.then(res => {
				setSessionID(res.guest_session_id);
			})
			.catch(onError);
	};

	const ratedMovies = async (tab, page = 1) => {
		setTab(tab);
		setLoad(true);

		if (tab === 'rated') {
			const rating = await getRatingMovies(sessionID, page);
			setCurrentRating(rating);

			fetchRatedMovies(sessionID, page).then(data => {
				setPage({
					current: data.page,
					total: data.total_pages,
				});
				if (data.results.length !== 0) {
					setData(data.results);
					setLoad(false);
				} else {
					setResults(true);
					setLoad(false);
				}
			});
		} else {
			const rating = await getRatingMovies(sessionID, page);
			setCurrentRating(rating);

			setResults(false);
			allFilmsQuery();
			setValue('');
		}
	};

	const setRatingMovie = (id, rating) => {
		if (rating !== 0) handleRateMovie(id, rating, sessionID);
	};

	return (
		<>
			<Online>
				<section className='film'>
					<div className='film__container container'>
						<div className='film__inner'>
							<Header value={value} setValue={setValue} searchFilmsQuery={searchFilmsQuery} ratedMovies={ratedMovies} />
							<FilmList data={data} load={load} error={error} tab={tab} currentRating={currentRating} results={results} setRatingMovie={setRatingMovie} />
							<Footer page={page} changePage={changePage} />
						</div>
					</div>
				</section>
			</Online>
			<Offline>
				<div className='error-internet'>
					<Alert message='Something has gone terribly wrong' description='Check your internet connection' type='error' showIcon />
				</div>
			</Offline>
		</>
	);
};

export default App;
