import { get } from '@/utils/http'

const prefix = "contents";

const auctionAPI = {
    getContentBySlug: ({ slug }) => {
        return get(`/${prefix}/slug/${slug}/latest`)
    },
}

export default auctionAPI;