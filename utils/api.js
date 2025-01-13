import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "@env"
import { accessTokenKey } from "../constants/keys"
import { WAITING_TIME } from "../constants/settings";
import { Alert } from "react-native";
import RNRestart from 'react-native-restart'

export async function apiRequest(endpoint, options = {}, dispatch) {
    // if (!dispatch) {
    //     Alert.alert('dispatch 오류', '앱을 다시 실행시켜주세요', [
    //         {
    //             text: '재시작',
    //             onPress: () => RNRestart.restart()
    //         }
    //     ])
    // }

    const token = await AsyncStorage.getItem(accessTokenKey);
    if (!token) {
        console.log('여기... token 불러오기 실패');
        
    dispatch({ type: 'SIGN_OUT' });
        return null;

    }

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WAITING_TIME);

    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal,
        });
        
        //console.log('이것이 response입니다.', response);  // FOR DEBUG
        clearTimeout(timeoutId);

        if ([401, 403].includes(response.status)) {
            await AsyncStorage.removeItem(accessTokenKey);
            dispatch({ type: 'SIGN_OUT' });
        }

        return response;
    } catch (e) {
        console.error('API request error:', e);
        // return Promise.reject({
        //     status: null,
        //     message: '서버가 응답하지 않습니다.'
        // });
        dispatch({type: 'SIGN_OUT'});
        console.log('apiRequest 함수에서 dispatch 이후에 실행이 되는지');
    } finally {
        clearTimeout(timeoutId);
    }
}