import { StyleSheet } from "react-native";
import { CUSTOM_COLORS, SMU_COLORS } from "./colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    boardContainer: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 7,
        borderRadius: 10,
        backgroundColor: CUSTOM_COLORS.boardBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    infoContainer: {
        flex: 1,
        paddingBottom: 20,
        //paddingLeft: 20,
        //backgroundColor: '#ddd'
    },
    boardCommentsContainer: {
        flex: 1,
    },
    boardCommentContainer: {
        flex: 1,
        marginTop: 10,
        paddingBottom: 15,
        borderTopColor: SMU_COLORS.SMLightgray,
        paddingHorizontal: 7,
        borderRadius: 10,
        borderTopWidth: 1,
        backgroundColor: CUSTOM_COLORS.commentBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    roomNumber: {
        fontSize: 20
    },
    writerInfo: {
        flexDirection:'row',
        alignItems:'center'
    },
    userTag: {
        fontSize: 12,
        backgroundColor: CUSTOM_COLORS.user,
        padding: 5,
        borderRadius: 20,
    },
    adminTag: {
        fontSize: 12,
        backgroundColor: CUSTOM_COLORS.admin,
        padding: 5,
        borderRadius: 20,
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
    lengthBox: {
        alignItems: 'flex-end',
        //justifyContent: 'center',
        marginTop: -5
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