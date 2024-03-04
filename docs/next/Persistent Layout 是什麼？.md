# Persistent Layout 是什麼？

什麼是 persistent layout？簡單來說就是路由切換時，沒有變動的部分不會 re-render，讓 state 和頁面狀態 ( ex: 滾輪位置 ) 可以維持一樣。
App Router 中的 layout 可以分為 `Root Layou`t 和 `Regular Layout` 兩種:

## Root Layout

`Root Layout` 定義在 app/layout.tsx 檔案中,它是整個應用程序的最外層佈局。通常用來渲染像導航欄、頁尾等在所有頁面中都會 persistent 存在的部分。

```jsx title="app/layout.js"
export default function RootLayout({ children }) {
  return (
    <html>
      <head>{/* 頭部元數據 */}</head>
      <body>
        <header>{/* 全域導航欄 */}</header>
        {children}
        <footer>{/* 全域頁尾 */}</footer>
      </body>
    </html>
  );
}
```

注意事項：

- App Router 中一定要有至少一個 root layout ( 可以透過 route groups 來創造多個 root layout )。
- Root layout 中一定要包含` html` 和 `body` tags，因為 Next.js 不會自動生成
- 你可以自訂初始 HTML 檔案的內容，像是 `head` `title` 等
- Root layout 只能是 Server Component

## Regular Layout

`Regular Layout` 則是在不同路由層級下定義的佈局,用於渲染特定路由下的 persistent UI。

比如在 app/dashboard/layout.js 中可以為 /dashboard/\* 路由渲染側邊欄等。

```jsx title="app/dashboard/layout.js"
export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>{/* 僅 dashboard 路由下的側邊欄 */}</nav>
      <main>{children}</main>
    </div>
  );
}
```

注意事項：

- layout 預設會是巢狀的，意思是 `regular layout` 也會被以 children props 的形式傳到 root layout。

  以上方圖片為例，/dashboard 的子路由會同時吃到 `root layout` 和 `dashboard layout`。

- Regular layout 中不能使用 `head` 和 `body` tag。

`Root Layout` 和 `Regular Layout` 的區別在於作用範圍的大小。

`Root Layout` 作用於整個應用程序，而 `Regular Layout` 只作用於特定的路由分支。
