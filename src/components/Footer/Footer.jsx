import React from 'react';
import { Pagination } from 'antd';
import './Footer.scss';

const Footer = ({ page, changePage }) => {
	const handlePagination = evt => {
		changePage(evt);
	};
	return (
		<div className='footer'>
			<Pagination defaultCurrent={page.current} total={Math.min(page.total, 500) * 20} showSizeChanger={false} pageSize={20} onChange={handlePagination} />
		</div>
	);
};

export default Footer;
