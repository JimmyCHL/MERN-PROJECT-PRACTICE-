import { FETCH_ALL, CREATE, FETCH_POST, UPDATE, DELETE, LIKE, FETCH_BY_SEARCH, START_LOADING, END_LOADING, COMMENT } from '../constants/actionType';

const reducer = (state = { isLoading: true, posts: [], post: {} }, action) => {
	switch (action.type) {
		case START_LOADING:
			return { ...state, isLoading: true };
		case END_LOADING:
			return { ...state, isLoading: false };
		case DELETE:
			return state.posts?.filter((post) => post._id !== action.payload);
		case FETCH_ALL:
			return {
				...state,
				posts: action.payload.data,
				currentPage: action.payload.currentPage,
				numberOfPages: action.payload.numberOfPages,
			};
		case FETCH_POST:
			return { ...state, post: action.payload };
		case FETCH_BY_SEARCH:
			return { ...state, posts: action.payload };
		case CREATE:
			return { ...state, posts: [action.payload, ...state.posts] };
		case UPDATE:
		case LIKE:
			return { ...state, posts: state.posts?.map((post) => (post._id === action.payload._id ? action.payload : post)) };
		case COMMENT:
			return {
				...state,
				posts: state.posts.map((post) => {
					if (post._id == action.payload._id) {
						return action.payload;
					}
					return post;
				}),
			};
		default:
			return state;
	}
};

export default reducer;
