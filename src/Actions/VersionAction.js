import { Alert, Linking, BackHandler } from 'react-native';
import showToastWithGravity from '../components/Toast';
import { signOutAction } from '../Actions/AuthAction';
import DeviceInfo from 'react-native-device-info';
import trackerApi from '../api/tracker';


export const getDeviceInfo = () => {
    let deviceJSON = {};
    try {
        deviceJSON.uniqueId = DeviceInfo.getUniqueId();
        deviceJSON.systemName = DeviceInfo.getSystemName();
        deviceJSON.systemVersion = DeviceInfo.getSystemVersion();
        deviceJSON.userAppVersion = DeviceInfo.getVersion();
        deviceJSON.brand = DeviceInfo.getBrand();
        deviceJSON.model = DeviceInfo.getModel();
        return deviceJSON
    } catch (err) {
        console.log(err);
        return {};
    }
}

const checkSupportedUrl = async (url) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);
    if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
    }
}

const updateAlert = ({ message, updateForced, url }) => {
    return async (dispatch) => {
        Alert.alert(
            "به‌روزرسانی",
            message,
            [
                updateForced ?
                    { text: "بستن برنامه", onPress: () => BackHandler.exitApp(), style: "cancel" }
                    :
                    {
                        text: "بعدا", style: "cancel", onPress: () => {
                            dispatch({ type: 'user_token', payload: true });
                            dispatch({ type: 'isLoading', payload: false })
                        }
                    },
                {
                    text: "تایید",
                    onPress: async () => {
                        BackHandler.exitApp()
                        await checkSupportedUrl(url)
                        // await Linking.openURL("https://myket.ir/app/com.peykban")
                    }
                }
            ],
            { cancelable: false }
        )
    }
}

export const versionHandling = () => {
    return async (dispatch) => {
        try {
            const deviceJSON = getDeviceInfo()
            const response = await trackerApi.post('/version-handling', { deviceJSON });
            switch (response.status) {
                case 200: {
                    const updateForced = response.data.updateForced
                    if (!response.data.sameVersion) {
                        if (updateForced) {
                            dispatch(updateAlert({
                                message: 'برای استفاده باید برنامه را به‌روزرسانی کنید',
                                url: 'https://myket.ir/app/com.peykban',
                                updateForced
                            }));
                        } else {
                            dispatch(updateAlert({
                                message: 'نسخه جدید در دسترس است می‌توانید برنامه را به‌روزرسانی کنید',
                                url: 'https://myket.ir/app/com.peykban',
                                updateForced
                            }));
                        }
                    } else {
                        dispatch({ type: 'user_token', payload: true });
                        dispatch({ type: 'isLoading', payload: false })
                    }
                    break;
                }
                case 400: {
                    showToastWithGravity(response.data.message)
                    break;
                }
                case 401: {
                    showToastWithGravity("مجدد وارد شوید")
                    break;
                }
                default: {
                    showToastWithGravity("در حال حاضر ارتباط با سرور برقرار نیست")
                    break;
                }
            }
        } catch (err) {
            showToastWithGravity('versionHandling: ', err)
        }
    }
}
