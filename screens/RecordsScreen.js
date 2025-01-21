import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Alert, ActivityIndicator } from "react-native";
import { apiRequest } from "../utils/api";
import { getDate, getTime, getDateTime } from "../utils/utils";
import UserContext from "../context/UserContext";
import styles from "../constants/RecordScreenStyles";
import ReservationContext, { useReservationContext } from "../context/ReservationContext";
import { useFocusEffect } from "@react-navigation/native";

export default function RecordsScreen() {
    const [records, setRecords] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const { user, setUser } = useContext(UserContext);
    console.log('userdata: ', user);

    const { availableRooms, setAvailableRooms } = useContext(ReservationContext);

    useEffect(() => {
        console.log('Available Rooms:', availableRooms); // 데이터 확인
    }, [availableRooms]);
    
    const getRefreshRecords = async() => {
        setRefreshing(true);
        await getRecords();
        //await setTimeout()
        setRefreshing(false);
    }

    const onRefresh = () => {
        if (!refreshing) {
            getRefreshRecords();
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
            case 'cancelled':
                return "#B0B0B0";   // grey
            //case 'reserved':
            //    return "#4CAF50";   // green
            default:
                return '#fff';
        }
    }

    const Item = ({ item, onPress, onCancelPress }) => (
        <Pressable
            style={{...styles.recordContainer, backgroundColor: getStatusColor(item.status)}}
            onPress={onPress}>
            <View style={styles.recordTextContainer}>
                <Text style={styles.roomNumberText}>{availableRooms.map((room) => room.id === item.room_id ? room.number : null)}</Text>
                <Text style={styles.dateText}>예약 일자: {getDate(item.start_time, 'ko')}</Text>
                <Text style={styles.timeText}>예약 시간: {`${getTime(item.start_time)}-${getTime(item.end_time)}`}</Text>
                <Text style={styles.createdAtText}>신청일시: {getDateTime(item.created_at)}</Text>
            </View>
            <Pressable
                style={[
                    item.status === 'reserved' 
                    ? styles.cancelButton 
                    : item.status === 'completed' 
                    ? styles.completedCancelButton 
                    : styles.cancelledCancelButton,
                  ]}
                onPress={() => onCancelPress(item.id)}
                disabled={item.status !== 'reserved'}>
                <Text style={
                    item.status === 'completed' 
                    ? styles.completedCancelButtonText 
                    : styles.cancelButtonText
                }>{item.status === 'reserved' 
                    ? '예약 취소' 
                    : item.status === 'cancelled' 
                    ? '취소됨' 
                    : '완료'}</Text>
            </Pressable>
        </Pressable>
    );

    const getRecords = async () => {
        // dataExample = {
        // "id": 4,                                 // 예약 고유 id
        // "user_id": "202099999"                   // 예약자 학번
        // "start_time": "2025-01-03-21-00-00",     // 예약 시작 시간
        // "end_time": "2025-01-03-22-00-00",       // 예약 끝 시간
        // "room_id": 1,                            // 예약한 방 (고유 id)
        // "status": "reserved",                    // reserved, cancelled, in_progress, completed
        // "created_at": "2025-01-03-16-06-11"}     // 예약 신청한 날짜
        const response = await apiRequest(`/reservations/user/${user.user_id}`);
        if (!response.ok) {
            console.log(response);
        } else {
            const result = await response.json()
            setRecords(result);
        }
    }

    const cancelReservation = async (reservationId) => {
        Alert.alert(
            '예약 취소',
            '정말 예약을 취소하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel',
                },
                {
                    text: '확인',
                    style: 'destructive',
                    onPress: async () => {
                        const response = await apiRequest(`reservations/${reservationId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: `reservation_id=${reservationId}`,
                        });
                        const result = await response.json()
                        if (response.ok) {
                            Alert.alert('취소 완료', result.message, [
                                {
                                    text: '확인',
                                    onPress: getRecords,  // 예약 목록 다시 불러오기
                                },
                            ]);
                        } else {
                            console.error('예약 취소 실패');
                            Alert.alert('취소 실패', result.message, [
                                {
                                    text: '확인',
                                    onPress: getRecords,  // 예약 목록 다시 불러오기
                                },
                            ]);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    }

    const renderItem = ({item}) => {
        return (
            <Item
                item={item}
                //onPress={() => console.log('item pressed')}
                onCancelPress={cancelReservation}
            />
        )
    }

    // useEffect(() => {
    //     if (user && user.user_id) { // user가 있고 user_id가 있을 때만 요청
    //         getRecords();
    //     }
    // }, [user]);

    useEffect(() => {   // debug
        console.log("Fetched records:", records); // 데이터 확인
    }, [records]);

    useFocusEffect(
        React.useCallback(() => {
            if (user && user.user_id) { // user가 있고 user_id가 있을 때만 요청
                getRecords();
            }
        }, [])
    )

    return (
        <View style={styles.container}>{
            <FlatList
                data={records}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                //onRefresh={onRefresh}
                //refreshing={refreshing}
            />
        }</View>
    );
}