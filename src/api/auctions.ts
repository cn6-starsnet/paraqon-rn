import { get } from '@/utils/http'

const prefix = "paraqon";

const auctionAPI = {
    getAuctionsType: () => {
        return get(
            `/${prefix}/auctions/all?slug=recommended&sort_by=lot_number&sort_order=ASC&per_page=999999&page=1`,
        )
    },
    getAuctionDetails: ({ auction_id }) => {
        return get(`/${prefix}/auctions/${auction_id}/details`)
    },
    getAuctionsGoods: ({auction_id,per_page,page}) => {
        return get(`/${prefix}/stores/${auction_id}/product-management/products/filter/v2?slug=recommended&sort_by=lot_number&sort_order=ASC&per_page=${per_page}&page=${page}`)
    },
    getAllAuctions: ({
      next_page_url,
      status,
      sort_by,
      sort_order,
      per_page,
      page,
    }) => {
      if (next_page_url) {
        return get(next_page_url)
      }
      return get(`/${prefix}/all`,{
          status,
          sort_by,
          sort_order,
          per_page,
          page,
        },
      )
    },
    getAllAuctionLotsAndNumber: ({store_id,sort_by = "ASC",sort_order}) => {
        return get(`/paraqon/stores/${store_id}/product-management/auction-lots/number`, {
              sort_by,
              sort_order
            }
        )
    }
}

export default auctionAPI;