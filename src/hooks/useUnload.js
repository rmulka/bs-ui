import { useRef, useEffect } from 'react';

const useUnload = fn => {
    const cb = useRef(fn);

    useEffect(() => {
        cb.current = fn;
    }, [fn]);

    useEffect(() => {
        const onUnload = cb.current;

        // window.addEventListener("beforeunload", onUnload);
        window.addEventListener("popstate", onUnload)

        return () => {
            // window.removeEventListener("beforeunload", onUnload);
            window.removeEventListener("popstate", onUnload);
        }
    }, []);
};

export default useUnload;