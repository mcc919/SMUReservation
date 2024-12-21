import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, TextInput, ActivityIndicator, Alert} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import styles from '../constants/styles';

export default function RegisterScreen({ navigation }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const register = async () => {
        if (!agreeToTerms) {
            setErrorMessage('약관에 동의해야 합니다.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `username=${username}&password=${password}`,
            });
            console.log('이것이 response입니다.', response);

            if (response.ok) {
                Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.', [
                    {
                        text: '확인',
                        onPress: () => navigation.navigate('LoginScreen'),
                    },
                ]);
            } else {
                if (response.status === 409) {
                    setErrorMessage('이미 존재하는 사용자입니다. 관리자에게 문의하세요.');
                } else if (response.status === 400) {
                    setErrorMessage('아이디와 비밀번호를 확인해주세요.');
                } else if (response.status === 500) {
                    setErrorMessage('이미 존재하는 사용자입니다. 관리자에게 문의하세요.');
                } else {
                    setErrorMessage('알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.');
                }
            }
            
        } catch (e) {
            console.error('Register error:', e);
            setErrorMessage('서버가 응답하지 않습니다. 관리자에게 문의하세요.');
        } finally {
            setIsLoading(false);
        }
    }
    
    
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.inner}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <View style={styles.checkboxContainer}>
                        <CheckBox
                            value={agreeToTerms}
                            onValueChange={setAgreeToTerms}
                        />
                        <Text style={styles.label}>약관에 동의합니다.</Text>
                    </View>
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#3b82f6" />
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={register}
                                disabled={isLoading} // 로딩 중 버튼 비활성화
                            >
                                <Text style={styles.buttonText}>Sign In</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}