import { get } from '@/utils/http'

const prefix = "paraqon/auction-lots";

const auctionLotAPI = {
    getAuctionLogDetails: ({ auction_lot_id }) => {
        return get({
            url: `/${prefix}/${auction_lot_id}/details`
        }, false)
    },
    getAuctionLotAllBids: ({ auction_lot_id }) => {
        return get({
            url: `/${prefix}/${auction_lot_id}/bids/all`
        }, false)
    }
}

export default auctionLotAPI;