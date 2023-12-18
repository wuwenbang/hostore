import { useState } from "react";
import { createStore } from "hook-store";

// create a store with custom hook
const CounterStore = createStore(() => {
  const [count, setCount] = useState(0);
  const increase = () => {
    setCount((v) => v + 1);
  };
  const decrease = () => {
    setCount((v) => v - 1);
  };
  return {
    count,
    increase,
    decrease,
  };
});

const App = () => {
  // wrap children components by Store.Provider
  return (
    <CounterStore.Provider>
      <Child1 />
      <Child2 />
      <Child3 />
    </CounterStore.Provider>
  );
};

const Child1 = () => {
  // get state by Store.useStore
  const { count } = CounterStore.useStore();
  console.log("Child1");
  return <div>{count}</div>;
};
const Child2 = () => {
  // get method by Store.useStore
  const { increase } = CounterStore.useStore();
  console.log("Child2");
  return <button onClick={increase}>increase</button>;
};
const Child3 = () => {
  // get method by Store.useStore
  const { decrease } = CounterStore.useStore();
  console.log("Child3");
  return <button onClick={decrease}>decrease</button>;
};

export default App;
