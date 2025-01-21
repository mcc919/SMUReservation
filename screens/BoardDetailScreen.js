import React, { useEffect, useContext, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import UserContext from '../context/UserContext';

import { apiRequest } from '../utils/api';
import { getDateTime } from '../utils/utils';

import styles from '../constants/BoardDetailStyles';

export default function BoardDetailScreen({route}) {
  const { item } = route.params;
  const { user, setUser } = useContext(UserContext);
  
  const [rooms, setRooms] = useState([]);
  const [boardCommentsData, setBoardCommentsData] = useState([]);   // 서버로부터 받아온 raw 데이터
  const [boardComments, setBoardComments] = useState([]);           // boardCommentsData로 만든 컴포넌트

  const loadRoomInfo = async () => {
  try {
    const response = await apiRequest('rooms', { 
      method: 'GET',
      'Content-Type': 'application/json',
    });
    
    if (!response.ok) {
      console.log('방 목록을 불러오는데 실패하였습니다.')
    } else {
      const result = await response.json();
      setRooms(result);
    }
  } catch (e) {
      console.error("Error fetching rooms:", e);
    }
  }

  const loadBoardComments = async (id) => {
    const response = await apiRequest(`/boardcomments/board/${id}`);
    const result = await response.json();

    if (!response.ok) {
      return (
        Alert.alert('실패', result.message, [{
          text: '확인',
          onPress: () => console.log('onpressed')
        }])
      )
    } else {
      console.log(result);
      setBoardCommentsData(result);
      return;
    }
  }

  const initializeBoardComments = async () => {
    const tmp = [];
    for (let i = 0; i < boardCommentsData.length(); i++) {
      tmp.push(
        <View style={styles.boardCommentContainer}>
          <Text>{boardCommentsData.id}</Text>
          <Text>{boardCommentsData.board_id}</Text>
          <Text>{boardCommentsData.admin_id}</Text>
          <Text>{boardCommentsData.room_id}</Text>
          <Text>{boardCommentsData.status}</Text>
          <Text>{boardCommentsData.comment}</Text>
          <Text>{boardCommentsData.created_at}</Text>
        </View>
      )
    }
    setBoardComments(tmp);
  }

  useEffect(() => {
    loadRoomInfo();
    loadBoardComments(item.id);
  }, [])

  useEffect(() => {
    initializeBoardComments();
  }, [boardCommentsData])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.boardContainer}>
        <Text>{item.title}</Text>
        <Text>연습실: {rooms.find((room) => room.id === item["room_id"])?.number || null}</Text>
        <Text>작성자: {item.user_id}</Text>
        <Text>작성된 날짜: {getDateTime(item.created_at)}</Text>
        <Text>수정된 날짜: {getDateTime(item.edited_at)}</Text>
        <Text>{item.content}</Text>
      </View>
      <View style={styles.boardCommentsContainer}>
        {boardComments}
      </View>
    </ScrollView>
  );
}
