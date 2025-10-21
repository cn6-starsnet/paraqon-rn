import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTimeInitialized } from "@/store/selectors/timeSelectors";
import { fetchLatest } from "@/store/slices/configurationSlice";
import { fetchTimeWithConfig, startLocalTimer } from "@/store/slices/timeSlice";
import { useEffect, useRef } from "react";

const useInitialize = () => {
    const dispatch = useAppDispatch();
    const isTimeInitialized = useAppSelector(selectTimeInitialized);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;
        
        dispatch(fetchLatest());

        if (!isTimeInitialized) {
            dispatch(fetchTimeWithConfig());
        }

        timerRef.current = setInterval(() => {
            dispatch(startLocalTimer());
        }, 1000);

        syncTimerRef.current = setInterval(() => {
            console.log("同步服务器时间");
            dispatch(fetchTimeWithConfig());
        }, 3600000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (syncTimerRef.current) {
                clearInterval(syncTimerRef.current);
                syncTimerRef.current = null;
            }
        };
    }, [dispatch, isTimeInitialized]);
}

export default useInitialize;