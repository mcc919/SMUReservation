import { StyleSheet } from "react-native";
import { SMU_COLORS } from "./smuColors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    boardContainer: {
        flex: 1,
        backgroundColor: 'lightyellow'
    },
    infoContainer: {
        flex: 1,
        paddingBottom: 30,
        //paddingLeft: 20,
        //backgroundColor: '#ddd'
    },
    boardCommentsContainer: {
        flex: 1,
    },
    boardCommentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
    },
    roomNumber: {
        fontSize: 20
    },
    writer: {
        fontSize: 20,
    },
    createdAt: {
        fontSize: 12,
        color: SMU_COLORS.SMSilver
    },
    editedAt: {
        fontSize: 12,
        color: SMU_COLORS.SMSilver
    },
    content: {
        marginTop: 20,
        fontSize: 16,
    },
})

export default styles;