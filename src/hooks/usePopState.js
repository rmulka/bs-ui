import { useRef, useEffect } from 'react';

const usePopState = fn => {
    const cb = useRef(fn);

    useEffect(() => {
        cb.current = fn;
    }, [fn]);

    useEffect(() => {
        const onUnload = cb.current;

        window.addEventListener("popstate", onUnload)

        return () => {
            window.removeEventListener("popstate", onUnload);
        }
    }, []);
};

export default usePopState;