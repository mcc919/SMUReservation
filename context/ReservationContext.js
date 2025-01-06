import React, { createContext, useContext, useState } from 'react';

const ReservationContext = createContext({
    availableRooms: [],
    setAvailableRooms: () => {},
});

export const ReservationProvider = ({ children }) => {
    const [availableRooms, setAvailableRooms] = useState([]);
    
    return (
        <ReservationContext.Provider value={{availableRooms, setAvailableRooms}}>
            {children}
        </ReservationContext.Provider>
    );
};

export default ReservationContext