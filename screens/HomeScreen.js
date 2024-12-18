import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';

import styles from '../constants/styles';

export default function HomeScreen({navigation}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ReservationScreen')}
        style={{ ...styles.button, width: '50%' }}>
        <Text>예약하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => console.log('내 예약 내역')}
        style={{ ...styles.button, width: '50%', marginVertical: 30 }}>
        <Text>내 예약내역</Text>
      </TouchableOpacity>
    </View>
  );
}
