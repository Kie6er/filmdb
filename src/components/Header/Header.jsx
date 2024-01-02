import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Header.scss';
import { Menu, Input } from 'antd';

const items = [
	{
		label: 'Search',
		key: 'search',
	},
	{
		label: 'Rated',
		key: 'rated',
	},
];
const Header = props => {
	const { value, setValue, searchFilmsQuery, ratedMovies } = props;
	const [current, setCurrent] = useState('search');

	const onClick = e => {
		setCurrent(e.key);
		ratedMovies(e.key);
	};
	const changeHandler = evt => {
		setValue(evt.target.value);
		searchFilmsQuery(evt.target.value);
	};

	const search =
		current === 'search' ? (
			<div className='header__search'>
				<Input type='text' placeholder='Type to search...' onChange={changeHandler} value={value} />
			</div>
		) : null;

	return (
		<div className='header'>
			<div className='header__menu'>
				<Menu onClick={onClick} selectedKeys={[current]} mode='horizontal' items={items} />
			</div>
			{search}
		</div>
	);
};
export default Header;

Header.propTypes = {
	value: PropTypes.string,
	searchFilmsQuery: PropTypes.func,
	ratedMovies: PropTypes.func,
};
Header.defaultProps = {
	value: '',
};
