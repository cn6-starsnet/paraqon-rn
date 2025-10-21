import { get } from '@/utils/http'

const prefix = "contents";

const auctionAPI = {
    getContentBySlug: ({ slug }) => {
        return get({
            url: `/${prefix}/slug/${slug}/latest`,
        }, false)
    },
}

export default auctionAPI;