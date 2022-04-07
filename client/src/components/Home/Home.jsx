import React, { useState } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Chip, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getPostsBySearch } from '../../actions/posts';
import { useLocation, useNavigate } from 'react-router-dom';

import Form from '../Form/Form';
import Posts from '../Posts/Posts';
import useStyles from './styles';

import Pagination from '../Pagination';

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const Home = () => {
	const [currentId, setCurrentId] = useState(0);
	const [search, setSearch] = useState('');
	const [tags, setTags] = useState([]);
	const classes = useStyles();
	const dispatch = useDispatch();
	const query = useQuery();
	const navigate = useNavigate();
	const page = query.get('page') || 1;
	const searchQuery = query.get('searchQuery');

	const searchPost = () => {
		if (search.trim() || tags.length > 0) {
			dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
			navigate(`/posts/search?searchQuery=${search.trim() || 'none'}&tags=${tags.join(',')}`);
		} else {
			navigate('/');
		}
	};

	const handleKeyPress = (e) => {
		if (e.code === 'Enter') {
			searchPost();
		}
	};

	const handleAdd = (e, tag) => {
		// console.log(e.keyCode);
		if (e.code === 'Enter') {
			setTags([...tags, tag]);
			e.target.value = '';
		}
	};
	const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));

	return (
		<Grow in>
			<Container maxWidth="xl">
				<Grid container className={classes.mainContainer} justifyContent="space-between" alignItems="stretch" spacing={3}>
					<Grid item xs={12} sm={7} md={9}>
						<Posts setCurrentId={setCurrentId} />
					</Grid>
					<Grid item xs={12} sm={5} md={3}>
						<AppBar className={classes.appBarSearch} position="static" color="inherit">
							<TextField
								name="search"
								variant="outlined"
								label="Search Memories"
								fullWidth
								value={search}
								onKeyPress={handleKeyPress}
								onChange={(e) => {
									setSearch(e.target.value);
								}}
							/>
							<Stack direction="row" sx={{ flexWrap: 'wrap' }}>
								{tags.map((tag, i) => (
									<Chip sx={{ m: '4px' }} key={i} label={tag} onDelete={() => handleDelete(tag)} />
								))}
							</Stack>
							<TextField
								sx={{ mt: '10px' }}
								name="search"
								variant="outlined"
								label="Search Tags"
								fullWidth
								onKeyPress={(e) => handleAdd(e, e.target.value)}
							/>
							<Button variant="contained" onClick={searchPost} className={classes.searchButton} color="primary">
								Search
							</Button>
						</AppBar>
						<Form currentId={currentId} setCurrentId={setCurrentId} />
						{!searchQuery && !tags.length && (
							<Paper className={classes.pagination} elevation={6}>
								<Pagination page={page} />
							</Paper>
						)}
					</Grid>
				</Grid>
			</Container>
		</Grow>
	);
};

export default Home;
