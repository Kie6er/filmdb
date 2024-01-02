import React, { useState, useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import PropTypes from 'prop-types';

import FilmCard from '../FilmCard/FilmCard';
import './FilmList.scss';
import { GenreProvider } from '../GenreContext/GenreContext.jsx';
import { genreMovieList } from '../../services/film-api';

const FilmList = ({ data, load, error, results, setRatingMovie, tab, currentRating }) => {
	const [genreData, setGenreData] = useState([]);
	const errorMessage = <Alert message='Something has gone terribly wrong' description="Keep calm, we're already trying to fix it" type='error' showIcon />;
	const searchMessage = <Alert message='No results' type='info' />;

	const hasData = !(load || error);
	const elements = data.map(el => {
		return <FilmCard key={el.id} {...el} data={data} tab={tab} currentRating={currentRating} setRatingMovie={setRatingMovie} />;
	});

	const verification = load ? <LoadingOutlined /> : results ? searchMessage : hasData ? elements : errorMessage;

	useEffect(() => {
		genreMovieList().then(data => setGenreData(data));
	}, []);
	return (
		<GenreProvider value={genreData}>
			<ul className='film-list'>{verification}</ul>
		</GenreProvider>
	);
};

export default FilmList;
FilmList.propTypes = {
	data: PropTypes.array,
	load: PropTypes.bool,
	error: PropTypes.bool,
	results: PropTypes.bool,
	tab: PropTypes.string,
	setRatingMovie: PropTypes.func.isRequired,
	currentRating: PropTypes.array,
};
FilmList.defaultProps = {
	data: [],
	load: false,
	error: false,
	results: false,
	tab: 'search',
	currentRating: [],
};
