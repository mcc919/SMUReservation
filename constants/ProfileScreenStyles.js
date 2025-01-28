import { StyleSheet } from "react-native";
import { SMU_COLORS, CUSTOM_COLORS } from "./colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    text: {
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
    statusText: {
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
    profiles: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        maxHeight: 200
      },
    profile: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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
  });