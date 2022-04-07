import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Button, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import decode from 'jwt-decode';

import useStyles from './styles';
import memories from '../../images/memories.png';

const Navbar = () => {
	const classes = useStyles();
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const logOut = () => {
		dispatch({ type: 'LOGOUT' });
		navigate('/');
		setUser(null);
	};
	// console.log(user);
	useEffect(() => {
		const token = user?.token;

		//JWT... check if the token is expired
		if (token) {
			const decodedToken = decode(token);
			if (decodedToken.exp * 1000 < new Date().getTime()) {
				logOut();
			}
		}

		setUser(JSON.parse(localStorage.getItem('profile')));
	}, [location]);

	return (
		<AppBar className={classes.appBar} position="static" color="inherit">
			<div className={classes.brandContainer}>
				<Typography component={Link} to="/" className={classes.heading} variant="h4" align="center">
					Memories
				</Typography>
				<img className={classes.image} src={memories} alt="memories" height="30" />
			</div>
			<Toolbar className={classes.toolbar}>
				{user ? (
					<div className={classes.profile}>
						<Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>
							{user.result.name.charAt(0)}
						</Avatar>
						<Typography className={classes.userName} variant="h6">
							{user.result.name}
						</Typography>
						<Button variant="contained" className={classes.logout} color="secondary" onClick={logOut}>
							Logout
						</Button>
					</div>
				) : (
					<Button component={Link} to="/auth" variant="contained" color="primary">
						Sign In
					</Button>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
