import {CSSProperties, useEffect, useRef, useCallback} from "react";

export default function InfiniteScroll({
    callback, 
    hasMore, 
    loading
}: {
    callback: () => void,
    hasMore: boolean,
    loading: boolean
}) {
    const observer = useRef<IntersectionObserver | null>(null);
    const observerTarget = useCallback((node: HTMLDivElement) => {
        if (loading || !hasMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    callback();
                }
            },
            {threshold: 0.1}
        );

        if (node) observer.current.observe(node);
    }, [loading, hasMore, callback]);

    const style = {
        width: "100%",
        height: "100%",
        minWidth: "20px",
        minHeight: "20px",
        textAlign: "center"
    } as CSSProperties


    if (loading) return <div style={style}>Loading...</div>


    if (!hasMore) return <div style={style}>No more.</div>

    return <div ref={observerTarget} style={style}>...</div>
}
