# next/dynamic 教學

## Next 預設的 Code Splitting

ext 預設會在 build-time 時，以`路由為單位`做 code splitting。

比方說，我們的 app 資料夾中的結構為：

```jsx title=""
├── dashboard
│   ├── page.tsx
│   └── settings
│       └── page.tsx
├── shop
│   └── page.tsx
├── layout.tsx
├── page.tsx
└── profile
    └── page.tsx
```

run build 完，到 /.next/static/chunks/app 中可以看到會有 dashboard、profile、shop 三個資料夾，/dashboard 裡會有一個 settings 資料夾，資料夾裡各有一個 page-xxxx.js 檔案。
