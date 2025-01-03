import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "@env"
import { accessTokenKey } from "../constants/keys"

export async function apiRequest(endpoint, options = {}, dispatch) {
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
    const timeoutId = setTimeout(() => controller.abort(), 3000);

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
    } finally {
        clearTimeout(timeoutId);
    }
}