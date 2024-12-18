export const initialState = {
    isLoading: true,
    userToken: null,
  };
  
  export default function authReducer(state, action) {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return { ...state, userToken: action.token, isLoading: false };
      case 'SIGN_IN':
        return { ...state, userToken: action.token };
      case 'SIGN_OUT':
        return { ...state, isLoading: false, userToken: null };
      default:
        return state;
    }
  }
  