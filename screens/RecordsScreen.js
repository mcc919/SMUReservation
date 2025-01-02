import { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { apiRequest } from "../utils/api";
import UserContext from "../context/UserContext";
import styles from "../constants/recordScreenStyles";

const Item = ({item, onPress}) => (
    <Pressable
        style={styles.recordContainer}
        onPress={onPress}>
        <Text>room: {item.room_id}</Text>
        <Text>예약 시작 시간: {item.start_time}</Text>
        <Text>에약 종료 시간: {item.end_time}</Text>
        <Text>예약하신 날짜 {item.created_at}</Text>
    </Pressable>
);

export default function RecordsScreen() {
    const [records, setRecords] = useState([]);

    const { user, setUser } = useContext(UserContext);
    console.log('userdata: ', user);

    const getRecords = async () => {
        const response = await apiRequest(`/reservations/user/${user.user_id}`);
        setRecords(response);
    }

    const renderItem = ({item}) => {
        return (
            <Item
                item={item}
                onPress={() => console.log(1)}
            />
        )
    }

    useEffect(() => {
        if (user && user.user_id) { // user가 있고 user_id가 있을 때만 요청
            getRecords();
        }
    }, [user]);

    useEffect(() => {
        console.log("Fetched records:", records); // 데이터 확인
    }, [records]);

    return (
        <View style={styles.container}>{
            <FlatList
                data={records}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        }</View>
    );
}