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
    commentCreateContainer: {
        padding: 10,
        //backgroundColor: 'lightblue',
        //justifyContent: 'center',
        //alignItems: 'center'
    },
    stateInput: {
        marginBottom: 10
    },
    commentContentInput: {
        height: 100,
        //width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        textAlignVertical: 'top',
    },

    commentCreateButtonContainer: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentCreateButton: {
        width: '50%',
        height: 50,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    commentCreateButtonText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    
})

export default styles;