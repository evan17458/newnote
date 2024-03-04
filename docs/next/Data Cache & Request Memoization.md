# Data Cache & Request Memoization

我們可以大致依據快取拜訪的時機，和影響範圍分為四種機制。
Scope 有小到大依序為 `Data Cache`、`Request Memoization`、`Full Route Cache`、`Router Cache`。

運作機制簡單來說，當 request 進來後，Next 會逐層查看快取有沒有可用資料，沒有就往下層找，
假如都沒有快取才向 `data source` 拿資料，拿到後再逐層建立快取

## Data Cache

Next 預設會快取 server data fetching，從 `data source` 取得的結果，

當下次有相同 request 進來時，就不用再到 `data source` 拿資料，可以直接從快取拿。

## 禁用 Data Cache

```jsx title=""
export const getMessage = async () => {
  const response = await fetch("http://localhost:3000/api/hello", {
    cache: "no-store", // 禁用快取
  });
  return await response.json();
};
```

## 重置 Data Cache

假如想要重製 Data Cache，有兩種方式：

`固定時間重置`

`主動觸發重置`

- 固定時間重置

假如資料相對固定，不須頻繁重置 Data Cache，可以使用 `next.revalidate` option

在固定時間重置 Data Cache，比方說設定兩秒後重置：

```jsx title=""
export const getMessage = async () => {
  const response = await fetch("http://localhost:3000/api/bbbb", {
    next: { revalidate: 2 },
  });
  return await response.json();
};
```

所以在 revalidation 期間收到 request，Next 都會 return 快取版本；
假如過了 `revalidation` 時間，Next 依舊會先 return 快取版本，
接著再重新 fetch 資料並將結果存快取，下次 request 就會拿到新版本。

- 主動觸發重置

假如想主動觸發 `revalidation`，可以使用`revalidatePath` 或 `revalidateTag`。

兩個 function 可以用在 Route Hanlder 或 Server Actions 中。

我們來嘗試在 /welcome 加一個按鈕，點擊後會觸發 `revalidatePath`：

```jsx title=""
import { revalidatePath } from "next/cache";

const revalidate = async () => {
  "use server";
  revalidatePath("/welcome");
};

export default async function Page() {
  return (
    <>
      <form action={revalidate}>
        <button type="submit">Revalidate</button>
      </form>
    </>
  );
}
```

## Request Memoization
