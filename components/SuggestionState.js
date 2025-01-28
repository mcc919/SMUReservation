import { Text, View, StyleSheet} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';

import { SMU_COLORS } from "../constants/colors";

export const SuggestionStates = {
    SUBMITTED: { value: "submitted", icon: "📝", label: "제출됨" },
    //{ value: "pending_review", icon: "⏳", label: "검토 대기" },

    UNDER_REVIEW: { value: "under_review", icon: "🔍", label: "검토 중" },
    REJECTED: { value: "rejected", icon: "❌", label: "기각됨" },
    NEED_REVISION: { value: "need_revision", icon: "✏️", label: "보완 요청" },

    APPROVED: { value: "approved", icon: "✅", label: "승인됨" },
    IN_PROGRESS: { value: "in_progress", icon: "🔄", label: "진행 중" },

    COMPLETED: { value: "completed", icon: "🏁", label: "완료됨" },
    CANCELLED: { value: "cancelled", icon: "🚫", label: "취소됨" },
    HOLD_ON: { value: "hold_on", icon: "⏸️", label: "보류됨" },
};

export function SuggestionState({ status }) {
    const size = 24;

    const colorApproved = SMU_COLORS.green;
    const colorReject = SMU_COLORS.red;
    const colorProcessing = SMU_COLORS.SMSilver;

    // return (
    //     <>
    //         <Entypo name="pencil" size={size} color={colorProcessing} />         // submitted
    //         <Fontisto name="zoom" size={size} color={colorProcessing} />         // under_review
    //         <Feather name="x" size={24} color={colorReject} />                   // rejected
    //         <AntDesign name="checkcircleo" size={24} color={colorApproved} />    // approved
    //         <Ionicons name="document-attach-outline" size={size} color={colorProcessing} />  // need_rivision
    //         <FontAwesome6 name="rotate" size={24} color={colorProcessing} />     // in_progress
    //         <FontAwesome name="flag" size={24} color={colorApproved} />          // completed
    //         <Entypo name="block" size={24} color={colorReject} />                // cancelled
    //         <MaterialIcons name="cancel" size={24} color={colorReject} />        // cancelled2
    //         <Feather name="pause-circle" size={24} color={colorReject} />        // hold_on
    //     </>
    // )

    switch (status) {
        case SuggestionStates.SUBMITTED.value:
            return (
                <View style={styles.container}>
                    <Entypo name="pencil" size={size} color={colorProcessing} />
                    <Text style={styles.text}>{SuggestionStates.SUBMITTED.label}</Text>
                </View>
            );
        case SuggestionStates.UNDER_REVIEW.value:
            return (
                <View style={styles.container}>
                    <Fontisto name="zoom" size={size} color={colorProcessing} />
                    <Text style={styles.text}>{SuggestionStates.UNDER_REVIEW.label}</Text>
                </View>
            );
        case SuggestionStates.REJECTED.value:
            return (
                <View style={styles.container}>
                    <Entypo name="cross" size={size} color={colorReject} />
                    <Text style={styles.text}>{SuggestionStates.REJECTED.label}</Text>
                </View>
            );
        case SuggestionStates.APPROVED.value:
            return (
                <View style={styles.container}>
                <AntDesign name="checkcircleo" size={size} color={colorApproved} />
                <Text style={styles.text}>{SuggestionStates.APPROVED.label}</Text>
            </View>
        );
        case SuggestionStates.NEED_REVISION.value:
            return (
                <View style={styles.container}>
                    <Ionicons name="document-attach-outline" size={size} color={colorProcessing} />
                    <Text style={styles.text}>{SuggestionStates.NEED_REVISION.label}</Text>
                </View>
            );
        case SuggestionStates.IN_PROGRESS.value:
            return (
                <View style={styles.container}>
                    <FontAwesome6 name="rotate" size={size} color={colorProcessing} />
                    <Text style={styles.text}>{SuggestionStates.IN_PROGRESS.label}</Text>
                </View>
            );
        case SuggestionStates.COMPLETED.value:
            return (
                <View style={styles.container}>
                    <FontAwesome name="flag" size={size} color={colorApproved} />
                    <Text style={styles.text}>{SuggestionStates.COMPLETED.label}</Text>
                </View>
            );
        case SuggestionStates.CANCELLED.value:
            return (
                <View style={styles.container}>
                    <Entypo name="block" size={size} color={colorReject} />
                    <Text style={styles.text}>{SuggestionStates.CANCELLED.label}</Text>
                </View>
            );
        case SuggestionStates.HOLD_ON.value:
            return (
                <View style={styles.container}>
                    <Feather name="pause-circle" size={size} color={colorReject} />
                    <Text style={styles.text}>{SuggestionStates.HOLD_ON.label}</Text>
                </View>
            );
    }
    
    return (
        <Text style={styles.text}>상태: 알 수 없음</Text>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'row',
        //justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        width: 110,
        //backgroundColor: 'lightyellow',
    },
    text: {
        marginLeft: 5,
        fontSize: 17,
    }
})