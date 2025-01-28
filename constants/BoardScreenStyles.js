import { StyleSheet } from "react-native"
import { SMU_COLORS } from "./colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    boardContainer: {
        padding: 10,
        flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: SMU_COLORS.SMLightgray,
        borderRadius: 10,
    },
    //boardTextContainer: {
    //    flex: 3
    //},
    //boardStatusContainer: {
    //    flex: 1,
    //    justifyContent: 'center',
    //    alignItems: 'center',
    //},
    roomNumberText: {
        fontSize: 24,
        //padding: 5,
        fontWeight: 'bold',
        color: 'black',
        paddingBottom: 5,
    },
    titleText: {
        paddingBottom: 5,
        fontWeight: 'bold',
    },
    dateText: {
        paddingTop: 3,
        color: SMU_COLORS.SMSilver
    },
    writeButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    }
})

export default styles;