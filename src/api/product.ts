import { get } from '@/utils/http'

const prefix = "paraqon";

const productAPI = {
  filterProductsByCategories: ({
    next_page_url,
    store_id,
    category_ids,
    keyword,
    slug,
    sort_by,
    sort_order,
    per_page,
    page
  }) => {
    const base = `/stores/${store_id}/product-management/products/filter`;
    return get(`/paraqon${base}/v2`, {
      category_ids,
      keyword,
      slug,
      sort_by,
      sort_order,
      per_page,
      page
    })
  }
}

export default productAPI;