import { StyleSheet } from "react-native";

const timeslot = {
    width: "20%",
    height: 20,
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
        backgroundColor: "#FFFFFF",
        padding: 20,
        //borderRadius: 10, // 모서리를 부드럽게
        //shadowColor: "#000", // 약간의 그림자로 모달 강조
        //shadowOffset: { width: 0, height: 2 },
        //shadowOpacity: 0.25,
        //shadowRadius: 4,
        //elevation: 5, // Android에서 그림자 효과
    },
    modalTimeslotContainer: {
        backgroundColor: '#F5F5F5',
        flex: 7,
        alignItems: "center",
        justifyContent: "center",
    },
    timeslotRow: {
        flexDirection: "row",
        //backgroundColor: "yellow"
    },
    timeslot: {
        ...timeslot,
        backgroundColor: '#F5F5DC',
        borderColor: "#DCDCDC"
    },
    timeslotOccupied: {
        ...timeslot,
        backgroundColor: "#F28B82",
        borderColor: "#D46960",
        borderWidth: 1
    },
    timeslotSelected: {
        ...timeslot,
        backgroundColor: "#C8F2C2",
        borderWidth: 2,
        borderColor: "#82C091"
    },
    timeslotPassed: {
        ...timeslot,
        backgroundColor:"#E8EAED",
        borderColor: "#BDC1C6",
        borderWidth: 1,
    },
    modalButtonContainer: {
        backgroundColor: "#EFEFEF",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'center',
        width: "50%",
    },
    modalButton: {
        backgroundColor: "#A5D8FF",
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
        backgroundColor: "#A5D8FF",
        padding: 20,
        borderRadius: 20,
        //
    },
});

export default styles;