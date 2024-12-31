import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { API_URL } from '@env';
import { apiRequest } from '../utils/api';
import styles from '../constants/ReservationScreenStyles';
import { Pressable } from 'react-native';
import { Modal } from 'react-native';
import { getToday } from '../utils/utils';
import { useReservationState } from '../hooks/useReservationState';

export default function ReservationScreen({ navigation, dispatch }) {

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

  useEffect(() => {
    // 예약 가능한 연습실 정보 불러오기
    fetchRooms();
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
          <View style={styles.modalButtonContainer}>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(!modalVisible)
                setSelectedRoom(null)
                setSelectedTimeslotKey([]);
                handleReservation(selectedRoom, '202010832');
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
