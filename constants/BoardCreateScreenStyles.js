import { StyleSheet } from "react-native";
import { SMU_COLORS } from "./smuColors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    titleInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    contentInput: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        textAlignVertical: 'top',
    }
});

export default styles;