import { StyleSheet } from "react-native";
import { SMU_COLORS, CUSTOM_COLORS } from "./colors";

const scrollviewMaxHeight = 400;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
    myprofileContainer: {
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        margin: 10,

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    myProfileText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    highlightText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007BFF',
    },
    todayReservedTimeContainer: {
        marginTop: 10,
    },
    helpText: {
        fontSize: 14,
        color: '#666',
    },
    profilesContainer: {
        margin: 10
    },
    listTitle: {
        alignItems: 'center',
        fontSize: 18,
        marginLeft: 10,
        marginBottom: 10
    },
    menuOptionsStyle: {
        marginLeft: 130,
        marginTop: -30,
        width: 150,
        borderWidth: 1,
        backgroundColor: "white",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    profiles: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        maxHeight: scrollviewMaxHeight
      },
    profile: {
        padding: 7,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    profileText: {
        fontSize: 14,
        paddingBottom: 3
    },
    userTag: {
        fontSize: 12,
        backgroundColor: CUSTOM_COLORS.user,
        padding: 5,
        borderRadius: 20,
        marginRight: 5
    },
    adminTag: {
        fontSize: 12,
        backgroundColor: CUSTOM_COLORS.admin,
        padding: 5,
        borderRadius: 20,
        marginRight: 5
    },
    // modal design
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",  // 배경 어둡게 해서 포커스 강화
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
        textAlign: "center",
    },
    modalReasonInputLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 5,
        color: "#666",
    },
    modalReasonInput: {
        paddingTop: 15,
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
    },
    textArea: {
        height: 80, // 여러 줄 입력 가능
        textAlignVertical: "top",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: "#ccc",
    },
    confirmButton: {
        backgroundColor: "#007AFF",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
  });