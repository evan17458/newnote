# Zustand 教學

## 為什麼要用 Zustand?

- **非常輕量**：對比社群上高人氣的狀態管理套件 redux、recoil、mobx，動輒 2 ~12 MB 不等，Zustand 僅有不到 400 KB 的大小

- **不需要 `Provider` 包覆即可使用**：以 NextJs 為例，v13 以下由於並沒有 server component 和 client component 的切分，所以當使用 Redux 時為了解決 `SSR` 初始化及 `hydration` 的問題，需要搭配 `next-redux-wrapper` 使用；而雖然 v13 以上可以透過在 server component 引入含有 provider 的 client component，但任何行為都還是需要在 provider 的 children 中才能使用

- **使用及設置方法簡潔**：例如下方的使用方法，不需要設定 `reducer action` 或是 `context`，直接建立一個 custom hook ，即可在應用程式中調用

- **快速且提高效能**：以 `react context` 為例，在組件中取得 state 時，是將 context 中定義的 state 全部回傳，其中若有未使用到的 state 更新時，其他有調用 context 的 component 都會 `re-render`，而 `Zustand` 可以藉由設置 selector 僅回傳該 component 需要的 state，範例如下：

```jsx title=""
const bears = useCountStore((store) => store.bears);
```

如此一來 store 中其他 state 更新也不會影響到使用 bears 的 component 了!

## 使用方法

```jsx title=""
import create from "zustand";

const useCountStore = create((set, get) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));
```

## Create

使用 **create** 建立一個 zustand store hook，並且回傳 set 及 get function 可對 state 做操作

## state

上方範例的 bears，在 zustand 的世界中可以將多個 state 包成一個 object，也可以直接設置多個 state
包成一個 object:

```jsx title=""
countes: {
bears: 0,
fishes: 0,
fruits: 0
},
increasePopulation: () =>
set((state) => ({
  ...state,
  countes: { ...state.countes, bears: state.countes.bears + 1 }
})),
removeAllBears: () => set({ bears: 0 })
```

## get

在設定 action 時可以取得當前狀態的功能。

```jsx title=""
const currentBears = get().bears;
```

## set

用於更新狀態。可以接受一個新的 state 物件，或是一個 callback function，callback function 接收當前狀態 (也就是舊的狀態) 作為其唯一參數，並回傳一個新的狀態物件。

假設 state 是

```jsx title=""
bears:0,
fishes:0,
fruits:0
```

直接回傳想要更新的狀態物件

```jsx title=""
set({ bears: 1 });
```
