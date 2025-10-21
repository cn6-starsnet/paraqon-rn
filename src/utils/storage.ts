import { APP_NAME } from "@/constants"
import { MMKV } from "react-native-mmkv"

export const storage = new MMKV({
    id: `${APP_NAME}_app_storage`
})

export const getStoreItem = (key: string) => {
    return storage.getString(key)
}

export const setStoreItem = (key: string, data: any) => {
    return storage.set(key, data)
}