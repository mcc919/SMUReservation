import { View, Pressable, Text } from 'react-native';
import { useState, useEffect } from 'react'
import { getToday } from '../utils/utils'
import { apiRequest } from "../utils/api";
import styles from '../constants/ReservationScreenStyles';


export function useReservationState(dispatch) {
    const [availableRooms, setAvailableRooms] = useState([]);   // 서버로부터 받아온 room 리스트 (사용불가한 방도 있음...)
    const [modalVisible, setModalVisible] = useState(false);    // 모달창 표시 여부
    const [selectedRoom, setSelectedRoom] = useState(null);     // 사용자가 예약하고자 하는 room의 id
    const [timeslots, setTimeslots] = useState([]);             // timeslot 컴포넌트들의 리스트
    const [reservationInfo, setReservationInfo] = useState([]); // 서버로부터 (selectedRoom && today)에 해당하는 예약 정보를 가져옴
    const [reservedTimeslotKey, setReservedTimeslotKey] = useState([]); // reservationInfo에서 이미 예약된 timeslot의 key를 가져옴

    const fetchRooms = async () => {
        try {
            const response = await apiRequest('rooms', { 
              method: 'GET',
              'Content-Type': 'application/json',
            }, dispatch);
            
            setAvailableRooms(response);
        } catch (e) {
            console.error("Error fetching rooms:", e);
        }
    }
    
    const handleReserve = async (roomId) => {
        console.log(`Reserved room ID: ${roomId}`);
        setModalVisible(true);
        setSelectedRoom(roomId);
        // 예약 API 호출 구현
        try {
            const today = getToday();
            const url = `/reservations/room/${roomId}/date/${today}`;
            console.log(today);
            const result = await apiRequest(url, {}, dispatch);
            console.log(result);
            setReservationInfo(result);
        } catch (e) {
            console.log("Error fetching reservations", e);
            return null;
        }
    }

    const initializeTimeslots = () => {
        const tmp = [];
        const startTime = 8;
        const endTime = 22;
        const timeDivision = 4;
        const timeslotLength = (endTime - startTime) * timeDivision;
        for (let i = 0; i < timeslotLength; i = i + timeDivision) {   // timeslot rows
          tmp.push(
          <View style={styles.timeslotRow} key={`row-${i/timeDivision}`}>
            <Pressable key={`timeslot-${i}`} style={!!reservedTimeslotKey.includes(i) ? styles.timeslotOccupied : styles.timeslot} onPress={() => (1)}><Text>{(i/timeDivision)+startTime}시 {(60/timeDivision)* (i%timeDivision)}분</Text></Pressable>
            <Pressable key={`timeslot-${i+1}`} style={!!reservedTimeslotKey.includes(i+1) ? styles.timeslotOccupied : styles.timeslot} onPress={() => (1)}><Text>{(i/timeDivision)+startTime}시 {(60/timeDivision)* ((i+1)%timeDivision)}분</Text></Pressable>
            <Pressable key={`timeslot-${i+2}`} style={!!reservedTimeslotKey.includes(i+2) ? styles.timeslotOccupied : styles.timeslot} onPress={() => (1)}><Text>{(i/timeDivision)+startTime}시 {(60/timeDivision)* ((i+2)%timeDivision)}분</Text></Pressable>
            <Pressable key={`timeslot-${i+3}`} style={!!reservedTimeslotKey.includes(i+3) ? styles.timeslotOccupied : styles.timeslot} onPress={() => (1)}><Text>{(i/timeDivision)+startTime}시 {(60/timeDivision)* ((i+3)%timeDivision)}분</Text></Pressable>
          </View>)
        }
        console.log('Initialized timeslots');
        setTimeslots(tmp);
    }

    const checkReservedTimeslotKey = () => {
        const tmp = [];   // timeslot-{key}중 key를 보관할 리스트
    
        reservationInfo.map((info) => {
          const startTime = info.start_time.split('-').slice(-3, -1).map((value) => parseInt(value));   // X시 X분 -> [X, X]
          const endTime = info.end_time.split('-').slice(-3, -1).map((value) => parseInt(value));     // X시 X분 -> [X, X]
          console.log('start time: ', startTime, 'end time: ', endTime);
    
          const startTimeslot = (startTime[0] - 8) * 4 + startTime[1]/15;
          const endTimeslot = (endTime[0] - 8) * 4 + endTime[1]/15 - 1;
    
          for (let i = startTimeslot; i <= endTimeslot; i++)
            tmp.push(i);
          console.log('tmp: ', tmp);
        })
    
        console.log('test: tmp.find(4)', !!tmp.find(num => num === 4));
    
        setReservedTimeslotKey(tmp);
      }

      return {
        availableRooms,
        modalVisible,
        selectedRoom,
        timeslots,
        reservationInfo,
        reservedTimeslotKey,
        setModalVisible,
        setSelectedRoom,
        setReservedTimeslotKey,
        fetchRooms,
        handleReserve,
        checkReservedTimeslotKey,
        initializeTimeslots,
    };
}