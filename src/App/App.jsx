import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import { Offline, Online } from 'react-detect-offline';
import debounce from 'lodash.debounce';
import { Alert } from 'antd';

import Header from '../components/Header/Header';
import FilmList from '../components/FilmList/FilmList';
import Footer from '../components/Footer/Footer';
import { getAllFilms, getSearchFilms } from '../services/film-api';

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

	useEffect(() => {
		allFilmsQuery();
	}, []);
	const changePage = page => {
		setLoad(true);
		value ? searchFilmsQuery(value, page) : allFilmsQuery(page);
	};
	const onError = () => {
		setError(true);
		setLoad(false);
	};

	const allFilmsQuery = (page = 1) => {
		getAllFilms(page)
			.then(data => {
				setData(data.results);
				setLoad(false);
				setPage({
					current: page,
					total: data.total_pages,
				});
			})
			.catch(onError);
	};

	const searchFilmsQuery = useCallback(
		debounce((value, page) => {
			if (value !== undefined && value.trim() !== '') {
				setLoad(true);
				getSearchFilms(value, page)
					.then(data => {
						if (data.results.length !== 0) {
							setData(data.results);
							setLoad(false);
							setPage({
								current: data.page,
								total: data.total_pages,
							});
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

	return (
		<>
			<Online>
				<section className='film'>
					<div className='film__container container'>
						<div className='film__inner'>
							<Header setValue={setValue} searchFilmsQuery={searchFilmsQuery} />
							<FilmList data={data} load={load} error={error} results={results} />
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
