import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectPost } from "@/store/selectors/postsSelectors";
import { getPostDetails } from "@/store/slices/postSlice";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo } from "react";
import { Image } from "react-native";

type EditorialDetailRouteProp = RouteProp<
  { EditorialDetail: { postId: string } },
  'EditorialDetail'
>;

const useEditorialDetail = () => {
    const route = useRoute<EditorialDetailRouteProp>();
    const { postId } = route.params;
    const dispatch = useAppDispatch();

    const post = useAppSelector(selectPost);

    useEffect(() => {
        console.log('接收到的 postId:', postId);
        dispatch(getPostDetails(postId))
    }, [postId]);
    
    return {
        post
    }
}

export default useEditorialDetail;