import { get } from '@/utils/http'

const prefix = "auction/sitemap/auctions";

const auctionSitemapAPI = {
    getAllAuctions: (params: {
        next_page_url: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
        page: number;
    }) => {
        return get(`/${prefix}/all`, params)
    }
}

export default auctionSitemapAPI;