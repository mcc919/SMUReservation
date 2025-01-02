import React, { createContext, useState, useContext } from 'react';

// Context 생성
const UserContext = createContext({
    user: null,
    setUser: () => {},
});

// Context Provider 컴포넌트
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
