import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import { useAuth } from './AuthContext';

const ReservationContext = createContext({
    availableRooms: [],
    setAvailableRooms: () => {},
    openHour: 22,
    setOpenHour: () => {},
});

export const ReservationProvider = ({ children }) => {
    const [availableRooms, setAvailableRooms] = useState([]);
    const [openHour, setOpenHour] = useState(22);

    const { state, dispatch } = useAuth();
    
    useEffect(() => {
        const fetchReservationSettings = async () => {
            const response = await apiRequest('reservation_settings', {});
            if (response.ok) {
                const data = await response.json();
                setOpenHour(data.reservation_open_hour);
            } else console.log(response);
        };
        fetchReservationSettings();
        console.log('setting 성공적으로 불러옴');
    }, []);

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