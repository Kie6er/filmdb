import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert } from 'antd';

import FilmCard from '../FilmCard/FilmCard';
import './FilmList.scss';

const FilmList = ({ data, load, error, results }) => {
	const errorMessage = <Alert message='Something has gone terribly wrong' description="Keep calm, we're already trying to fix it" type='error' showIcon />;
	const searchMessage = <Alert message='No results' type='info' />;
	const hasData = !(load || error);
	const elements = data.map(el => {
		return <FilmCard key={el.id} {...el} data={data} />;
	});
	const verification = load ? <LoadingOutlined /> : results ? searchMessage : hasData ? elements : errorMessage;

	return <ul className='film-list'>{verification}</ul>;
};

export default FilmList;
