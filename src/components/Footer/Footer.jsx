import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import './Footer.scss';

const Footer = ({ page, changePage }) => {
	const handlePagination = evt => {
		changePage(evt);
	};
	return (
		<div className='footer'>
			<Pagination total={Math.min(page.total, 500) * 20} showSizeChanger={false} pageSize={20} onChange={handlePagination} current={page.current} />
		</div>
	);
};

export default Footer;
Footer.propTypes = {
	page: PropTypes.object,
	changePage: PropTypes.func,
};
Footer.defaultProps = {
	page: {},
};
