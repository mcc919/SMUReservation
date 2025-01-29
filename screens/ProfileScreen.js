import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useEffect, useContext, useState } from "react";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

import UserContext from "../context/UserContext";

import { apiRequest } from "../utils/api";

import { styles } from "../constants/ProfileScreenStyles"

export default function ProfileScreen() {
    const {user, setUser} = useContext(UserContext);

    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const ProfileActions = {
        UNAPPROVED: [
            { value: "accept_request", label: "✅ 요청 수락" },
            { value: "delete_request", label: "🗑️ 삭제" }
        ],
        USER: [
            { value: "deactivate_account", label: "🚫 비활성화" },
            { value: "delete_request", label: "🗑️ 삭제" },
            { value: "promote_to_admin", label: "🔺 관리자로 승격" },
        ],
        ADMIN: [
            { value: "remove_admin_rights", label: "🔻 관리자 권한 박탈" }
        ],
        BAN_STATUS: {
            banned: { value: "unban_account", label: "🔓 정지 해제" },
            active: { value: "ban_account", label: "⛔ 페널티 부여" }
        }
    };

    const loadUserInfo = async () => {
        try {
            const response = await apiRequest(`/user/${user.user_id}`);
            const result = await response.json();
            if (!response.ok) {
              return (
                Alert.alert('유저 정보 불러오기 실패', result.message, [{
                  text: '확인',
                  onPress: () => console.log('onpressed')
                }])
              )
            } else {
              console.log(result);
              setUser(result);
              return;
            }
          } catch (e) {
            console.log('error', e);
          }
    }

    const loadProfiles = async () => {
        setIsLoading(true);
        try {
          const response = await apiRequest(`/user/all/${user.user_id}`);
          const result = await response.json();
          if (!response.ok) {
            return (
              Alert.alert('유저 목록 불러오기 실패', result.message, [{
                text: '확인',
                onPress: () => console.log('onpressed')
              }])
            )
          } else {
            console.log(result);
            setProfiles(result);
            return;
          }
        } catch (e) {
          console.log('error', e);
        } finally {
          setIsLoading(false);
        }
      }

    useFocusEffect(
        React.useCallback(() => {
            loadUserInfo();
        }, [])
    )

    useEffect(() => {
        if (user.role==='admin') {
            loadProfiles();
        }
    }, [user])

    const renderProfile = (profile) => (

        <View key={profile.user_id}>
            <Menu>
                <MenuTrigger>
                    <View style={styles.profile}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={profile.role === 'admin' ? styles.adminTag : styles.userTag}>{profile.role === 'admin' ? '관리자' : '학생'}</Text>
                            <Text style={styles.profileText}> {profile.username_kor}</Text>
                        </View>            
                        <Text style={styles.profileText}>{profile.department} {profile.grade}학년 {profile.enrollment_status}중</Text>
                        <Text style={styles.profileText}>{profile.email}</Text>
                    </View>
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={styles.menuOptionsStyle}>
                    <Text style={{ padding: 5, fontWeight: 'bold', fontSize: 16 }}>
                        {profile.username_kor} 계정을...
                    </Text>
                    <View style={{ height: 1, backgroundColor: '#ccc'}} />
                    {/* 승인 대기 상태일 경우 */}
                    {profile.status === "unapproved" &&
                        ProfileActions.UNAPPROVED.map(action => (
                            <MenuOption key={action.value} value={action.value} text={action.label} />
                        ))
                    }

                    {/* 정지 여부에 따른 옵션 추가 */}
                    {profile.status !== "unapproved" && 
                        <MenuOption 
                            key={profile.status} 
                            value={ProfileActions.BAN_STATUS[profile.status === "banned" ? "banned" : "active"].value} 
                            text={ProfileActions.BAN_STATUS[profile.status === "banned" ? "banned" : "active"].label} 
                        />
                    }

                    {/* 승인된 사용자일 경우 */}
                    {profile.status !== "unapproved" && profile.role === "user" &&
                        ProfileActions.USER.map(action => (
                            <MenuOption key={action.value} value={action.value} text={action.label} />
                        ))
                    }


                    {/* 관리자일 경우 */}
                    {profile.status !== "unapproved" && profile.role === "admin" &&
                        ProfileActions.ADMIN.map(action => (
                            <MenuOption key={action.value} value={action.value} text={action.label} />
                        ))
                    }
                </MenuOptions>
            </Menu>
        </View>
        
      );

    return (
        <ScrollView style={styles.container} bounces={false}>
            <View style={styles.myprofileContainer}>
                <Text style={styles.title}>내 정보</Text>
                <Text style={styles.text}>
                    {user.user_id} {user.username_kor}
                </Text>
                <Text style={styles.text}>
                    {user.department} {user.grade}학년 {user.enrollment_status}중
                </Text>
                <Text style={styles.text}>
                    권한: <Text style={styles.highlightText}>{user.role === 'user' ? '학생' : '관리자'}</Text>
                </Text>
                <Text style={styles.text}>{user.email}</Text>
                <View style={styles.todayReservedTimeContainer}>
                    <Text style={styles.text}>
                        오늘 예약된 시간: <Text style={styles.highlightText}>{user.today_reserved_time}분</Text>
                    </Text>
                    <Text style={styles.statusText}>
                        18시 이후의 예약은 포함하지 않습니다. 😊
                    </Text>
                </View>
            </View>
            {!isLoading && user.role === 'admin' ? (
                <View style={styles.profilesContainer}>
                    <Text style={styles.listTitle}>승인 대기 목록</Text>
                    <ScrollView style={styles.profiles} bounces={false}>
                        {profiles.filter(profile => profile.status === 'unapproved').map(renderProfile)}
                    </ScrollView>
                    <Text style={styles.listTitle}>가입 목록</Text>
                    <ScrollView style={styles.profiles} bounces={false}>
                        {profiles.filter(profile => profile.status !== 'unapproved').map(renderProfile)}
                    </ScrollView>
                </View>
            ) : isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : null}
            
        </ScrollView>

    );
}