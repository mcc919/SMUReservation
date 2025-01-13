import React, { createContext, useContext, useReducer } from 'react'
import authReducer, { initialState } from '../reducers/authReducer'

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}