import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { API_URL } from '@env';
import { apiRequest } from '../utils/api';
import styles from '../constants/ReservationScreenStyles';
import { Pressable, ActivityIndicator } from 'react-native';
import { Modal } from 'react-native';
import { getToday } from '../utils/utils';
import { useReservationState } from '../hooks/useReservationState';
import UserContext from '../context/UserContext';

export default function ReservationScreen({ navigation, dispatch }) {

  const [isLoading, setIsLoading] = useState(false);
  const {
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
    handleReservation,
  } = useReservationState(dispatch);

  const { user, setUser } = useContext(UserContext);

  const getUserdata = async () => {
    try {
      const response = await apiRequest('/validateToken', {}, dispatch);
      if (!response.ok) {
        console.log(response.status);
        dispatch({ type: 'SIGN_OUT'});
      } else {
        const result = await response.json();
        setUser(result);
      }
    } catch (e) {
      console.log(e);
      console.log('유저 정보를 불러오지 못했습니다.');
    }
  }

  useEffect(() => {
    // 예약 가능한 연습실 정보 불러오기
    fetchRooms();
    getUserdata();
  }, []);
  useEffect(()=> {
    if (reservationInfo.length > 0) {
      checkReservedTimeslotKey();
    }
  }, [reservationInfo])

  useEffect(() => {
    initializeTimeslots();
  }, [reservedTimeslotKey])

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalView}>
          <Text style={styles.modalRoomNumberText}>{
            availableRooms.map((room) => room.id === selectedRoom ? room.number : null)
          }</Text>
          <View style={styles.modalTimeslotContainer}>
            {timeslots}
          </View>
          <View style={styles.modalButtonContainer}>{ !isLoading ? (
            <>
              <Pressable
              style={styles.modalButton}
              onPress={async() => {
                setIsLoading(true);
                await handleReservation(user.user_id, selectedRoom);
                setIsLoading(false);
              }}>
              <Text>예약</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(!modalVisible);
                setSelectedRoom(null);
                setReservedTimeslotKey([]);
                setSelectedTimeslotKey([]);
              }}>
              <Text>닫기</Text>
            </Pressable>
          </>
          ) : (
            <>
              <View style={styles.centered}>
                <ActivityIndicator size="large" />
              </View>
            </>
          )}
          </View>
        </View>
      </Modal>
      <View style={styles.leftContainer}>{
          availableRooms.map((room) => room.id > 8 ? (
            <Pressable
              key={room.id}
              style={styles.room}
              onPress={() => loadReservationInfo(room.id)}>
              <Text style={styles.roomName}>{room.number}</Text>
            </Pressable>
          ) : null)}
      </View>
      <View style={styles.rightContainer}>{
        availableRooms.map((room) => room.id <= 8 ? (
          <Pressable
              key={room.id}
              style={styles.room}
              onPress={() => loadReservationInfo(room.id)}>
              <Text style={styles.roomName}>{room.number}</Text>
          </Pressable>
        ) : null)}
      </View>
    </View>
  );
}
