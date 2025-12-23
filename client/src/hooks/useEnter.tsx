import { useEffect, useState } from 'react';

export function useEnter(open?: boolean) {
    const [enter, setEnter] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        const id = requestAnimationFrame(() => setEnter(true));

        return () => {
            cancelAnimationFrame(id);
            setEnter(false);
        };
    }, [open]);

    return open ? enter : false;
}
