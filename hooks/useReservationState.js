import { View, Pressable, Text, Alert } from 'react-native';
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
    const [selectedTimeslotKey, setSelectedTimeslotKey] = useState([]);   // modal창에서 사용자가 선택한 timeslot

    // 방 목록을 불러온다. (예약가능, 수리중, 폐쇄된 방 모두 포함)
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
    
    // 유저가 선택한 방에 대한 예약 정보를 불러온다.
    const loadReservationInfo = async (roomId) => {
        console.log(`Reserved room ID: ${roomId}`);
        setModalVisible(true);
        setSelectedRoom(roomId);
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

    // 유저가 모달창에서 예약할 시간대를 선택하면 반영한다.
    const selectTimeslot = (key) => {
      if (selectedTimeslotKey.length === 0) {
        setSelectedTimeslotKey([key]);
      }
      // 항상 정렬되어 있다고 가정
      const firstKey = selectedTimeslotKey[0];
      const lastKey = selectedTimeslotKey[selectedTimeslotKey.length - 1];

      // 첫번째 키를 선택하면 모두 선택 해제
      if (key === firstKey) {
        setSelectedTimeslotKey([]);
        return;
      }

      // 마지막 키를 선택하면 해당 키를 선택 해제
      if (key === lastKey) {
        setSelectedTimeslotKey(selectedTimeslotKey.filter((item) => item !== key));
        return;
      }
      
      // 첫번째 키보다 작은 키를 선택하면 새로 선택
      if (key < firstKey) {
        setSelectedTimeslotKey([key]);
        return;
      }
      
      // (3시간 내에서 선택시) 연속 선택
      if (key <= firstKey + 11) {
        let tmp = [];
        for (let i=firstKey; i <= key; i++)
          tmp.push(i);

        if (tmp.some((item) => reservedTimeslotKey.includes(item)))
          setSelectedTimeslotKey([]);
        else setSelectedTimeslotKey(tmp);
        
        return;
      }

      // 그 외의 경우
      console.log('그외의 경우 발생');    // for debug
      setSelectedTimeslotKey([key]);
    };
      // if (reservedTimeslotKey.includes(key))
      //   return;

      // setSelectedTimeslotKey((prev) => {
      //   let updated;

      //   if (prev.includes(key)) {
      //       updated = prev.filter((item) => item !== key); // 선택 해제
      //   } else {
      //     if (prev.length === 0 || (Math.min(...prev) - 1 <= key && key <= Math.max(...prev) + 1)) {
      //       updated = [...prev, key];
      //     } else {
      //       updated = [key];
      //     }
      //   }
        
      //   return updated.sort((a, b) => a - b);
      // });
  
    // 불러온 예약 정보를 반영하여 timeslot들을 초기화한다. (예약됨: 회색, 비어있음: 파랑) (추후에 레슨용으로 occupied된 경우도 표시해야함)
    const initializeTimeslots = () => {
        const tmp = [];
        const startTime = 8;
        const endTime = 22;
        const timeDivision = 4;
        const timeslotLength = (endTime - startTime) * timeDivision;
        for (let i = 0; i < timeslotLength; i = i + timeDivision) {   // timeslot rows
          tmp.push(
          <View style={styles.timeslotRow} key={`row-${i/timeDivision}`}>
            {[0, 1, 2, 3].map((offset) => {
              const key = i + offset;
              const style = reservedTimeslotKey.includes(key)
                          ? styles.timeslotOccupied
                          : selectedTimeslotKey.includes(key)
                          ? styles.timeslotSelected
                          : styles.timeslot;

              return (
                <Pressable
                  key={`timeslot-${key}`}
                  style={style}
                  onPress={() => selectTimeslot(key)}
                >
                  <Text>{(i/timeDivision)+ startTime}시 {(60 / timeDivision)*(key % timeDivision)}분</Text>
                </Pressable>
              )
            })}
          </View>)
        }
        console.log('Initialized timeslots');
        setTimeslots(tmp);
    }

    // 불러온 예약 정보를 바탕으로 예약된 시간대 목록을 리스트로 저장한다. 추후에 initializeTimeslot 함수에 활용됨.
    // (예약 정보를 불러오는 loadReservation 함수가 실행된 후에야 실행되어야 함.)
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

    const handleReservation = async (userId) => {
      console.log('handleReservation 호출됨\nselectedTimeslotKey: ', selectedTimeslotKey);
      if (selectedTimeslotKey.length === 0) {
        console.log('예약할 시간대를 선택해주세요.');
        Alert.alert('예약 실패', '예약할 시간대를 선택해주세요.', [
          {
            text: '확인',
            //onPress: () => (),
          },
        ]);
        return;
      } else if (selectedTimeslotKey.length > 4 * 3) {
        console.log('한 번에 3시간을 초과하는 시간을 예약할 수 없습니다.');
        return;
      } else {
        const today = getToday();
        
        const startHour = String(Math.floor(selectedTimeslotKey[0] / 4) + 8).padStart(2, '0');
        const startMinute = String((selectedTimeslotKey[0] % 4) * 15).padStart(2, '0');
        let endHour = Math.floor(selectedTimeslotKey[selectedTimeslotKey.length - 1] / 4) + 8;
        let endMinute = (selectedTimeslotKey[selectedTimeslotKey.length - 1] % 4 + 1) * 15;
      
        if (endMinute >= 60) {
          endHour = endHour + 1;
          endMinute = endMinute % 60;
        }
        endHour = String(endHour).padStart(2, '0');
        endMinute = String(endMinute).padStart(2, '0');

        const startTime = `${today}T${startHour}:${startMinute}:00`;
        const endTime = `${today}T${endHour}:${endMinute}:00`;
        console.log('ddfdfdf', availableRooms.find((room) => room.id === selectedRoom));
        const roomNumber = availableRooms.find((room) => room.id === selectedRoom)?.number || null;
        try {
          const response = await apiRequest('reservations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userId,
              roomId: selectedRoom,
              startTime: startTime,
              endTime: endTime
            })
          }, dispatch);

          console.log(response);
          Alert.alert('예약되었습니다!', `${today}\n${startHour}:${startMinute}:00 ~ ${endHour}:${endMinute}:00\n연습실: ${roomNumber}`, [
            {
              text: '확인',
              onPress: () => setModalVisible(false),
            },
          ]);

        } catch (e) {
          console.log(e);
        }
      }
    }

    // 유저가 timeslot을 선택할 때마다 렌더링해야 한다.
    useEffect(() => {
      console.log("selectedTimeslots:", selectedTimeslotKey);
      initializeTimeslots();
    }, [selectedTimeslotKey]);

    
      return {
        availableRooms,
        modalVisible,
        selectedRoom,
        timeslots,
        reservationInfo,
        reservedTimeslotKey,
        selectedTimeslotKey,
        setSelectedTimeslotKey,
        setModalVisible,
        setSelectedRoom,
        setReservedTimeslotKey,
        fetchRooms,
        loadReservationInfo,
        checkReservedTimeslotKey,
        initializeTimeslots,
        handleReservation
    };
}