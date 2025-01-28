import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import BoardScreen from './BoardScreen';
import BoardCreateScreen from './BoardCreateScreen.js';
import BoardDetailScreen from './BoardDetailScreen';
import { ActivityIndicator, Alert, Button, Pressable, Text } from 'react-native';


const Stack = createNativeStackNavigator();

export default function BoardScreenStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BoardMain"
        component={BoardScreen}
        options={{ 
            title: '건의사항 게시판',
            //headerShown: false
        }}
      />
      <Stack.Screen
        name="BoardDetail"
        component={BoardDetailScreen}
        options={({navigation, route}) => ({
            title: '상세 페이지',
            headerBackTitle: '뒤로가기',
            headerRight: () => {
              if (route.params?.isCreateCommentMode) {
                return (
                  !route.params?.isLoadingPost ? (
                    <Button
                      title="완료"
                      onPress={() => {
                          if (route.params?.onComplete) {
                              route.params.onComplete();
                          } else {
                              Alert.alert('⚠️', '완료 버튼이 비활성화되었습니다.');
                          }
                        }
                      }
                    />) : (
                    <ActivityIndicator />
                  )
                )
              }
            }
            //headerShown: false
        })}
      />
      <Stack.Screen
        name="BoardCreate"
        component={BoardCreateScreen}
        options={({navigation, route}) => ({
            title: '글 쓰기',
            headerBackTitle: '취소',
            headerRight: () => (
                <Button
                    title="완료"
                    onPress={() => {
                        if (route.params?.onComplete) {
                            route.params.onComplete();
                        } else {
                            Alert.alert('⚠️', '완료 버튼이 비활성화되었습니다.');
                        }
                    }}
                />
            )
            //headerShown: false
        })}
      />
    </Stack.Navigator>
  );
}
