// // 📁 /src/Service/Hook/Toast/CustomToast.js
// import { ToastAndroid, Platform, Alert } from 'react-native';

// export default function CustomToast(message) {
//     if (Platform.OS === 'android') {
//         ToastAndroid.show(message, ToastAndroid.SHORT);
//     } else {
//         Alert.alert('Notification', message);
//     }
// }

// /src/Service/Hook/Toast/CustomToast.js
import Toast from 'react-native-toast-message';

export default function CustomToast(message, type = 'success') {
    Toast.show({
        type,
        text1: message,
        position: 'bottom',
        visibilityTime: 2000,
    });
}
