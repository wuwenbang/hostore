import {
  createContext,
  FC,
  memo,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
} from "react";

const useSafeEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function createStore<Value, Props = void>(useHook: (initialProps?: Props) => Value) {
  const Context = createContext<MutableRefObject<Value>>(undefined as unknown as MutableRefObject<Value>);
  const EventContext = createContext<Set<(value: Value) => void>>(undefined as unknown as Set<(value: Value) => void>);
  const Provider: FC<PropsWithChildren<{ initialProps?: Props }>> = memo(({ initialProps, children }) => {
    const value = useHook(initialProps);
    const ref = useRef(value);
    const events = useRef<Set<(value: Value) => void>>(new Set()).current;
    ref.current = value;
    events.forEach((event) => {
      event(value);
    });
    return (
      <Context.Provider value={ref}>
        <EventContext.Provider value={events}>{children}</EventContext.Provider>
      </Context.Provider>
    );
  });

  function useStore<SelectedValue = Value>(selector?: (value: Value) => SelectedValue): SelectedValue {
    const [, forceUpdate] = useReducer(() => ({}), {});
    const { current: value } = useContext(Context);
    const events = useContext(EventContext);
    const selectedValue = selector ? selector(value) : value;
    const storeValue = {
      value,
      selectedValue,
      events,
      selector,
    };
    const ref = useRef(storeValue);
    ref.current = storeValue;
    useSafeEffect(() => {
      const event = (nextValue: Value) => {
        const { current } = ref;
        if (current.value === nextValue) return;
        const nextSelectedValue = current.selector ? current.selector(nextValue) : nextValue;
        if (current.selectedValue === nextSelectedValue) return;
        setTimeout(() => {
          forceUpdate();
        });
      };
      ref.current.events.add(event);
      return () => {
        ref.current.events.delete(event);
      };
    }, []);
    return selectedValue as SelectedValue;
  }

  return { Provider, useStore };
}

export function useMethod<Args extends unknown[], Return>(fn: (...args: Args) => Return): (...args: Args) => Return {
  const ref = useRef(fn);

  useSafeEffect(() => {
    ref.current = fn;
  });

  return useCallback((...args: Args) => ref.current(...args), []);
}
