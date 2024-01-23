# Hostore

![npm](https://img.shields.io/npm/v/hostore?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/hostore?style=flat-square)
![NPM](https://img.shields.io/npm/l/hostore?style=flat-square)
![npm](https://img.shields.io/npm/dy/hostore?style=flat-square)

简单、高效的 React hooks 状态管理方案。

## 安装

npm:

```bash
npm i hostore
```

yarn:

```bash
yarn add hostore
```

pnpm:

```bash
pnpm i hostore
```

## 示例

```tsx
import { useState } from "react";
import { createStore, useMethod } from "hostore";

// Create Store
const CounterStore = createStore(() => {
  const [count, setCount] = useState(0);
  // Return constant function reference
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
  // Consume store
  // const { count } = CounterStore.useStore();
  // Only rerender when selected value changed
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
  // Wrapper child components and provide store
  return (
    <CounterStore.Provider>
      <Child1 />
      <Child2 />
      <Child3 />
    </CounterStore.Provider>
  );
};

export default App;
```

## API

### `createStore(useHook)`

传入一个自定义 `Hook`，创建一个 `Store` 对象。

```tsx
import { useState } from "react";
import { createStore } from "hostore";

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
```

### `<Store.Provider>`

提供 `Store`。

```tsx
const App = () => {
  return (
    <CounterStore.Provider>
      <Child1 />
      <Child2 />
      <Child3 />
    </CounterStore.Provider>
  );
};
```

### `<Store.Provider props>`

提供 `Store`，并设置参数 `props`。

```tsx
const CounterStore = createStore((props: { initialCount: number }) => {
  const [count, setCount] = useState(props.initialCount);
  // ...
});

const App = () => {
  return (
    <CounterStore.Provider props={{ initialCount: 0 }}>
      <Child1 />
      <Child2 />
      <Child3 />
    </CounterStore.Provider>
  );
};
```

### `Store.useStore(selector)`

消费 `Store`。当 `Store` 的值变化，触发组件的 `rerender`。

```tsx
const Child = () => {
  const { count } = CounterStore.useStore();
  return <div>{count}</div>;
};
```

### `Store.useStore(selector)`

消费 `Store`，并传入 `selector` 筛选函数。只有当筛选的值发生变化时，才会触发组件的 `rerender`。

```tsx
const Child = () => {
  const count = CounterStore.useStore((value) => value.count);
  // Only rerender when count value changed
  return <div>{count}</div>;
};
```

### `useMethod(callback)`

传入一个函数，返回一个恒定的函数引用（不需要传 `deps` 的 `useCallback`）。可以用来避免函数引用变更造成的无效重复渲染，以优化性能。

```tsx
// Return constant function reference
const increase = useMethod(() => {
  setCount((v) => v + 1);
});
```
