import { get } from '@/utils/http'

const prefix = "auction/sitemap/auctions";

const auctionSitemapAPI = {
    getAllAuctions: () => {
        return get(`/${prefix}/all`)
    }
}

export default auctionSitemapAPI;