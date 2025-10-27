import { get } from '@/utils/http'

const prefix = "posts";

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
            return get(next_page_url)
        }
        return get(`/${prefix}/filter`,
        {
            category_ids,
            logic_gate,
            per_page,
            page,
            slug,
            keyword
        })
    },
    getPostDetails: ({ _id }) => {
      return get(`/${prefix}/${_id}/details`)
    },
}

export default postsAPI;