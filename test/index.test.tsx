import React, { render, fireEvent } from "@testing-library/react";
import { useRef, useState } from "react";
import { createStore, useEvent } from "../src";

const CounterStore = createStore(({ initialCount = 0 }: { initialCount: number }) => {
  const [count, setCount] = useState(initialCount);
  const increase = useEvent(() => {
    setCount((v) => v + 1);
  });
  const decrease = useEvent(() => {
    setCount((v) => v - 1);
  });
  return {
    count,
    increase,
    decrease,
  };
});

test("useStore", () => {
  const Child1 = () => {
    const { count } = CounterStore.useStore();
    return <div>Count: {count}</div>;
  };
  const Child2 = () => {
    const { increase } = CounterStore.useStore();
    return <button onClick={increase}>Increase</button>;
  };
  const Child3 = () => {
    const { decrease } = CounterStore.useStore();
    return <button onClick={decrease}>Decrease</button>;
  };
  const App = () => {
    return (
      <CounterStore.Provider props={{ initialCount: 0 }}>
        <Child1 />
        <Child2 />
        <Child3 />
      </CounterStore.Provider>
    );
  };
  const { getByText } = render(<App />);
  expect(getByText("Count: 0")).toBeDefined();
  fireEvent.click(getByText("Increase"));
  expect(getByText("Count: 1")).toBeDefined();
  fireEvent.click(getByText("Decrease"));
  expect(getByText("Count: 0")).toBeDefined();
});

test("useStore with selectors", () => {
  const Child1 = () => {
    const count = CounterStore.useStore((state) => state.count);
    return <div>Count: {count}</div>;
  };
  const Child2 = () => {
    const ref = useRef(0);
    ref.current++;
    const increase = CounterStore.useStore((state) => state.increase);
    return (
      <div>
        <span>Increase render count: {ref.current}</span>
        <button onClick={increase}>Increase</button>
      </div>
    );
  };
  const Child3 = () => {
    const ref = useRef(0);
    ref.current++;
    const decrease = CounterStore.useStore((state) => state.decrease);
    return (
      <div>
        <span>Decrease render count: {ref.current}</span>
        <button onClick={decrease}>Decrease</button>
      </div>
    );
  };
  const App = () => {
    return (
      <CounterStore.Provider props={{ initialCount: 0 }}>
        <Child1 />
        <Child2 />
        <Child3 />
      </CounterStore.Provider>
    );
  };
  const { getByText } = render(<App />);
  expect(getByText("Count: 0")).toBeDefined();
  fireEvent.click(getByText("Increase"));
  expect(getByText("Count: 1")).toBeDefined();
  fireEvent.click(getByText("Decrease"));
  expect(getByText("Count: 0")).toBeDefined();
  expect(getByText("Increase render count: 1")).toBeDefined();
  expect(getByText("Decrease render count: 1")).toBeDefined();
});

test("useEvent", () => {
  const App = () => {
    const [, setState] = useState({});
    const callback = useEvent(() => {
      setState({});
    });
    const lastCallback = useRef(callback).current;
    const isRefEqual = lastCallback === callback ? "true" : "false";
    return (
      <div>
        <span>{isRefEqual}</span>
        <button onClick={callback}>Update</button>
      </div>
    );
  };
  const { getByText } = render(<App />);
  fireEvent.click(getByText("Update"));
  expect(getByText("true")).toBeDefined();
});
