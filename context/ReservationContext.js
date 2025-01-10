import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';

const ReservationContext = createContext({
    availableRooms: [],
    setAvailableRooms: () => {},
    openHour: 22,
    setOpenHour: () => {},
});

export const ReservationProvider = ({ children, dispatch }) => {
    const [availableRooms, setAvailableRooms] = useState([]);
    const [openHour, setOpenHour] = useState(22);
    
    useEffect(() => {
        const fetchReservationSettings = async () => {
            const response = await apiRequest('reservation_settings', {}, dispatch);
            if (response.ok) {
                const data = await response.json();
                setOpenHour(data.reservation_open_hour);
            } else console.log(response);
        };
        fetchReservationSettings();
    }, [dispatch]);

    useEffect(() => {
        console.log('예약 가능 시간: ', openHour);
    }, [openHour])
    return (
        <ReservationContext.Provider
            value={{
                availableRooms,
                setAvailableRooms,
                openHour,
                setOpenHour,
            }}
        >
            {children}
        </ReservationContext.Provider>
    );
};

export default ReservationContext