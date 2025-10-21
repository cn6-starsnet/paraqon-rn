import { get } from '@/utils/http'

const prefix = "paraqon";

const auctionAPI = {
    getAuctionsType: () => {
        return get(
            `/${prefix}/auctions/all`,
            { 
                slug: 'recommended',
                sort_by: 'lot_number',
                sort_order: 'ASC',
                per_page: 999999,
                page: 1
            }
        )
    },
    getAuctionDetails: ({ auction_id }) => {
        return get({
            url: `/${prefix}/auctions/${auction_id}/details`,
        }, false)
    },
    getAuctionsGoods: ({auction_id,per_page,page}) => {
        return get({
            url: `/${prefix}/stores/${auction_id}/product-management/products/filter/v2?slug=recommended&sort_by=lot_number&sort_order=ASC&per_page=${per_page}&page=${page}`
        })
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
        return get({
            url: next_page_url
        })
      }
      return get({
        url: `/${prefix}/all`,
        params: {
          status,
          sort_by,
          sort_order,
          per_page,
          page,
        },
      });
    },
    getAllAuctionLotsAndNumber: ({store_id,sort_by,sort_order}) => {
        return get({
            url: `/paraqon/stores/${store_id}/product-management/auction-lots/number`,
            params: {
              sort_by,
              sort_order
            }
        })
    }
}

export default auctionAPI;