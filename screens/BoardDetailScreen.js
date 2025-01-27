import React, { useEffect, useContext, useState, useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, Alert, ActivityIndicator, Pressable, TextInput, Button, TouchableOpacity, Keyboard } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import UserContext from '../context/UserContext';
import ReservationContext from '../context/ReservationContext';

import { apiRequest } from '../utils/api';
import { getDateTime } from '../utils/utils';

import { suggestionStateList } from '../constants/SuggestionStateList'
import styles from '../constants/BoardDetailStyles';
import DropDownPicker from 'react-native-dropdown-picker';

export default function BoardDetailScreen({ navigation, route }) {
  
  const { user, setUser } = useContext(UserContext);
  const { id: boardId } = route.params;
  const { settings, setSettings } = useContext(ReservationContext);

  const [rooms, setRooms] = useState([]);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isCreateCommentMode, setIsCreateCommentMode] = useState(false);
  const [board, setBoard] = useState(null);
  const [boardCommentsData, setBoardCommentsData] = useState([]);   // 서버로부터 받아온 raw 데이터
  const [boardComments, setBoardComments] = useState([]);           // boardCommentsData로 만든 컴포넌트

  // 답변 관련 변수
  const [commentContent, setCommentContent] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [stateItems, setStateItems] = useState(suggestionStateList);
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
    setIsLoadingGet(true);
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
      setIsLoadingGet(false);
    }
  }

  const loadBoardComments = async () => {
    if (!boardId) {
      Alert.alert('확인', '답변을 불러올 수 없습니다.');
      return;
    }
    const response = await apiRequest(`/boardcomments/board/${boardId}`);
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
    for (let i = 0; i < boardCommentsData.length; i++) {
      tmp.push(
        <View style={styles.boardCommentContainer} key={i}>
          <Text>{boardCommentsData[i].admin_id}</Text>
          <Text>{boardCommentsData[i].room_id}</Text>
          <Text>{boardCommentsData[i].status}</Text>
          <Text>{boardCommentsData[i].comment}</Text>
          <Text>{boardCommentsData[i].created_at}</Text>
        </View>
      )
    }
    setBoardComments(tmp);
  }

  const handleComplete = async () => {
    console.log(selectedState);
    if (!selectedState) {
      console.log('선택한 연습실: ', selectedState);
      Alert.alert('⚠️', '변경하실 상태를 선택해주세요.');
      return;
    }
    if (!commentContent.trim()) {
      Alert.alert('⚠️', '내용을 입력해주세요.');
      return;
    }
    if (commentContent >= settings.COMMENT_MAX_CONTENT_LENGTH) {
      Alert.alert('⚠️', `본문의 길이가 ${settings.COMMENT_MAX_CONTENT_LENGTH}자를 초과하였습니다.`);
      return;
    }
    setIsLoadingPost(true);
    
    // 저장 또는 전송 로직
    console.log(user);
    try {
      const response = await apiRequest('boardcomment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.user_id,
          roomId: board["room_id"],
          boardId: boardId,
          state: selectedState,
          content: commentContent.trim()
        })
      })
      const result = await response.json();
      Alert.alert('확인', result.message);
    } catch (e) {
      Alert.alert('확인', `요청 전송 중 오류가 발생하였습니다.\n${e}`);
    } finally {
      setSelectedState(null);
      setIsLoadingPost(false);
      setCommentContent('');
      Keyboard.dismiss();
      loadBoardComments();
      //navigation.goBack();
    }
  };

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
        setSelectedState(null);
        setIsCreateCommentMode(false);
      }, [])
    )

  useLayoutEffect(() => {
    navigation.setParams({
      isCreateCommentMode: isCreateCommentMode,
      onComplete: handleComplete
    });
  }, [navigation, commentContent, selectedState, isCreateCommentMode]);
  
  useEffect(() => {
    initializeBoardComments();
  }, [boardCommentsData])

  return (
    !isLoadingGet ? (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80} // 적절한 값으로 조정
      >
        <ScrollView style={styles.container}>{
          board ? (
            <>
              <View style={styles.boardContainer}>
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
              </View>
            </>
          ) : (
            <Text>페이지를 불러오는데 실패했습니다.</Text>
          )
        }
          <View style={styles.boardCommentsContainer}>
            {boardComments}
          </View>
        </ScrollView>{
            isCreateCommentMode ? (
              <View style={styles.commentCreateContainer}>
                <DropDownPicker
                  style={styles.stateInput}
                  open={open}
                  value={selectedState}
                  items={stateItems}
                  setOpen={setOpen}
                  setValue={setSelectedState}
                  placeholder="상태 선택"
                  
                />
                <TextInput
                  style={styles.commentContentInput}
                  onChangeText={setCommentContent}
                  placeholder='내용을 입력하세요'
                  value={commentContent}
                  multiline
                />
              </View>
            ) : (
              <View style={styles.commentCreateButtonContainer}>
                <TouchableOpacity
                  style={styles.commentCreateButton}
                  onPress={() => setIsCreateCommentMode(true)}
                >
                  <Text style={styles.commentCreateButtonText}>답변하기</Text>
                </TouchableOpacity>
              </View>
            )
          }
      </KeyboardAvoidingView>
    ) : (
      <>
        <ActivityIndicator size='large'/>
      </>
    )
  );
}
