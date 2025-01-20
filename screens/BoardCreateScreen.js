import React, { useContext, useLayoutEffect, useState } from 'react';
import { Alert, View, Text, TextInput } from 'react-native';

import styles from '../constants/BoardCreateScreenStyles';
import { apiRequest } from '../utils/api';
import UserContext from '../context/UserContext';

export default function BoardCreateScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const {user, setUser} = useContext(UserContext);

  const handleComplete = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('⚠️', '제목과 내용을 모두 입력해주세요.');
      return;
    }

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
          roomId: "1"
        })
      })
      const result = await response.json();
      if (!response.ok) {
        Alert.alert('확인', result.message);
      } else {
        Alert.alert('✅', result.message);
        console.log(result);
      }
    } catch {
      Alert.alert('확인', '알 수 없는 오류로 업로드에 실패하였습니다.');
    } finally {
      navigation.goBack();
    }
  };

  useLayoutEffect(() => {
    navigation.setParams({ onComplete: handleComplete });
  }, [navigation, title, content]);

  return (
    <View style={styles.container}>
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
