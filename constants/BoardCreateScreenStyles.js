import { StyleSheet } from "react-native";
import { SMU_COLORS } from "./colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    roomNumberInput: {
        marginBottom: 10,
    },
    titleInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    contentInput: {
        height: 230,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        textAlignVertical: 'top',
    },
    lengthBox: {
        alignItems: 'flex-end',
        //justifyContent: 'center',
        marginTop: -5
    }
});

export default styles;