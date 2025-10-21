import { get } from '@/utils/http'

const prefix = "auction/sitemap/auctions";

const auctionSitemapAPI = {
    getAllAuctions: () => {
        return get({
            url: `/${prefix}/all`
        })
    }
}

export default auctionSitemapAPI;