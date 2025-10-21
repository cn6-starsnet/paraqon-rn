import { useAppDispatch } from "@/store/hooks";
import { fetchAuctionsType } from "@/store/slices/productSlice";
import { useEffect, useMemo, useState } from "react";

const useHome = () => {
    const [currentFeaturedTab, setCurrentFeaturedTab] = useState("upcoming")
    const dispatch = useAppDispatch()

    const featuredTabs = useMemo(() => {
        return [{
						title: "即将举行",
						value: "upcoming"
					},
					{
						title: "已结束",
						value: "past"
					},
        ]
    }, [])

    useEffect(() => {
        dispatch(fetchAuctionsType())
    }, [dispatch,fetchAuctionsType])

    return {
        featuredTabs,
        currentFeaturedTab,
        setCurrentFeaturedTab
    }
}

export default useHome;