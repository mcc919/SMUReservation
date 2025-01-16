import { View, Pressable, Text, Alert } from 'react-native';
import { useState, useEffect, useContext } from 'react'
import { getReservationDay, getDate, getTime, getKoreanTime } from '../utils/utils'
import { apiRequest } from "../utils/api";
import styles from '../constants/ReservationScreenStyles';

import { useAuth } from '../context/AuthContext';
import ReservationContext from '../context/ReservationContext';
//import { getRecords } from '../screens/RecordsScreen';

export function useReservationState() {
    //const [availableRooms, setAvailableRooms] = useState([]);   // 서버로부터 받아온 room 리스트 (사용불가한 방도 있음...)
    const [modalVisible, setModalVisible] = useState(false);    // 모달창 표시 여부
    const [selectedRoom, setSelectedRoom] = useState(null);     // 사용자가 예약하고자 하는 room의 id
    const [timeslots, setTimeslots] = useState([]);             // timeslot 컴포넌트들의 리스트
    const [reservationInfo, setReservationInfo] = useState([]); // 서버로부터 (selectedRoom && today)에 해당하는 예약 정보를 가져옴
    const [reservationInfoGroup, setReservationInfoGroup] = useState([]); // reservationInfo를 예약 별로 묶음 ex) [{keys: [1, 2, 3], info: {}}, {keys: [10, 11, 12, 13], info: {}} ...]
    const [reservedTimeslotKey, setReservedTimeslotKey] = useState([]); // reservationInfo에서 이미 예약된 timeslot의 key를 가져옴
    const [selectedTimeslotKey, setSelectedTimeslotKey] = useState([]);   // modal창에서 사용자가 선택한 timeslot
    const [passedTimeslotKey, setPassedTimeslotKey] = useState(null);     // 이미 지나간 시간은 예약 못함

    const { state, dispatch } = useAuth();
    const { availableRooms, setAvailableRooms } = useContext(ReservationContext);
    const { openHour, setOpenHour } = useContext(ReservationContext);

    // 방 목록을 불러온다. (예약가능, 수리중, 폐쇄된 방 모두 포함)
    const fetchRooms = async () => {
      try {
        const response = await apiRequest('rooms', { 
          method: 'GET',
          'Content-Type': 'application/json',
        });
        
        if (!response.ok) {
          console.log('방 목록을 불러오는데 실패하였습니다.')
        } else {
          const result = await response.json();
          setAvailableRooms(result);
        }
      } catch (e) {
          console.error("Error fetching rooms:", e);
      }
    }

    useEffect(() => {
      console.log('available rooms: ', availableRooms);
    }, [availableRooms])

    useEffect(() => {
      console.log('reservationInfoGroup: ', reservationInfoGroup);
    }, [reservationInfoGroup]);
    
    // 유저가 선택한 방에 대한 예약 정보를 불러온다.
    const loadReservationInfo = async (roomId) => {
        console.log(`Selected room ID: ${roomId}`);
        setModalVisible(true);
        setSelectedRoom(roomId);
        checkPassedTimeslotKey();
        try {
            const today = getReservationDay(openHour);
            const url = `/reservations/room/${roomId}/date/${today}`;
            const response = await apiRequest(url, {});

            const result = await response.json();
            if (!response.ok) {
              console.log(result.message);
            } else {
              setReservationInfo(result);
            }
        } catch (e) {
            console.log("Error fetching reservations", e);
            return null;
        }
    }

    // 예약자 정보를 불러온다.
    const checkReservationInfo = async (key) => {
      let reservationGroup = null;
      reservationInfoGroup.map((group) => {
        if (group.keys.includes(key)) {
          reservationGroup = group;
        }
      })
      if (reservationGroup) {
        console.log('t:', reservationGroup);
        try {
          const response = await apiRequest(`/user/${reservationGroup.info.user_id}`);
          const result = await response.json();
          if (!response.ok) {
            console.log(result.message);
          } else {
            const date = getDate(reservationGroup.info.start_time, 'ko');
            const startTime = getTime(reservationGroup.info.start_time);
            const endTime = getTime(reservationGroup.info.end_time);
            const str = `${result.username_kor}\n${date}\n${startTime}-${endTime}`;
            return (
              Alert.alert('예약자 정보', str, [{
                text: '확인',
                onPress: () => console.log('onpressed')
              }])
            )
          }
        } catch (e) {
          console.log(e);
        }
      }
      return (
        Alert.alert('오류', '예약자 정보를 불러오는데 실패했습니다.', [{
          text: '확인',
          onPress: () => console.log('ㅇㅋ')
        }])
      );
    }

    // 유저가 모달창에서 예약할 시간대를 선택하면 반영한다.
    const selectTimeslot = (key) => {
      if (reservedTimeslotKey.includes(key)) {
        if (selectedTimeslotKey.length === 0)
          // show whose reservation is
          checkReservationInfo(key);
        else
          setSelectedTimeslotKey([]);
        return;
      }

      if (passedTimeslotKey > key) {
        setSelectedTimeslotKey([]);
        return;
      }

      if (selectedTimeslotKey.length === 0) {
        setSelectedTimeslotKey([key]);
        return;
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

        const STARTTIME = 8;
        const ENDTIME = 22;
        const TIMEDIVISION = 4;
        const timeslotLength = (ENDTIME - STARTTIME) * TIMEDIVISION;
        for (let i = 0; i < timeslotLength; i = i + TIMEDIVISION) {   // timeslot rows
          tmp.push(
          <View style={styles.timeslotRow} key={`row-${i/TIMEDIVISION}`}>
            {[0, 1, 2, 3].map((offset) => {
              const key = i + offset;
              const style = reservedTimeslotKey.includes(key)
                          ? styles.timeslotOccupied
                          : passedTimeslotKey > key
                          ? styles.timeslotPassed
                          : selectedTimeslotKey.includes(key)
                          ? styles.timeslotSelected
                          : styles.timeslot;

              return (
                <Pressable
                  key={`timeslot-${key}`}
                  style={style}
                  onPress={() => selectTimeslot(key)}
                >
                  <Text>{(i/TIMEDIVISION)+ STARTTIME}시 {(60 / TIMEDIVISION)*(key % TIMEDIVISION)}분</Text>
                </Pressable>
              )
            })}
          </View>)
        }
        console.log('Initialized timeslots');
        setTimeslots(tmp);
    }

    const checkPassedTimeslotKey = () => {
      const today = getKoreanTime();
      console.log(today);
      let key = 0;
      console.log(openHour);
      if (today.hour() < openHour) {
        key = (today.hour() - 8) * 4;
        key = key + Math.floor(today.minute() / 15);
      }
      console.log('key: ', key);
      setPassedTimeslotKey(key);
    }

    // 불러온 예약 정보를 바탕으로 예약된 시간대 목록을 리스트로 저장한다. 추후에 initializeTimeslot 함수에 활용됨.
    // (예약 정보를 불러오는 loadReservation 함수가 실행된 후에야 실행되어야 함.)
    const checkReservedTimeslotKey = () => {
      const _reservationInfo = [];   // timeslot-{key}중 key를 보관할 리스트

      reservationInfo.map((info) => {
        const startTime = info.start_time.split('-').slice(-3, -1).map((value) => parseInt(value));   // X시 X분 -> [X, X]
        const endTime = info.end_time.split('-').slice(-3, -1).map((value) => parseInt(value));     // X시 X분 -> [X, X]
        console.log('start time: ', startTime, 'end time: ', endTime);
  
        const startTimeslot = (startTime[0] - 8) * 4 + startTime[1]/15;
        const endTimeslot = (endTime[0] - 8) * 4 + endTime[1]/15 - 1;
  
        let _group = [];
        for (let i = startTimeslot; i <= endTimeslot; i++) {
          _reservationInfo.push(i);
          _group.push(i);
        }
        console.log('tmp: ', _reservationInfo);
        console.log('_group', _group);

        setReservationInfoGroup([
          ...reservationInfoGroup, {
            keys: _group,
            info: info
          }
        ])
        console.log(reservationInfoGroup);
      })
  
      console.log('test: tmp.find(4)', !!_reservationInfo.find(num => num === 4));
  
      setReservedTimeslotKey(_reservationInfo);
      console.log('reservationinfogroup: ', reservationInfoGroup);
    }

    const handleReservation = async (userId, selectedRoom) => {
      console.log('handleReservation 호출됨\nselectedTimeslotKey: ', selectedTimeslotKey);
      if (selectedTimeslotKey.length === 0) {
        console.log('예약할 시간대를 선택해주세요.');
        Alert.alert('오류', '시간대를 선택해주세요. 🙄', [
          {
            text: '확인',
            //onPress: () => (),
          },
        ]);
        return;
      } else if (selectedTimeslotKey.length > 4 * 3) {
        console.log('18시 이전 예약의 경우 한 번에 3시간을 초과하여 예약할 수 없음.');
        return;
      } else {
        const today = getReservationDay(openHour);
        console.log('예약하고자 하는 날짜: ', today);
        
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
        //console.log('ddfdfdf', availableRooms.find((room) => room.id === selectedRoom));
        const roomNumber = availableRooms.find((room) => room.id === selectedRoom)?.number || null;
        try {
          if (!dispatch)
            console.log('dispatch is undefined');
          const response = await apiRequest('reservations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userId,
              roomId: selectedRoom,
              startTime: startTime,
              endTime: endTime,
              date: today
            })
          });

          console.log(response);
          const result = await response.json()
          if (!response.ok) {
            Alert.alert('예약 실패...🥺', result.message), [{
              text: '확인',
              onPress: () => {
                setModalVisible(false);
                setSelectedRoom(null);
                setSelectedTimeslotKey([]);
                setReservedTimeslotKey([]);
                setReservationInfoGroup([]);
              }
            }]
          } else {
            await loadReservationInfo(selectedRoom);
            Alert.alert('예약되었습니다! ☺️', `${today}\n${startHour}:${startMinute}:00 ~ ${endHour}:${endMinute}:00\n연습실: ${roomNumber}`, [
              {
                text: '확인',
                onPress: () => {
                  // setModalVisible(false);
                  // setSelectedRoom(null)
                  // setSelectedTimeslotKey([]);
                  // setReservedTimeslotKey([]);
                  // setReservationInfoGroup([]);
                }
              },
            ]);
          }
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
      modalVisible,
      selectedRoom,
      timeslots,
      reservationInfo,
      reservedTimeslotKey,
      selectedTimeslotKey,
      reservationInfoGroup,
      passedTimeslotKey,
      setPassedTimeslotKey,
      setSelectedTimeslotKey,
      setModalVisible,
      setSelectedRoom,
      setReservedTimeslotKey,
      fetchRooms,
      loadReservationInfo,
      checkReservedTimeslotKey,
      initializeTimeslots,
      handleReservation,
      setReservationInfoGroup 
    };
}