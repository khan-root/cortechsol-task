import { useRef } from 'react';

export const useDebounce = (callback: (...args: unknown[]) => Promise<unknown>, delay: number) => {
    const timer = useRef<NodeJS.Timeout | null>(null);

    return async (...args: unknown[]) => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        return new Promise((resolve) => {
            timer.current = setTimeout(async () => {
                const result = await callback(...args);
                resolve(result);
            }, delay);
        });
    };
};