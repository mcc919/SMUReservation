import React, { useContext, useLayoutEffect, useState } from 'react';
import { Alert, View, Text, TextInput } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import styles from '../constants/BoardCreateScreenStyles';
import { apiRequest } from '../utils/api';
import UserContext from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';

export default function BoardCreateScreen({ navigation }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const {user, setUser} = useContext(UserContext);

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
      }
    } catch (e) {
        console.error("Error fetching rooms:", e);
    }
  }

  const handleComplete = async () => {
    if (!value) {
      Alert.alert('⚠️', '건의하실 연습실을 선택해주세요.');
      return;
    }
    if (!title.trim() || !content.trim()) {
      Alert.alert('⚠️', '제목과 내용을 모두 입력해주세요.');
      return;
    }
    console.log('value: ', value);
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
          roomId: value,
          title: title,
          content: content
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
      setValue(null);
      setItems([]);
      navigation.goBack();
    }
  };

  useLayoutEffect(() => {
    navigation.setParams({ onComplete: handleComplete });
  }, [navigation, title, content]);

  useFocusEffect(
    React.useCallback(() => {
      loadRoomInfo();
    }, [])
  )

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="연습실을 선택하세요."
      />
      <TextInput
        style={styles.titleInput}
        onChangeText={setTitle}
        value={title}
        placeholder='제목을 입력하세요.'
      />
      <TextInput
        style={styles.contentInput}
        onChangeText={setContent}
        value={content}
        placeholder='내용을 입력하세요.'
        multiline
      />
    </View>
  );
}
