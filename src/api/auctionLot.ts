import { get } from '@/utils/http'

const prefix = "paraqon/auction-lots";

const auctionLotAPI = {
    getAuctionLogDetails: ({ auction_lot_id }) => {
        return get(`/${prefix}/${auction_lot_id}/details`)
    },
    getAuctionLotAllBids: ({ auction_lot_id }) => {
        return get(`/${prefix}/${auction_lot_id}/bids/all`)
    }
}

export default auctionLotAPI;