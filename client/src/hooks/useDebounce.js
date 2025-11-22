import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for debouncing values
 * Delays updating the value until after a specified delay
 */
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Custom hook for debouncing callbacks
 * Delays executing the callback until after user stops calling it
 */
export const useDebouncedCallback = (callback, delay = 500) => {
    const timeoutRef = useRef(null);

    const debouncedCallback = useCallback(
        (...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
};

/**
 * Custom hook for throttling callbacks
 * Limits how often a function can be called
 */
export const useThrottle = (callback, delay = 500) => {
    const lastRan = useRef(Date.now());

    const throttledCallback = useCallback(
        (...args) => {
            const now = Date.now();
            
            if (now - lastRan.current >= delay) {
                callback(...args);
                lastRan.current = now;
            }
        },
        [callback, delay]
    );

    return throttledCallback;
};
