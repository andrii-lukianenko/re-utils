import type { RefObject } from 'react';
import { useEffect } from 'react';

export const useClickOutside = (
    ref: RefObject<HTMLElement> | null,
    handler: (event: MouseEvent | TouchEvent) => void,
    shouldAttach = true,
): void => {
    useEffect(() => {
        if (!shouldAttach) {
            return;
        }

        const listener = (event: MouseEvent | TouchEvent): void => {
            if (!ref?.current || ref.current.contains(event.target as HTMLElement)) {
                return;
            }

            handler(event);
        };

        document.addEventListener('mousedown', listener, false);
        document.addEventListener('touchstart', listener, { passive: true });

        return (): void => {
            document.removeEventListener('mousedown', listener, false);
            document.removeEventListener('touchstart', listener, false);
        };
    }, [shouldAttach, ref, handler]);
};
