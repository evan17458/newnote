# App Router 路由切換：`<Link>` & useRouter

使用官方 API 提供的 `<Link>` **component** 和 **useRouter()** hook：

## 被動路由切換 - Link Component

`<Link>` 的概念類似 html 裡面的 `<a>` tag，但額外增加了 **prefetching** 和 client-side **navigation** 的功能。

這樣做的優點是什麼呢？在支援 JS 的環境，Next 可以利用 JS 更新 DOM 來達成 soft navigation 的頁面跳轉效果；在無法使用 JS 的環境，像是部分搜尋引擎爬蟲，則可以透過 `<a>` tag 的 href 來跳轉頁面。可以同時兼顧 SEO 和使用者體驗。

`<Link>` 使用方法很簡單，只需從 next/link import `<Link>` 並在 href prop 中帶入目的地的路徑：

```jsx title=""
import Link from "next/link";

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>;
}
```

href 中也可以帶 template literals 來連接動態路由：

```jsx title=""
import Link from "next/link";

export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

路由切換時，頁面滾輪位置預設會是在最上方。假如我們希望路由切換時，頁面自動可以滾到某個 element 的位置，我們可以比照 `<a>` tag 的做法，在 href 的 path 後加入 #[id]：

```jsx title=""
<Link href="/dashboard#settings">Settings</Link>
```

假如網址要帶 query string，我們可以傳一個 object 到 href：

```jsx title=""
"use client";
import Link from "next/link";

export default function Test() {
  return (
    <Link
      href={{
        pathname: "/about",
        query: { name: "test" },
      }}
    >
      Visit About
    </Link>
  );
}
```

這時點擊 Visit About，就會拜訪 /about?name=test。

Link Component 細節設定

除了 href 以外，`<Link>` 還有另外三個 props 可以讓你做 navigation 的細節設定。

- replace
  **決定路由變換後，要不要取代目前瀏覽紀錄**。 預設為 false，意思是拜訪新頁面時，`next/link` 會在瀏覽器的 history stack 中加一個新的 URL；假如設為 true，則會取代掉目前的 URL。

  例子：

  假如 replace 為 false，我們從 /about 進到 /profile，再進到 /settings，打開瀏覽紀錄，會看到多兩筆紀錄，網址分別指向 /profile 和 /settings；但假如 replace 為 true 時，你只會看到一筆紀錄，網址指向 /settings。

```jsx title=""
import Link from "next/link";

export default function Page() {
  return (
    <Link href="/dashboard" replace>
      Dashboard
    </Link>
  );
}
```

- scroll
  **決定路由變換後頁面滾輪的位置**。 預設為 true，意思是進到一個新頁面時，滾輪會回到最上方。假如使用回到上下頁，則會在上次滾到的位置。

假如 scroll 設為 false 時，進到新頁面滾輪會維持在相同位置，不會回到最上方。

```jsx title=""
import Link from "next/link";

export default function Page() {
  return (
    <Link href="/dashboard" scroll={false}>
      Dashboard
    </Link>
  );
}
```

- prefetch

**決定 `<Link>` 連結的頁面要不要 prefecth**。 預設為 true，但只有在 production stage 會有效果。

App Router 架構下，Next 會自動在 server-side 依據 route segments 做 code splitting，所以當使用者進到某個頁面時，server 只會回傳該頁面相關的程式碼。假如頁面有使用到 `<Link>`，Next 預設會 prefetch `<Link>` 連結的 route segments，**提前載入該 route segments 的內容，降低使用者在切換 route 時的延遲**

舉例來說，我的首頁包含兩個 `<Link>`，分別連到 /shop 和 /profile：

```jsx title=""
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/shop">Go to shop</Link>
      <Link href="/profile">Go to profile</Link>
    </div>
  );
}
```

部署後，進到首頁打開開發者工具的 Network tab，可以發現 /shop 和 /profile 的內容也提前下載了。

假如不希望 prefetch，將 Link 的 prefetch props 設為 false 即可：

```jsx title=""
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/shop" prefetch={false}>
        Go to shop
      </Link>
      <Link href="/profile">Go to profile</Link>
    </div>
  );
}
```

補充一個踩雷經驗，曾經碰到一個案例是，首頁 side bar viewport 約一次會顯示 20 個 `<Link>`，每個`<Link>` 前往的頁面都有一個 middleware 會在 request 完成前打一支 API 處理 cookies。

原本應該是點擊 `<Link>` ，路由切換時才會打這支 API，但因為 `<Link>` 預設 prefetching，所以使用者一進到首頁就會打 20 次 API，往下滑 side bar 就會繼續一直打。這時就要將 `prefetch` 改為 false

- prefetch
  如果想主動切換路由，比如說我希望用戶輸入「回到首頁」後，會 redirect 到首頁。這時可以使用 `useRouter` 的 `push` method

```jsx title=""
'use client';
import { useRouter } from 'next/navigation';

export default Page() =>{
  const router = useRouter();

   handleInput(e)=> {
    const inputValue = e.target.value;
    inputValue === '回到首頁' && router.push('/');
  }

  return <input onChange={handleInput} />;
}

```

除了 push 以外，假如想調整歷史紀錄和 prefetch 設定，可以使用 `router.replace()` 和 `roouter.prefetch()` 兩個 methods；假如想回到上 / 下頁，可以用 `router.back()` 和 `router.forward()`

幾個小提醒：

- 假如使用 App Router，useRouter 要從 `next/navigation` 而不是 `next/router` import，不然會跳 NextRouter was not mounted. 的報錯。

- useRouter 預設不會 prefetch，假如希望 pretch 要使用 `router.prefetch()`。

- 假如頁面含有動態渲染元素 ( 需要依照 request 渲染 html )，只有 layout 和 loading UI 會被 prefetched。
