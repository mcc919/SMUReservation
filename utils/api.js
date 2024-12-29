import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "@env"
import { accessTokenKey } from "../constants/keys"

export async function apiRequest(endpoint, options = {}, dispatch) {
    const token = await AsyncStorage.getItem(accessTokenKey);
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            ...options,
            headers,
        });
        
        if (response.ok) {
            console.log('이것이 response입니다.', response);  // FOR DEBUG
            const result = await response.json();
            console.log('이것이 result입니다.', result);  // FOR DEBUG

            
            return result;
        }

        console.log('이것이 response입니다.', response);  // FOR DEBUG
        const result = await response.json();
        console.log('이것이 result입니다.', result);  // FOR DEBUG
        const error = {
            status: response.status,
            message: response.message
        }

        
        if ([401, 403].includes(response.status)) {
            await AsyncStorage.removeItem(accessTokenKey);
            dispatch({ type: 'SIGN_OUT' });
        }

        return Promise.reject(error);
    } catch (e) {
        console.error('API request error:', e);
        return Promise.reject({
            status: null,
            message: '서버가 응답하지 않습니다.'
        });
    }
}