# React-Hook-Form 教學

## 為什麼要用 React-Hook-Form？

- 簡潔的 API,容易上手。能夠使用順暢的 React Hooks 為表單添加驗證邏輯。
- 性能優秀。使用非控制組件,避免不必要的重新渲染。支持懶性驗證等優化。
- 與組件庫無耦合。可以和任何 UI 組件庫結合使用,`Material-UI`、`AntD` 等。
- 強大的驗證能力。支持複雜驗證和異步驗證,錯誤處理友好。
- 遵循 React 最佳實踐。比如表單提交時不直接操作 DOM。
- 輕量級。只有約 7kB 的大小(gzipped)。

## `useForm` options 屬性

useForm 是操作整個表單管理的主要 hook，可以傳遞 options 設定並回傳各種操作 function，首先介紹 options 的屬性：

- **defaultValues**: 指定表單欄位的預設值。如果表單是修改模式需要預設帶原始數據，可以將變數設定在這個屬性中，如下方範例。

- **values**：當外部狀態或資料變更時，自動更新表單的值。

- **shouldFocusError**: 當驗證失敗時，這將自動將焦點設定到產生錯誤的第一個欄位。預設 true

- **mode**: 指定驗證模式，例如 `onChange`, `onBlur`, `onTouched`, `onSubmit` 或 `all`。預設是 `onSubmit`。

- **reValidateMode**: 指定重新驗證的模式。可選擇 `onChange`, `onBlur` 或 `onSubmit` ，預設是 `onChange` 。

- **resetOptions**：當 `values` 或 `defaultValues` 被更新時，內部會呼叫 reset API，預設是重置表單的值，但可以額外設定 `keepDirtyValues` 及 `keepErrors` ，例如：希望保留使用者所互動的/已更改的值，並且不移除任何錯誤標示。

- **shouldUnregister**：定義已經 `unmoun`t 的欄位是否應該從表單中取消註冊。預設為 false。若設為 true ，則當輸入元件從 DOM 中被移除，其值也會從 react-hook-form 的內部狀態中被移除。

- **criteriaMode**: 決定是否回傳所有的錯誤。`firstError` 為預設，僅回傳第一個錯誤；`all` 則是回傳所有錯誤。

- **shouldFocusError**: 提交表單後，如果有錯誤，將 focus 移到該錯誤上。預設是 true

- **shouldUseNativeValidation**：使否使用瀏覽器原生的驗證，預設為 false

## 範例

```jsx title=""
const form =
  useForm <
  FieldValues >
  {
    defaultValues: {
      id: item?.id || "",
      title: item?.title || "",
      url: item?.url || "",
      type: item?.type || { id: "default", label: "請選擇" },
      order: item ? index : lastItemOrder + 1,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
    criteriaMode: "all",
    mode: "onChange",
  };
```

## `useForm` 回傳功能

包括 register, formState, watch, handleSubmit, reset 等表單操作功能

## register

在 React-Hook-Form 中註冊 input 或 selector 元素，並附加驗證規則。所有的驗證規則都依循 HTML 標準，同時也支持自定義驗證方法。
