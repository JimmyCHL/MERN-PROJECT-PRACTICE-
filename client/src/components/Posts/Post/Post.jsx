import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import MoreHorzIcon from '@mui/icons-material/MoreHoriz';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import useStyles from './styles';
import Delete from '@mui/icons-material/Delete';
import { deletePost, likePost } from '../../../actions/posts';

const Post = ({ post, setCurrentId }) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.authData);
	const navigate = useNavigate();
	const [likes, setLikes] = useState(post?.likes);

	const userId = user?.result?.googleId || user?.result?._id;
	const hasLikedPost = post.likes.find((like) => like === userId);

	const Likes = () => {
		if (likes.length > 0) {
			return likes.find((like) => userId) ? (
				<>
					<ThumbUpAltIcon fontSize="small" />
					&nbsp;
					{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}
				</>
			) : (
				<>
					<ThumbUpAltOutlinedIcon fontSize="small" />
					&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
				</>
			);
		}

		return (
			<>
				<ThumbUpAltOutlinedIcon fontSize="small" />
				&nbsp;Like
			</>
		);
	};

	const openPost = () => {
		navigate(`/posts/${post?._id}`);
	};

	const handleClick = async () => {
		dispatch(likePost(post._id));

		if (hasLikedPost) {
			setLikes(post.likes.filter((id) => id !== userId));
		} else {
			setLikes([...post.likes, userId]);
		}
	};

	return (
		<Card className={classes.card} raised elevation={6}>
			<ButtonBase component="div" className={classes.mainCardAction} onClick={openPost}>
				<CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
				<div className={classes.overlay}>
					<Typography variant="h6">{post.name}</Typography>
					<Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
				</div>
				{(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
					<div className={classes.overlay2}>
						<Button
							style={{ color: 'white' }}
							size="small"
							onClick={() => {
								setCurrentId(post._id);
							}}
						>
							<MoreHorzIcon fontSize="default" />
						</Button>
					</div>
				)}

				<div className={classes.details}>
					<Typography variant="body2" color="textSecondary">
						{post.tags.map((tag) => `#${tag} `)}
					</Typography>
				</div>
				<CardContent>
					<Typography className={classes.title} variant="h6" gutterBottom>
						{post.title}
					</Typography>
					<Typography
						className={classes.title}
						color="textSecondary"
						variant="body2"
						component="p"
						sx={{
							height: '40px',
							overflow: 'hidden',
							display: '-webkit-box',
							'-webkit-line-clamp': '2',
							'-webkit-box-orient': 'vertical',
						}}
					>
						{post.message}
					</Typography>
				</CardContent>
			</ButtonBase>
			<CardActions className={classes.cardActions}>
				<Button size="small" color="primary" disabled={!user?.result} onClick={handleClick}>
					<Likes />
				</Button>
				{(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
					<Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))}>
						<Delete fontSize="small" />
						Delete
					</Button>
				)}
			</CardActions>
		</Card>
	);
};

export default Post;
