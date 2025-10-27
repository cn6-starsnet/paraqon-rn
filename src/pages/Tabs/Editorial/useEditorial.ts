import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectPosts } from "@/store/selectors/postsSelectors";
import { filterPostsByCategories } from "@/store/slices/postSlice"
import { StackActions, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

const useEditorial = () => {
    const dispatch = useAppDispatch();
    const posts = useAppSelector(selectPosts)
    const navigation = useNavigation();

    const handlePostClick = (postId: string) => {
        navigation.dispatch(StackActions.push("EditorialDetail", {postId}))
    }

    useEffect(() => {
        if(posts.length > 0) return;
        dispatch(filterPostsByCategories({
            per_page: null
        }))
    }, [dispatch])

    return {
        posts,
        handlePostClick
    }
}

export default useEditorial;