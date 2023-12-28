import React, { useRef, useEffect } from 'react';
import './FilmCard.scss';
import { Rate } from 'antd';
import { format, parseISO } from 'date-fns';

const FilmCard = props => {
	const { original_title, vote_average, overview, release_date, poster_path, data } = props;
	const style = {
		border: `0.2rem solid ${vote_average < 3 ? '#E90000' : vote_average < 5 ? ' #E97E00' : vote_average < 7 ? '#E9D100' : '#66E900'}`,
	};
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

	const imageSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : 'https://imgholder.ru/800x800/8493a8/adb9ca&text=NO+POSTER&font=arial';

	return (
		<li className='card'>
			<div className='card__wrapper'>
				<div className='card__image'>
					<img src={imageSrc} alt={original_title} />
				</div>
				<div className='card__content'>
					<div className='card__header'>
						<div className='card__title'>{original_title}</div>
						<div className='card__circle' style={style}>
							{vote_average.toFixed(1)}
						</div>
					</div>
					<time className='card__date' dateTime={release_date}>
						{release_date ? format(parseISO(`${release_date}`), 'MMMM d, y') : null}
					</time>
					<div className='genre'>
						<div className='genre-item'>Action</div>
						<div className='genre-item'>Drama</div>
					</div>
					<div className='card__overview' ref={ref}>
						<span>{overview}</span>
					</div>
					<div className='rate'>
						<Rate allowHalf defaultValue={2.5} count={10} value={vote_average} />
					</div>
				</div>
			</div>
		</li>
	);
};

export default FilmCard;
