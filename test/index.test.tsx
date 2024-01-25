import React, { render, fireEvent } from "@testing-library/react";
import { useRef, useState } from "react";
import { createStore, useMethod } from "../src";

export const CounterStore = createStore(({ initialCount = 0 }: { initialCount: number }) => {
  const [count, setCount] = useState(initialCount);
  const increase = useMethod(() => {
    setCount((v) => v + 1);
  });
  const decrease = useMethod(() => {
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
    return <div>{count}</div>;
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
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Increase"));
  expect(getByText("1")).toBeDefined();
  fireEvent.click(getByText("Decrease"));
  expect(getByText("0")).toBeDefined();
});

test("useStore with selectors", () => {
  const Child1 = () => {
    const count = CounterStore.useStore((state) => state.count);
    return <div>{count}</div>;
  };
  const Child2 = () => {
    const increase = CounterStore.useStore((state) => state.increase);
    return <button onClick={increase}>Increase</button>;
  };
  const Child3 = () => {
    const decrease = CounterStore.useStore((state) => state.decrease);
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
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Increase"));
  expect(getByText("1")).toBeDefined();
  fireEvent.click(getByText("Decrease"));
  expect(getByText("0")).toBeDefined();
});

test("useMethod", () => {
  const App = () => {
    const [, setState] = useState({});
    const callback = useMethod(() => {
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