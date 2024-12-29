import { StyleSheet } from "react-native";

const timeslot = {
    width: "20%",
    height: 30,
    backgroundColor: '#3b82f6',
    margin: 5,
    justifyContent: "center",
    alignItems: "center"
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 20,
        flexDirection: "row",
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "yellow",
    },
    modalTimeslotContainer: {
        backgroundColor: 'lightgray',
        flex: 9,
        alignItems: "center",
        justifyContent: "center",
    },
    timeslotRow: {
        flexDirection: "row",
        backgroundColor: "yellow"
    },
    timeslot: {
      ...timeslot  
    },
    timeslotOccupied: {
        ...timeslot,
        backgroundColor:"rgb(124, 124, 124)",
    },
    modalButtonContainer: {
        backgroundColor: "green",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'center',
        width: "50%",
    },
    modalButton: {
        backgroundColor: "#3b82f6",
        padding: 20,
        borderRadius: 20
    },
    modalRoomNumberText: {
        fontSize: 30,
    },
    leftContainer: {
        flex: 1.5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginBottom: 300,
        //backgroundColor: "red",     // FOR DEBUG
    },
    rightContainer: {
        flex: 1,
        flexDirection: "column-reverse",
        alignItems: "center",
        justifyContent: "space-around",
        //backgroundColor: "blue",    // FOR DEBUG
        
    },
    room: {
        backgroundColor: "#3b82f6",
        padding: 20,
        borderRadius: 20,
        //
    },
});

export default styles;