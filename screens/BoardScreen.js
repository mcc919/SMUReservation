import React from "react";
import { View, Text, Alert, Pressable, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect, useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { apiRequest } from "../utils/api";
import { getDateTime } from "../utils/utils";
import styles from "../constants/BoardScreenStyles";
import { SMU_COLORS } from "../constants/colors";

import { SuggestionState } from "../components/SuggestionState";


export default function BoardScreen({ navigation }) {

    const [boards, setBoards] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useContext(UserContext);

    useFocusEffect(
            React.useCallback(() => {
                loadBoards();
                loadRoomInfo();
        }, [])
    )

    const loadBoards = async () => {
        setLoading(true);
        try {
            const response = await apiRequest('/boards');
            result = await response.json();
            if (!response.ok) {
                return (
                    Alert.alert('오류', result.message, [{
                        text: '확인',
                        onPress: () => console.log('오류 확인')
                    }])
                );
            } else {
                console.log(result);
                setBoards(result);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

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
    const Item = ({ item }) => {
        const maxLength = 70;
        const text = item.content.length >= maxLength ? item.content.slice(0, maxLength) + '...': item.content;
        const updated_at = item.status_updated_at === item.created_at ? '읽지 않음' : getDateTime(item.status_updated_at);
        return (
            <Pressable
                style={styles.boardContainer}
                onPress={() => {
                    navigation.navigate('BoardDetail', {id: item.id} );
                }}>
                <View>
                    <Text style={styles.roomNumberText}>{rooms.find((room) => room.id === item["room_id"])?.number || null}</Text>
                    <Text style={styles.titleText}>{item.title}</Text>
                    <Text style={styles.contentText}>{text}</Text>
                    <Text style={{...styles.dateText, marginTop: 5}}>작성된 일시: {getDateTime(item.created_at)}</Text>
                    <SuggestionState status={item.status} />
                    <Text style={styles.dateText}>마지막 답변: {updated_at}</Text>
                </View>

            </Pressable>
        )}

    const renderItem = ({item}) => (
        <Item item={item}/>
    );
    
    return (
        <View style={styles.container}>
            <FlatList
                data={boards}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <Pressable style={styles.writeButton} onPress={() => {
                navigation.navigate('BoardCreate');
            }}>
                <MaterialCommunityIcons name="pencil-circle" size={48} color={SMU_COLORS.SMBlue} />
            </Pressable>
        </View>
    );
}