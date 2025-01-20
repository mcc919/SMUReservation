import React from "react";
import { View, Text, Alert, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect, useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { apiRequest } from "../utils/api";
import styles from "../constants/BoardScreenStyles";
import { SMU_COLORS } from "../constants/smuColors";

export default function BoardScreen({ navigation }) {

    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useContext(UserContext);

    useFocusEffect(
            React.useCallback(() => {
                getBoards();
        }, [])
    )

    const getBoards = async () => {
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
            }
        } catch (e) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>


            <Pressable style={styles.writeButton} onPress={() => {
                navigation.navigate('BoardCreate');
            }}>
                <MaterialCommunityIcons name="pencil-circle" size={48} color={SMU_COLORS.SMBlue} />
            </Pressable>
        </View>
    );
}