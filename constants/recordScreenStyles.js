import { StyleSheet } from "react-native";

const cancelButton = {
  flex: 1,
  height: 40,
  fontWeight: 'bold',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 5,
  borderRadius: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',  // 배경색
    padding: 10,
  },
  recordContainer: {
    flexDirection: 'row',
    padding: 10,
    //borderBottomWidth: 1,
    marginBottom: 7,
    borderRadius: 10,
    shadowColor: "#000",  // 그림자 효과
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,  // 안드로이드에서 그림자 효과
    alignItems: 'center',
    justifyContent: 'center'
  },
  recordTextContainer: {
    flex:4,
  },
  cancelButton: {
    ...cancelButton,
    backgroundColor: '#D32F2F',
  },
  cancelledCancelButton: {
    ...cancelButton,
    backgroundColor: '#FFCDD2', // 비활성화 상태에서는 연한 빨간색
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  completedCancelButton: {
    ...cancelButton,
    backgroundColor: '#9E9E9E', // 회색 (완료 상태를 강조)
    //color: '#FFFFFF',          // 텍스트 흰색
  },
  completedCancelButtonText: {
    color: '#FFFFFF', 
    fontSize: 14,
    fontWeight: 'bold',
  },
  roomNumberText: {
    fontSize: 24,
    padding: 5,
    fontWeight: 'bold',
    color: 'black',  // 방 번호 강조
  },
  dateText: {
    fontSize: 16,
    paddingLeft: 5,
    color: 'black',
  },
  timeText: {
    fontSize: 16,
    paddingLeft: 5,
    color: '#16a085',  // 예약 시간 강조
  },
  createdAtText: {
    fontSize: 12,
    paddingLeft: 5,
    color: 'black',  // 신청일시를 연한 색상으로 표시
  },
  pressed: {
    backgroundColor: '#ecf0f1', // 항목 클릭 시 배경색 변경
  }
});

export default styles;
