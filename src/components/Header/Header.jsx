import React, { useState } from 'react';
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
	const { setValue, searchFilmsQuery } = props;
	const [current, setCurrent] = useState('search');

	const onClick = e => setCurrent(e.key);
	const changeHandler = evt => {
		setValue(evt.target.value);
		searchFilmsQuery(evt.target.value);
	};

	return (
		<div className='header'>
			<div className='header__menu'>
				<Menu onClick={onClick} selectedKeys={[current]} mode='horizontal' items={items} />
			</div>
			<div className='header__search'>
				<Input type='text' placeholder='Type to search...' onChange={changeHandler} />
			</div>
		</div>
	);
};
export default Header;
