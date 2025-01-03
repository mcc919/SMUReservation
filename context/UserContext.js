// userdata sample = {
// "created_at": "2024-12-30-12-42-21",
// "department": "휴먼지능정보공학전공",
// "email": "sample@gmail.com",
// "enrollment_status": "재학",
// "grade": 3,
// "nationality": "대한민국",
// "role": "user",                          // user, admin
// "status": "active",                      // active, inactive, banned
// "user_id": "202099999",
// "username_cha": "",
// "username_eng": "Hong Gildong",
// "username_kor": "홍길동"}

import React, { createContext, useState, useContext, useEffect } from 'react';

// Context 생성
const UserContext = createContext({
    user: {},
    setUser: () => {},
});

// Context Provider 컴포넌트
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
