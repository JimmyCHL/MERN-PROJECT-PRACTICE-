import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';

import useStyles from './styles';
import Input from './Input';
import Icon from './Icon';
import { signIn, signUp } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
	const classes = useStyles();
	const [showPassword, setShowPassword] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);
	const [formData, setFormData] = useState(initialState);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem('profile'));
	if (user) {
		return <Navigate to="/posts" />;
	}

	const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (isSignUp) {
			dispatch(signUp(formData, navigate));
		} else {
			dispatch(signIn(formData, navigate));
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const switchMode = () => {
		setIsSignUp((prevIsSignUp) => !prevIsSignUp);
		setShowPassword(false);
	};

	const googleSuccess = async (res) => {
		const result = res?.profileObj;
		const token = res?.tokenId;
		console.log(res);
		try {
			dispatch({ type: 'AUTH', data: { result, token } });
			navigate('/');
		} catch (error) {
			console.log(error);
		}
	};

	const googleFailure = (error) => {
		console.log(error);
		console.log('Google Sign In was unsuccessful. Try Again Later');
	};

	return (
		<Container component="main" maxWidth="xs">
			<Paper className={classes.paper} elevation={3}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>

				<form className={classes.form} onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						{isSignUp && (
							<>
								<Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half type="text" />
								<Input name="lastName" label="Last Name" handleChange={handleChange} half type="text" />
							</>
						)}
						<Input name="email" label="Email Address" handleChange={handleChange} type="email" />
						<Input
							name="password"
							label="Password"
							handleChange={handleChange}
							type={showPassword ? 'text' : 'password'}
							handleShowPassword={handleShowPassword}
						/>
						{isSignUp && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
					</Grid>

					<Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
						{isSignUp ? 'Sign Up' : 'Sign In'}
					</Button>
					<GoogleLogin
						clientId="743639819670-qiv13hgq7sd31t8gkplp51274s8surro.apps.googleusercontent.com"
						render={(renderProps) => (
							<Button
								className={classes.googleButton}
								color="primary"
								fullWidth
								onClick={renderProps.onClick}
								disabled={renderProps.disabled}
								startIcon={<Icon />}
								variant="contained"
							>
								Google Sign In
							</Button>
						)}
						onSuccess={googleSuccess}
						onFailure={googleFailure}
						cookiePolicy="single_host_origin"
					/>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Button onClick={switchMode}>{isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
		</Container>
	);
};

export default Auth;
