// store/selectors/timeSelectors.ts
import { RootState } from '../index'

// 返回时间戳而不是 Date 对象
export const selectCurrentTimestamp = (state: RootState) => {
    const { serverTime, serverPrefNow } = state.time;
    
    if (!serverTime || !serverPrefNow) return null;
    
    const elapsed = performance.now() - serverPrefNow;
    return serverTime + elapsed;
}

// 或者返回格式化的字符串
export const selectCurrentTimeString = (state: RootState) => {
    const { serverTime, serverPrefNow } = state.time;
    
    if (!serverTime || !serverPrefNow) return null;
    
    const elapsed = performance.now() - serverPrefNow;
    const serverDate = new Date(serverTime + elapsed);
    return serverDate.toISOString();
}

// 判断是否初始化的 selector
export const selectTimeInitialized = (state: RootState) => {
    return !!(state.time.serverTime && state.time.serverPrefNow);
}