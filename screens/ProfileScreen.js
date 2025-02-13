import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator,
        Modal, TouchableOpacity, TextInput, Button, Platform,
        TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from "react-native";
import { useEffect, useContext, useState } from "react";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

import UserContext from "../context/UserContext";
import ReservationContext from "../context/ReservationContext";

import { apiRequest } from "../utils/api";
import { getDateTime, getTodayDateTime, addDays2Tomorrow, getReservationDay } from "../utils/utils";

import { styles } from "../constants/ProfileScreenStyles"

export default function ProfileScreen() {
    const {user, setUser} = useContext(UserContext);
    const {settings, setSettings} = useContext(ReservationContext);

    const [today, setToday] = useState("");

    const [userLogs, setUserLogs] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isBanModalVisible, setBanModalVisible] = useState(false);
    const [banDays, setBanDays] = useState("");
    const [unbanAt, setUnbanAt] = useState("");
    const [unbanAtText, setUnbanAtText] = useState("");
    const [banReason, setBanReason] = useState("");
    const [targetProfile, setTargetProfile] = useState(null);

    const [isDeactivateModalVisible, setDeactivateModalVisible] = useState(false);
    const [deactivateReason, setDeactivateReason] = useState("");
    const [targetDeactivateProfile, setTargetDeactivateProfile] = useState(null);

    const openBanModal = (profile) => {
        setTargetProfile(profile);
        setBanModalVisible(true);
    };

    const openDeactivateModal = (profile) => {
        setTargetDeactivateProfile(profile);
        setDeactivateModalVisible(true);
    };    

    const ProfileActions = {
        UNAPPROVED: [
            { value: "accept_request", label: "✅ 요청 수락" },
            { value: "delete_request", label: "🗑️ 요청 삭제" }
        ],
        USER: {
            active: { value: "deactivate_account", label: "🚫 비활성화" },
            inactive: { value: "activate_account", label: "✅ 활성화" },
            default: { value: "promote_to_admin", label: "🔼 관리자로 승격" },
        },
        ADMIN: [
            { value: "remove_admin_rights", label: "🔽 관리자 권한 박탈" }
        ],
        BAN_STATUS: {
            banned: { value: "unban_account", label: "🔓 정지 해제" },
            unbanned: { value: "ban_account", label: "⛔ 계정 정지(페널티 부여)" }
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

    const loadUserLogs = async () => {
        try {
            const response = await apiRequest(`/user/logs/${user.user_id}`);
            const result = await response.json();
            if (!response.ok) {
              return (
                Alert.alert('유저 정보 불러오기 실패', result.message, [{
                  text: '확인',
                  onPress: () => console.log('onpressed')
                }])
              )
            } else {
              console.log('유저 로그: :::', result);
              setUserLogs(result);
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
    const handleBanConfirm = async () => {
        if (!banDays || isNaN(banDays) || banDays <= 0) {
            Alert.alert("오류", "올바른 정지 기간을 입력하세요.");
            return;
        }
        if (!banReason.trim()) {
            Alert.alert("오류", "정지 사유를 입력하세요.");
            return;
        }
        console.log('adminid: ', user.user_id, 'userId: ', targetProfile.user_id, 'bandays: ', unbanAt, 'reason: ', banReason.trim());
        try {
            const response = await apiRequest('/user/ban', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    adminId: user.user_id,
                    userId: targetProfile.user_id,
                    unbanAt: unbanAt,
                    reason: banReason.trim(),
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                Alert.alert("오류", result.message);
                return;
            }
            Alert.alert("페널티 부여", result.message);
            
            setBanModalVisible(false);
            setBanDays("");
            setBanReason("");
        } catch (error) {
            console.error("정지 요청 실패:", error);
            Alert.alert("오류", "정지 요청을 처리하는 동안 문제가 발생했습니다.");
        }
    };

    const handleDeactivateConfirm = async () => {
        if (!deactivateReason.trim()) {
            Alert.alert("오류", "비활성화 사유를 입력하세요.");
            return;
        }
        try {
            const response = await apiRequest('/user/deactivate', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: targetDeactivateProfile.user_id,
                    adminId: user.user_id,
                    reason: deactivateReason.trim(),
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                Alert.alert("오류", result.message);
                return;
            }
            Alert.alert("비활성화 완료", result.message);
            
            setDeactivateModalVisible(false);
            setDeactivateReason("");
            loadProfiles();  // 목록 갱신
        } catch (error) {
            console.error("비활성화 요청 실패:", error);
            Alert.alert("오류", "비활성화 요청 처리 중 문제가 발생했습니다.");
        }
    };
    

    const handleMenuSelect = async (actionValue, profile) => {
        console.log(`선택된 액션: ${actionValue} / 대상: ${profile.username_kor}`);
        let response = null;
        let result = null;
        try {
            switch (actionValue) {
                case "accept_request":
                    console.log('프로필!!:', profile);
                    Alert.alert('⚠️', `'${profile.username_kor?profile.username_kor:profile.username_eng}'님의 가입을 승인하시겠습니까?`, [
                        {
                            text: '취소',
                            onPress: () => {}
                        },
                        {
                            text: '확인',
                            onPress: async () => {
                                response = await apiRequest('/user/accept', {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        userId: profile.user_id,
                                        adminId: user.user_id,
                                    })
                                });
                                result = await response.json();
                                Alert.alert("알림", result.message);
                            }
                        }
                    ])
                    break;
                case "delete_request":
                    Alert.alert('⚠️', `'${profile.username_kor?profile.username_kor:profile.username_eng}'님의 가입 요청을 삭제하시겠습니까?`, [
                        {
                            text: '취소',
                            onPress: () => {}
                        },
                        {
                            text: '확인',
                            onPress: async () => {
                                response = await apiRequest('/user/delete', {
                                    method: "DELETE",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        userId: profile.user_id,
                                        adminId: user.user_id,
                                    })
                                });
                                result = await response.json();
                                Alert.alert("알림", result.message);
                            }
                        }
                    ])
                    break;
                case "deactivate_account":
                    openDeactivateModal(profile);
                    break;
                case "promote_to_admin":
                    Alert.alert('⚠️', `'${profile.username_kor?profile.username_kor:profile.username_eng}'님에게 관리자 권한을 부여하시겠습니까?`, [
                        {
                            text: '취소',
                            onPress: () => {}
                        },
                        {
                            text: '확인',
                            onPress: async () => {
                                response = await apiRequest('/user/promote', {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        userId: profile.user_id,
                                        adminId: user.user_id,
                                    })
                                });
                                result = await response.json();
                                Alert.alert("알림", result.message);
                            }
                        }
                    ])
                    break;
                case "remove_admin_rights":
                    Alert.alert('⚠️', `'${profile.username_kor?profile.username_kor:profile.username_eng}'님의 관리자 권한을 박탈하시겠습니까?`, [
                        {
                            text: '취소',
                            onPress: () => {}
                        },
                        {
                            text: '확인',
                            onPress: async () => {
                                response = await apiRequest('/user/demote', {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        userId: profile.user_id,
                                        adminId: user.user_id,
                                    })
                                });
                                result = await response.json();
                                Alert.alert("알림", result.message);
                            }
                        }
                    ])
                    break;
                case "ban_account":
                    openBanModal(profile);
                    break;
                case "unban_account":
                    Alert.alert('⚠️', `'${profile.username_kor?profile.username_kor:profile.username_eng}'님의 사용정지 조치를 해제하시겠습니까?`, [
                        {
                            text: '취소',
                            onPress: () => {}
                        },
                        {
                            text: '확인',
                            onPress: async () => {
                                response = await apiRequest('/user/unban', {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        userId: profile.user_id,
                                        adminId: user.user_id,
                                    })
                                });
                                result = await response.json();
                                Alert.alert("알림", result.message);
                            }
                        }
                    ])
                    break;
                default:
                    console.log("정의되지 않은 액션입니다.");
            }
            if (user.role === "admin") {
                loadProfiles();
                loadUserInfo();
            }   
        } catch (error) {
            console.log("액션 수행 중 오류:", error);
            Alert.alert("오류", "작업 수행 중 문제가 발생했습니다.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadUserInfo();
            loadUserLogs();
            setBanModalVisible(false);
            setBanDays('');
            setUnbanAtText('');
            setBanReason('');
            setTargetProfile(null);
            setToday(getTodayDateTime())
        }, [])
    )

    useEffect(() => {
        if (user.role==='admin') {
            loadProfiles();
        }
    }, [user])

    useEffect(() => {
        setUnbanAt(addDays2Tomorrow(banDays-1) + `-${settings.RESERVATION_OPEN_HOUR-1}-59-00`);
    }, [banDays])

    useEffect(() => {
        setUnbanAtText(getDateTime(unbanAt));
    }, [unbanAt])

    const renderProfile = (profile) => (

        <View key={profile.user_id}>
            <Menu onSelect={(actionValue) => handleMenuSelect(actionValue, profile)}>
                <MenuTrigger>
                    <View style={[
                        styles.profile,
                        profile.status === "inactive" && styles.deactivatedProfile,
                        profile.status === "banned" && styles.bannedProfile
                    ]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>{
                            profile.status !== "unapproved" ? (
                                <Text style={profile.role === 'admin' ? styles.adminTag : styles.userTag}>{profile.role === 'admin' ? '관리자' : '학생'}</Text>
                            ) : null}    
                            <Text style={{...styles.profileText, marginTop: 3}}>{profile.username_kor}{profile.status==='inactive'?' (비활성화됨)':profile.status==='banned'?' (일시정지됨)':null}</Text>
                        </View>            
                        <Text style={{...styles.profileText, marginTop: 5}}>{profile.department} {profile.grade}학년 {profile.enrollment_status}중</Text>
                        <Text style={styles.profileText}>{profile.email}</Text>{
                            profile.status === "unapproved" ? (
                                <Text style={styles.helpText}>요청일: {getDateTime(profile.created_at)}</Text>
                            ) : null}
                        
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
                    {profile.status === "banned" && 
                        <MenuOption
                            key={profile.status}
                            value={ProfileActions.BAN_STATUS["banned"].value}
                            text={ProfileActions.BAN_STATUS["banned"].label}
                        />
                    }

                    {profile.status === "active" &&
                        <MenuOption 
                            key={profile.status} 
                            value={ProfileActions.USER["active"].value} 
                            text={ProfileActions.USER["active"].label} 
                        />
                    }

                    {profile.status === "inactive" &&
                        <MenuOption 
                            key={profile.status} 
                            value={ProfileActions.USER["inactive"].value} 
                            text={ProfileActions.USER["inactive"].label} 
                        />
                    }

                    {/* 승인된 사용자일 경우 */}
                    {profile.status !== "unapproved" && profile.role === "user" &&
                        <MenuOption
                            key={"default"}
                            value={ProfileActions.USER["default"].value}
                            text={ProfileActions.USER["default"].label}
                        />
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
        <>
            {/* 비활성화 입력 모달 */}
            <Modal visible={isDeactivateModalVisible} transparent={true} animationType="slide">
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"} 
                    style={styles.modalOverlay}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>🚫 계정 비활성화</Text>
                            <Text style={styles.modalReasonInputLabel}>비활성화 사유</Text>
                            <TextInput
                                style={[styles.modalReasonInput, styles.textArea]}
                                placeholder="비활성화 사유를 입력하세요."
                                multiline
                                value={deactivateReason}
                                onChangeText={setDeactivateReason}
                            />
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={() => setDeactivateModalVisible(false)} style={[styles.button, styles.cancelButton]}>
                                    <Text style={styles.buttonText}>취소</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={async () => {
                                    await handleDeactivateConfirm();
                                    loadUserInfo();
                                }} style={[styles.button, styles.confirmButton]}>
                                    <Text style={styles.buttonText}>확인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal>

            {/* 정지 입력 모달 */}
            <Modal visible={isBanModalVisible} transparent={true} animationType="slide">
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"} 
                    style={styles.modalOverlay}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>⛔ 계정 정지</Text>
                            
                            <Text style={styles.modalReasonInputLabel}>정지 기간 (일)</Text>{
                                banDays ? (
                                    <>
                                        <Text style={{...styles.helpText, marginBottom: 10}}>{getDateTime(getReservationDay(settings.RESERVATION_OPEN_HOUR)+`-${settings.RESERVATION_OPEN_HOUR-1}-59-00`)} ~ {unbanAtText}</Text>
                                        {/* <Text style={styles.helpText}>(남은 기간: {banDays}일)</Text> */}
                                    </>
                                ) : null
                            }
                            <TextInput
                                style={styles.modalReasonInput}
                                placeholder="예: 7"
                                keyboardType="numeric"
                                value={banDays}
                                onChangeText={setBanDays}
                            />
                            <Text style={styles.modalReasonInputLabel}>정지 사유</Text>
                            <TextInput
                                style={[styles.modalReasonInput, styles.textArea]}
                                placeholder="정지 사유를 입력하세요."
                                multiline
                                value={banReason}
                                onChangeText={setBanReason}
                            />
                            
                            
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={() => setBanModalVisible(false)} style={[styles.button, styles.cancelButton]}>
                                    <Text style={styles.buttonText}>취소</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleBanConfirm} style={[styles.button, styles.confirmButton]}>
                                    <Text style={styles.buttonText}>확인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal>
        
            <ScrollView style={styles.container} bounces={false}>
                <View style={styles.myprofileContainer}>
                    <Text style={styles.title}>내 정보</Text>
                    <Text style={styles.myProfileText}>
                        {user.user_id} {user.username_kor}
                    </Text>
                    <Text style={styles.myProfileText}>
                        {user.department} {user.grade}학년 {user.enrollment_status}중
                    </Text>
                    <Text style={styles.myProfileText}>
                        권한: <Text style={styles.highlightText}>{user.role === 'user' ? '학생' : '관리자'}</Text>
                    </Text>
                    <Text style={styles.myProfileText}>
                        상태: <Text style={styles.highlightText}>{user.status === 'active' ? '활성화됨' :
                                                                user.status === 'inactive' ? '비활성화됨' : '정지됨'}</Text>
                    </Text>{
                        user.status !== 'banned' ? (
                            <Text>{userLogs}</Text>
                        ) : null
                    }
                    <Text style={styles.myProfileText}>{user.email}</Text>
                    <View style={styles.todayReservedTimeContainer}>
                        <Text style={styles.myProfileText}>
                            오늘 예약된 시간: <Text style={styles.highlightText}>{user.today_reserved_time}분</Text>
                        </Text>
                        <Text style={styles.helpText}>
                            18시 이후의 예약은 포함하지 않습니다. 😊
                        </Text>
                    </View>
                </View>
                {!isLoading && user.role === 'admin' ? (
                    <View style={styles.profilesContainer}>
                        <Text style={styles.listTitle}>⏳ 승인 대기 목록</Text>
                        <ScrollView style={styles.profiles} bounces={false}>{
                        profiles.filter(profile => profile.status === 'unapproved').length !== 0 ?
                            profiles.filter(profile => profile.status === 'unapproved').map(renderProfile) : (
                                <Text style={styles.helpText}>대기 중인 요청이 없습니다.</Text>
                            )}
                        </ScrollView>
                        <Text style={styles.listTitle}>👤 이용자 목록</Text>
                        <ScrollView style={styles.profiles} bounces={false}>
                            {profiles.filter(profile => profile.status !== 'unapproved').map(renderProfile)}
                        </ScrollView>
                    </View>
                ) : isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : null}
                
            </ScrollView>
        </>
    );
}