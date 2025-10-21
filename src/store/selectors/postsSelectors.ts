// store/selectors/postsSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../index";

// 基础选择器
export const selectPostsData = (state: RootState) => state.posts.posts;
export const selectCategoriesData = (state: RootState) => state.posts.categories;
export const selectLikedPosts = (state: RootState) => state.posts.liked_posts;
export const selectPost = (state: RootState) => state.posts.post;
export const selectReviews = (state: RootState) => state.posts.reviews;
export const selectRelatedPostsUrls = (state: RootState) => state.posts.related_posts_urls;
export const selectRelatedPostsData = (state: RootState) => state.posts.related_posts;
export const selectPostsLoading = (state: RootState) => state.posts.loading;
export const selectPostsError = (state: RootState) => state.posts.error;

// 派生选择器（原 getters 逻辑）
export const selectCategories = createSelector(
  [selectCategoriesData],
  (categoriesData) => {
    const output = categoriesData.map((category) => category.data);
    return [].concat.apply([], output);
  }
);

export const selectPosts = createSelector(
  [selectPostsData],
  (postsData) => {
    const output = postsData.map((post) => post.data);
    return [].concat.apply([], output);
  }
);

export const selectRelatedPosts = createSelector(
  [selectRelatedPostsData],
  (relatedPostsData) => {
    const output = relatedPostsData.map((post) => post.data);
    return [].concat.apply([], output);
  }
);

export const selectNextCategoryLink = createSelector(
  [selectCategoriesData],
  (categoriesData) => {
    const lastElement = categoriesData[categoriesData.length - 1];
    try {
      return lastElement?.next_page_url || null;
    } catch (error) {
      return null;
    }
  }
);

export const selectNextPostLink = createSelector(
  [selectPostsData],
  (postsData) => {
    const lastElement = postsData[postsData.length - 1];
    try {
      return lastElement?.next_page_url || null;
    } catch (error) {
      return null;
    }
  }
);

export const selectNextRelatedPostLink = createSelector(
  [selectRelatedPostsUrls],
  (relatedPostsUrls) => {
    return relatedPostsUrls[0] || null;
  }
);

export const selectLikedPostsData = createSelector(
  [selectLikedPosts],
  (likedPosts) => likedPosts?.data || []
);

export const selectReviewsData = createSelector(
  [selectReviews],
  (reviews) => reviews?.data || []
);

// 高级选择器
export const selectPostWithStatus = createSelector(
  [selectPost, selectPostsLoading, selectPostsError],
  (post, loading, error) => ({
    post: post || {},
    loading,
    error,
    hasPost: !!post,
    isLikedByCurrentUser: (post?.liked_account_ids?.length || 0) > 0
  })
);

export const selectCurrentUserLikesPost = createSelector(
  [selectPost, (state: RootState, currentUserId: string) => currentUserId],
  (post, currentUserId) => {
    return post?.liked_account_ids?.includes(currentUserId) || false;
  }
);

export const selectPostStats = createSelector(
  [selectPost],
  (post) => ({
    likesCount: post?.liked_account_ids?.length || 0,
    hasLikes: (post?.liked_account_ids?.length || 0) > 0,
    reviewsCount: post?.reviews_count || 0
  })
);

export const selectFilteredPostsWithPagination = createSelector(
  [selectPosts, selectNextPostLink, selectPostsLoading],
  (posts, nextLink, loading) => ({
    posts,
    hasMore: !!nextLink,
    loading,
    totalCount: posts.length
  })
);