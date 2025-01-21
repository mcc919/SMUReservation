import { StyleSheet } from "react-native"
import { SMU_COLORS } from "./smuColors";

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
        paddingBottom: 10,
    },
    titleText: {
        paddingVertical: 5,
        fontWeight: 'bold',
    },
    contentText: {
        
    },
    statusText: {
        paddingTop: 5,
    },
    writeButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    }
})

export default styles;