import { Dimensions } from 'react-native'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const UIWidthPx = 393;

const UIHeightPx = 850;

const pxToVw = (uiElementPx: number, uiWidthPx: number = UIWidthPx) => {
    return (uiElementPx * screenWidth) / uiWidthPx;
}

const pxToVh = (uiElementPx: number, uiHeightPx: number = UIHeightPx) => {
    return (uiElementPx * screenWidth) / uiHeightPx;
}
export { pxToVw, pxToVh, screenWidth, screenHeight };