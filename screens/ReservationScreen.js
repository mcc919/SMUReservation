import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { API_URL } from '@env';

export default function ReservationScreen() {
  const [availableRooms, setAvailableRooms] = useState([]);
  
  useEffect(() => {
    // 예약 가능한 연습실 정보 불러오기
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${API_URL}/rooms`);
        const data = await response.json();
        
        setAvailableRooms(data.rooms);
      } catch (e) {
        console.error("Error fetching rooms:", e);
      }
    };
    fetchRooms();
  }, []);

  const handleReserve = (roomId) => {
    console.log(`Reserved room ID: ${roomId}`);
    // 예약 API 호출 구현
  };

  return (
    <View style={styles.container}>
      <Text>Available Rooms:</Text>
      {availableRooms.map((room) => (
        <View key={room.id} style={styles.room}>
          <Text>{room.name}</Text>
          <Button title="Reserve" onPress={() => handleReserve(room.id)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  room: {
    marginBottom: 20,
  },
});
