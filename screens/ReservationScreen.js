import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { API_URL } from '@env';
import { apiRequest } from '../utils/api';
import styles from '../constants/ReservationScreenStyles';
import { Pressable, ActivityIndicator } from 'react-native';
import { Modal } from 'react-native';
import { getReservationDay } from '../utils/utils';
import { useReservationState } from '../hooks/useReservationState';
import { useAuth } from '../context/AuthContext';
import UserContext from '../context/UserContext';
import ReservationContext from '../context/ReservationContext';
import { SMU_COLORS } from '../constants/colors';

export default function ReservationScreen({ navigation }) {

  const [isLoading, setIsLoading] = useState(false);
  const {
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
  } = useReservationState(dispatch);

  const { state, dispatch } = useAuth();
  const { user, setUser } = useContext(UserContext);
  const { availableRooms, setAvailableRooms } = useContext(ReservationContext);

  const getUserdata = async () => {
    try {
      const response = await apiRequest('/validateToken', {});
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
      console.log('here:');
    }
  }, [reservationInfo])

  useEffect(() => {
    initializeTimeslots();
  }, [reservedTimeslotKey])

  useEffect(() => {
    initializeTimeslots();
  }, [passedTimeslotKey])

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalView}>
          <View style={styles.modalRoomNumberContainer}>
            <Text style={styles.modalRoomNumberText}>{
              availableRooms.map((room) => room.id === selectedRoom ? room.number : null)
            }</Text>
          </View>
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
                setReservationInfoGroup([]);
              }}>
              <Text>닫기</Text>
            </Pressable>
            <Pressable
              style={{...styles.modalButton, marginLeft: 40 }}
              onPress={() => {
                setReservedTimeslotKey([]);
                setSelectedTimeslotKey([]);
                setReservationInfoGroup([]);
                loadReservationInfo(selectedRoom);
              }}>
              <MaterialIcons name="refresh" size={24} color="black" />
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
