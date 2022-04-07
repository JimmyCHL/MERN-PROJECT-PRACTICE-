import React, { useEffect } from 'react';
import { Pagination, PaginationItem } from '@mui/material';
import { Link } from 'react-router-dom';
import useStyles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../actions/posts';

const Paginate = ({ page }) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { numberOfPages, posts } = useSelector((state) => state?.posts);

	useEffect(() => {
		if (page) dispatch(getPosts(page));
	}, [page]);

	return (
		<Pagination
			classes={{ ul: classes.ul }} //pagination need to use this way
			count={numberOfPages}
			page={Number(page) || 1}
			color="primary"
			variant="outlined"
			renderItem={(item) => <PaginationItem {...item} component={Link} to={`/posts?page=${item.page}`} />}
		/>
	);
};

export default Paginate;
