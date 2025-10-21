import { get } from '@/utils/http'

const prefix = "contents";

const postsAPI = {
    filterPostsByCategories: ({next_page_url, category_ids, logic_gate, per_page, page, slug, keyword}: {
    next_page_url?: string;
    category_ids?: string[];
    logic_gate?: string;
    per_page?: number;
    page?: number;
    slug?: string;
    keyword?: string | null;
  }) => {
        if(next_page_url) {
            return get({
                url: next_page_url
            }, false)
        }
        return get({
            url: `/${prefix}/filter`,
            params: {
                category_ids,
                logic_gate,
                per_page,
                page,
                slug,
                keyword
            }
        }, false)
    },
    getPostDetails: ({ _id }) => {
      return get({
            url: `/${prefix}/${_id}/details`,
        })
    },
}

export default postsAPI;