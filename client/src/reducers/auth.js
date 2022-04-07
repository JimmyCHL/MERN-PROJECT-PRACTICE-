import { AUTH, LOGOUT, RELOAD } from '../constants/actionType';

const authReducer = (state = { authData: null }, action) => {
	switch (action.type) {
		case AUTH:
			localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
			return { ...state, authData: action?.data };
		case LOGOUT:
			localStorage.removeItem('profile');
			return { ...state, authData: null };
		case RELOAD:
			return { ...state, authData: action?.data };
		default:
			return state;
	}
};

export default authReducer;
