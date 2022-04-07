import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import PostDetails from './components/PostDetails/PostDetails';
import { useDispatch } from 'react-redux';

const App = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		if (localStorage.getItem('profile')) {
			dispatch({ type: 'RELOAD', data: JSON.parse(localStorage.getItem('profile')) });
		}
	}, [dispatch]);
	return (
		<BrowserRouter>
			<Container maxWidth="xl">
				<Navbar />
				<Routes>
					<Route path="/" element={<Navigate to="/posts" />} />
					<Route path="/posts" element={<Home />} />
					<Route path="/posts/search" element={<Home />} />
					<Route path="/posts/:id" element={<PostDetails />} />
					<Route path="/auth" element={<Auth />} />
				</Routes>
			</Container>
		</BrowserRouter>
	);
};

export default App;
