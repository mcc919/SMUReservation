import React from 'react';
import { View, Text } from 'react-native';
import styles from '../constants/styles';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is Home Screen.</Text>
    </View>
  );
}
