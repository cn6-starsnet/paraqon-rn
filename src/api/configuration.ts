import { get } from '@/utils/http'

const prefix = "configuration";

const configurationAPI = {
    getLatestAPI: async () => {
        try {
            const response = await get(`/${prefix}/latest`);
            return response
        } catch (error) {
            console.log("getLatest获取数据出错", error)
        }
    }
}

export default configurationAPI;