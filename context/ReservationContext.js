import React, { createContext, useContext, useEffect, useState } from 'react';
//import { apiRequest } from '../utils/api';
import { API_URL } from '@env'
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

const ReservationContext = createContext({
    availableRooms: [],
    setAvailableRooms: () => {},
    settings: {
        // 서버로부터 받지 못했을 경우를 대비한 방어 코드
        "RESERVATION_OPEN_HOUR" : 22,
        "RESERVATION_LIMIT_PER_DAY" : 6,
        "RESERVATION_LIMIT_PER_ROOM" : 3,
        "BOARD_MAX_TITLE_LENGTH" : 30,
        "BOARD_MAX_CONTENT_LENGTH" : 300,
        "COMMENT_MAX_CONTENT_LENGTH": 300,
    },
    setSettings: () => {},
});

export const ReservationProvider = ({ children }) => {
    const [availableRooms, setAvailableRooms] = useState([]);
    const [settings, setSettings] = useState({});

    const { state, dispatch } = useAuth();
    
    useEffect(() => {
        const fetchReservationSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/settings`);
                console.log(response);
                if (response.ok) {
                    const result = await response.json();
                    setSettings(result);
                    console.log('setting 성공적으로 불러옴');
                } else {
                    return (
                        Alert.alert('오류', '설정 파일을 불러오는데 실패하였습니다.', [
                                {
                                    text: '확인',
                                    onPress: () => {},
                                }
                            ]
                        )               
                    )
                }
            }
            catch (e) {
                console.log(e);
                return (
                    Alert.alert('오류', '설정 파일을 불러오는데 실패하였습니다.', [
                            {
                                text: '확인',
                                onPress: () => {},
                            }
                        ]
                    )               
                )
            }
        };
        fetchReservationSettings();
        
    }, []);

    useEffect(() => {
        console.log('예약 가능 시간: ', settings);
    }, [settings])
    return (
        <ReservationContext.Provider
            value={{
                availableRooms,
                setAvailableRooms,
                settings: settings,
                setSettings: setSettings,
            }}
        >
            {children}
        </ReservationContext.Provider>
    );
};

export default ReservationContext