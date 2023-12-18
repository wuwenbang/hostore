import React, { useState } from "react";
import { createStore, useMethod } from "hook-store";

const CounterStore = createStore(() => {
  const [count, setCount] = useState(0);
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

const Child1 = () => {
  const count = CounterStore.useStore((value) => value.count);
  console.log("Child1");
  return <div>{count}</div>;
};

const Child2 = () => {
  const increase = CounterStore.useStore((value) => value.increase);
  console.log("Child2");
  return <button onClick={increase}>increase</button>;
};

const Child3 = () => {
  const decrease = CounterStore.useStore((value) => value.decrease);
  console.log("Child3");
  return <button onClick={decrease}>decrease</button>;
};

const App = () => {
  return (
    <CounterStore.Provider>
      <Child1 />
      <Child2 />
      <Child3 />
    </CounterStore.Provider>
  );
};

export default App;
