import React, { useRef, useEffect } from 'react';
import './FilmCard.scss';
import { Rate } from 'antd';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';

import { GenreConsumer } from '../GenreContext/GenreContext.jsx';

const FilmCard = props => {
	const { id, title, vote_average, overview, release_date, poster_path, data, setRatingMovie, currentRating, genre_ids } = props;
	const style = {
		borderColor: `${vote_average < 3 ? '#E90000' : vote_average < 5 ? ' #E97E00' : vote_average < 7 ? '#E9D100' : '#66E900'}`,
	};
	const imageSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : 'https://imgholder.ru/800x800/8493a8/adb9ca&text=NO+POSTER&font=arial';
	const rating = currentRating.find(movie => movie.id === id);
	const ratingValue = rating ? rating.rating : 0;

	const ref = useRef(null);
	useEffect(() => {
		let refEl = ref.current;
		if (refEl) {
			let text = refEl.querySelector('span');
			while (text.offsetHeight > refEl.offsetHeight) {
				text.textContent = text.textContent.split(' ').slice(0, -1).join(' ') + '...';
			}
		}
	}, [data]);

	const handleRating = evt => {
		setRatingMovie(id, evt);
	};

	return (
		<li className='card'>
			<div className='card__wrapper'>
				<div className='card__image'>
					<img src={imageSrc} alt={title} />
				</div>
				<div className='card__content'>
					<div className='card__header'>
						<div className='card__title'>{title}</div>
						<div className='card__circle' style={style}>
							{vote_average.toFixed(1)}
						</div>
					</div>
					<time className='card__date' dateTime={release_date}>
						{release_date ? format(parseISO(`${release_date}`), 'MMMM d, y') : null}
					</time>
					<div className='genre'>
						<GenreConsumer>
							{({ genres }) => {
								if (genres) {
									const filteredArray = genres.filter(item => genre_ids.includes(item.id));
									const items = filteredArray.map(item => {
										return (
											<div key={item.id} className='genre-item'>
												{item.name}
											</div>
										);
									});
									return items;
								}
							}}
						</GenreConsumer>
					</div>
					<div className='card__overview' ref={ref}>
						<span>{overview}</span>
					</div>
					<div className='rate'>
						<Rate allowHalf defaultValue={ratingValue} count={10} onChange={handleRating} />
					</div>
				</div>
			</div>
		</li>
	);
};

export default FilmCard;
FilmCard.propTypes = {
	id: PropTypes.number,
	title: PropTypes.string,
	vote_average: PropTypes.number,
	overview: PropTypes.string,
	release_date: PropTypes.string,
	poster_path: PropTypes.string,
	data: PropTypes.array,
	setRatingMovie: PropTypes.func.isRequired,
	currentRating: PropTypes.array,
	genre_ids: PropTypes.array,
};
FilmCard.defaultProps = {
	id: 1,
	title: '',
	vote_average: 0,
	overview: '',
	release_date: '',
	poster_path: '',
	data: [],
	currentRating: [],
	genre_ids: [],
};
