import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, View, Text, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import styles from '../constants/BoardCreateScreenStyles';
import { apiRequest } from '../utils/api';
import UserContext from '../context/UserContext';
import ReservationContext from '../context/ReservationContext';
import { useFocusEffect } from '@react-navigation/native';

export default function BoardCreateScreen({ navigation }) {
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [items, setItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const {user, setUser} = useContext(UserContext);
  const { settings: settings, setSettings: setSettings } = useContext(ReservationContext);

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

        let _items = [];
        await result.map((data) => {
          _items = [..._items, {
              key: data.id,
              value: data.id,
              label: data.number,
              name: data.name,
              status: data.status
            }
          ]
        });
        setItems(_items);
        console.log(_items);
      }
    } catch (e) {
        console.error("Error fetching rooms:", e);
    }
  }

  const handleComplete = async () => {
    if (!selectedRoom) {
      console.log('선택한 연습실: ', selectedRoom);
      Alert.alert('⚠️', '건의하실 연습실을 선택해주세요.');
      return;
    }
    if (!title.trim() || !content.trim()) {
      Alert.alert('⚠️', '제목과 내용을 모두 입력해주세요.');
      return;
    }
    if (title >= settings.BOARD_MAX_TITLE_LENGTH) {
      Alert.alert('⚠️', `제목의 길이가 ${settings.BOARD_MAX_TITLE_LENGTH}자를 초과하였습니다.`);
      return;
    }
    if (content >= settings.BOARD_MAX_CONTENT_LENGTH) {
      Alert.alert('⚠️', `본문의 길이가 ${settings.BOARD_MAX_CONTENT_LENGTH}자를 초과하였습니다.`);
      return;
    }
    setIsLoading(true);
    
    console.log('value: ', selectedRoom);
    // 저장 또는 전송 로직
    console.log(user);
    try {
      const response = await apiRequest('boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.user_id,
          roomId: selectedRoom,
          title: title.trim(),
          content: content.trim()
        })
      })
      const result = await response.json();
      if (!response.ok) {
        Alert.alert('확인', result.message);
      }
      console.log(result);
    } catch {
      Alert.alert('확인', '알 수 없는 오류로 업로드에 실패하였습니다.');
    } finally {
      setSelectedRoom(null);
      setItems([]);
      setIsLoading(false);
      navigation.goBack();
    }
  };

  useEffect(() => {
    console.log('selectedRoom updated: ', selectedRoom);
  }, [selectedRoom]);

  useLayoutEffect(() => {
    navigation.setParams({ onComplete: handleComplete });
  }, [navigation, title, content, selectedRoom]);

  useFocusEffect(
    React.useCallback(() => {
      loadRoomInfo();
    }, [])
  )

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setOpen(false)
    }}>
      <View style={styles.container}>
        {!isLoading ? (
          <>
        <DropDownPicker
          style={styles.roomNumberInput}
          open={open}
          value={selectedRoom}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedRoom}
          setItems={setItems}
          onOpen={() => Keyboard.dismiss()}
          onChangeValue={(value) => {
            setSelectedRoom(value)
            console.log('변경감지: onchangevalue가 있어야하나?');
          }}
          placeholder="연습실을 선택하세요."
        />
        

        <TextInput
          style={styles.titleInput}
          onChangeText={setTitle}
          value={title}
          maxLength={settings.BOARD_MAX_TITLE_LENGTH}
          placeholder='제목을 입력하세요.'
          onFocus={() => setOpen(false)}
        />
        <TextInput
          style={styles.contentInput}
          onChangeText={setContent}
          value={content}
          maxLength={settings.BOARD_MAX_CONTENT_LENGTH}
          placeholder='내용을 입력하세요.'
          multiline
          onFocus={() => setOpen(false)}
        />
        <View style={styles.lengthBox}>
          <Text>{`\n(${content.trim().length}/${settings.BOARD_MAX_CONTENT_LENGTH})`}</Text>
        </View>
        </>
        )
        : (
          <ActivityIndicator size='large'/>
        ) }
      </View>
      </TouchableWithoutFeedback>
  );
}
