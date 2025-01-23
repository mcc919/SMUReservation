import React, { useEffect, useContext, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, Alert, ActivityIndicator, Pressable } from 'react-native';
import UserContext from '../context/UserContext';

import { apiRequest } from '../utils/api';
import { getDateTime } from '../utils/utils';

import styles from '../constants/BoardDetailStyles';

export default function BoardDetailScreen({ route }) {
  
  const { user, setUser } = useContext(UserContext);
  const { id: boardId } = route.params;

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [board, setBoard] = useState(null);
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
  
  const loadBoard = async () => {
    setIsLoading(true);
    console.log('전달받은 id값', boardId);
    try {
      const response = await apiRequest(`/board/${boardId}`);
      const result = await response.json();
      if (!response.ok) {
        return (
          Alert.alert('게시물 불러오기 실패', result.message, [{
            text: '확인',
            onPress: () => console.log('onpressed')
          }])
        )
      } else {
        console.log(result);
        setBoard(result);
        return;
      }
    } catch (e) {
      console.log('error', e);
    } finally {
      setIsLoading(false);
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
    if (board) {
      console.log('board 변경 감지', board);
      loadBoardComments(boardId);
    }
  }, [board]);

  useFocusEffect(
      React.useCallback(() => {
        console.log('페이지 집중 감지');
        loadBoard();
        loadRoomInfo();
      }, [])
    )

  useEffect(() => {
    initializeBoardComments();
  }, [boardCommentsData])

  return (
    !isLoading ? (
    <ScrollView style={styles.container}>{
      board ? (
        <>
          <Pressable style={styles.boardContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.writer}>{board.user_id} {board.user.username_kor}</Text>
              <Text style={styles.createdAt}>{getDateTime(board.created_at)}</Text>
              {
                getDateTime(board.created_at) !== getDateTime(board.edited_at) ?
                <Text style={styles.editedAt}>(수정됨) {getDateTime(board.edited_at)}</Text>
                : <></>  
              }
            </View>
            <Text style={styles.roomNumber}>{rooms.find((room) => room.id === board["room_id"])?.number || null}</Text>
            <Text style={styles.title}>{board.title}</Text>
            <Text style={styles.content}>{board.content}</Text>
          </Pressable>
        </>
       ) : (
         <Text>페이지를 불러오는데 실패했습니다.</Text>
       )
    }
      <View style={styles.boardCommentsContainer}>
        {boardComments}
      </View>
    </ScrollView>
    ) : (
      <>
        <ActivityIndicator size='large'/>
      </>
    )
  );
}
