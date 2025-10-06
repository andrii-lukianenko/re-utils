import { renderHook, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  let mockHandler: jest.Mock;
  let element: HTMLDivElement;

  beforeEach(() => {
    mockHandler = jest.fn();
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
    jest.clearAllMocks();
  });

  it('calls handler when clicking outside the element', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return ref;
    });
    
    // Assign the ref to our test element
    (result.current as any).current = element;

    // Click outside the element
    fireEvent.mouseDown(document.body);

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(expect.any(MouseEvent));
  });

  it('does not call handler when clicking inside the element', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return ref;
    });
    
    // Assign the ref to our test element
    (result.current as any).current = element;

    // Click inside the element
    fireEvent.mouseDown(element);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('does not call handler when element ref is null', () => {
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return ref;
    });

    // Click anywhere
    fireEvent.mouseDown(document.body);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('handles touchstart events', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return ref;
    });
    
    // Assign the ref to our test element
    (result.current as any).current = element;

    // Touch outside the element
    fireEvent.touchStart(document.body);

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(expect.any(TouchEvent));
  });

  it('does not attach listeners when shouldAttach is false', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler, false);
      return ref;
    });

    expect(addEventListenerSpy).not.toHaveBeenCalled();
    addEventListenerSpy.mockRestore();
  });

  it('attaches listeners when shouldAttach is true', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler, true);
      return ref;
    });

    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), false);
    expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: true });
    addEventListenerSpy.mockRestore();
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return ref;
    });
    
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), false);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), false);
    
    removeEventListenerSpy.mockRestore();
  });

  it('updates handler when it changes', () => {
    const newHandler = jest.fn();
    
    const { result, rerender } = renderHook(
      ({ handler }) => {
        const ref = useRef<HTMLDivElement>(null);
        useClickOutside(ref, handler);
        return ref;
      },
      { initialProps: { handler: mockHandler } }
    );
    
    // Assign the ref to our test element
    (result.current as any).current = element;

    // Click outside with original handler
    fireEvent.mouseDown(document.body);
    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(newHandler).not.toHaveBeenCalled();

    // Update the handler
    rerender({ handler: newHandler });

    // Click outside with new handler
    fireEvent.mouseDown(document.body);
    expect(mockHandler).toHaveBeenCalledTimes(1); // Still 1 from before
    expect(newHandler).toHaveBeenCalledTimes(1);
  });

  it('handles clicking on child elements', () => {
    const childElement = document.createElement('span');
    element.appendChild(childElement);
    
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return ref;
    });
    
    // Assign the ref to our test element
    (result.current as any).current = element;

    // Click on child element (should not trigger handler)
    fireEvent.mouseDown(childElement);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('handles null ref parameter', () => {
    renderHook(() => {
      useClickOutside(null, mockHandler);
    });

    // Click anywhere - should not call handler since ref is null
    fireEvent.mouseDown(document.body);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('handles touchstart event when clicking inside element', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return ref;
    });
    
    // Assign the ref to our test element
    (result.current as any).current = element;

    // Touch inside the element - should not trigger handler
    fireEvent.touchStart(element);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('detaches listeners when shouldAttach changes from true to false', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { result, rerender } = renderHook(
      ({ shouldAttach }) => {
        const ref = useRef<HTMLDivElement>(null);
        useClickOutside(ref, mockHandler, shouldAttach);
        return ref;
      },
      { initialProps: { shouldAttach: true } }
    );
    
    // Assign the ref to our test element
    (result.current as any).current = element;

    // Change shouldAttach to false
    rerender({ shouldAttach: false });

    // Should have called removeEventListener when shouldAttach changed to false
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), false);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), false);
    
    removeEventListenerSpy.mockRestore();
  });

  it('handles events with null target', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return ref;
    });
    
    // Assign the ref to our test element
    (result.current as any).current = element;

    // Create a custom event with null target
    const customEvent = new MouseEvent('mousedown');
    Object.defineProperty(customEvent, 'target', { value: null });
    
    // Dispatch the event manually
    document.dispatchEvent(customEvent);

    // Should call handler when target is null (considered outside)
    expect(mockHandler).toHaveBeenCalledWith(customEvent);
  });
});