# App Router 是什麼？

`App Router` 和 `Pages Router` 有以下幾個主要區別:

## 路由結構

`Pages Router` 的扁平結構

路由結構是基於檔案系統的扁平結構。每個頁面級別的路由對應一個 React 組件檔案,存放在 pages 目錄下。例如:

```jsx title=""
pages/
   index.js    --> 對應 "/" 路由
   about.js    --> 對應 "/about" 路由
   blog/
      index.js --> 對應 "/blog" 路由
      [slug].js --> 對應 "/blog/:slug" 路由

```

`App Router` 的巢狀路由結構

採用了更類似於傳統網站的基於資料夾的巢狀路由結構。路由對應於 app 目錄下的資料夾和頁面組件檔案。例如:

```jsx title=""
app/
   page.js     --> 對應 "/" 路由
   about/
      page.js  --> 對應 "/about" 路由
      team/
         page.js --> 對應 "/about/team" 路由
   blog/
      [slug]/
         page.js --> 對應 "/blog/:slug" 路由

```

在這種架構下,子路由是通過資料夾巢狀關係建立的,更符合網站層級關係的直覺感受。同時也方便共享組件、佈局和中介件等功能。

這種巢狀結構使得 App Router 在處理巢狀路由、分層導航和父子關係等方面具有天生的優勢,簡化了複雂網站結構的開發。但也需要開發者適應新的路由組織方式。

## 渲染策略

`Pages Router` 所使用的是 React 傳統的客戶端渲染(CSR)和服務器渲染(SSR)模式。

- 客戶端渲染(CSR)是指初始頁面由服務器發送基本的 HTML/JS 架構,接著由客戶端 JS 繼續渲染剩餘組件。這種模式具有較佳的首次加載性能,但頁面導航會有額外的客戶端渲染開銷。
- 服務器渲染(SSR)則是在服務器端完全渲染好頁面的 HTML,發送給客戶端,客戶端只需附加少量事件處理即可。這種模式更適合 SEO,但首次加載時間可能略長。
  這兩種模式都會導致整個頁面在切換時重新渲染。

`App Router` 則預設使用 React 18 中引入的全新 React Server Components 架構進行渲染。它主要有以下特點:

- **雙引擎渲染**：結合客戶端和服務器端渲染的優點,實現流暢的交互和更好的 SEO。
- **部分渲染和延遲加載**：通過組件分拆,只有改變的部分會重新渲染。同時可以延遲加載低優先級的組件,提升性能。
- **Suspense 數據獲取**：基於 Suspense 實現無阻塞的數據並行獲取,防止渲染鎖死。
- **流式渲染**：頁面內容可以分多個流進行增量傳輸渲染,提升加載體驗。

## 資料獲取

`Pages Router`中,資料獲取主要依賴兩種方法:

`getStaticProps`

- 用於靜態網站生成(SSG)
- 在建置時從外部 API 獲取數據,並將其序列化到 HTML 中
- 適合不常更新的靜態內容場景

`getServerSideProps`

- 用於服務器端渲染(SSR)
- 在每次請求時從外部 API 獲取最新數據
- 適合需要最新內容的動態場景

`App Router`則提供了更靈活強大的資料獲取方式:

`fetch函數`

- 類似瀏覽器 fetch API,用於從外部獲取數據
- 可在任何 UI 組件中調用,實現細粒度的按需資料獲取
- 支援 Suspense,可優雅地處理異步載入狀態

`緩存API`

- 通過緩存響應獲得更佳的資料重用性
- 內置緩存規範控制頁面和資料的緩存行為
- 可有效減少不必要的外部請求,提升性能

## 導航

`pages Router` - 傳統鏈接和導航

導航主要依賴傳統的連結組件 Link 和 Router API。

- `Link` 組件用於在客戶端渲染連結,避免 whole page reload。
- `Router` 物件提供了一些導航方法,如 `push`、`replace` 等操作路由堆疊。

這種導航方式相對簡單直接,但功能有限,無法處理像巢狀佈局那樣複雂的需求。每個頁面只能獨立地渲染和導航。

`App Router` - 巢狀導航和分層佈局

`巢狀導航`

- 利用資料夾結構天生支援巢狀路由
- 可以在任何資料夾層級定義導航連結和 navigation 物件
- 支援在父級定義子路由間的相對導航

`分層佈局`

- 可以透過 layout.js 為不同路由層級定義共享佈局
- 佈局可重複嵌套使用,輕鬆實現複雜 UI 結構
- 改進的`Link`組件會自動套用父級佈局

`路由群組`

- (folder).js 可將同層級路由分組,簡化導航
- 支援路由分組級別的導航和佈局

這種設計使得 App Router 在構建大型、複雗網站時更具優勢,能夠輕鬆管理好巢狀路由、導航和佈局等需求,提高了開發體驗和代碼組織性。

## 元數據處理

`Pages Router`中,元數據如標題、描述、favicons 等是通過在每個頁面組件中使用 React `Head`組件來定義的。

例如在 pages/about.js 中:

```jsx title=""
import Head from "next/head";

function AboutPage() {
  return (
    <>
      <Head>
        <title>About Page</title>
        <meta name="description" content="This is the about page" />
      </Head>
      {/* 頁面內容... */}
    </>
  );
}
```

這種方式允許靈活地為每個頁面自定義元數據,但缺點是無法輕易共享和管理。隨著頁面數量增加,可能會導致代碼重複和維護成本增高。

`App Router`中,所有路由的元數據都集中在一個`metadata.js`文件中統一定義和導出。

例如在 app/about/metadata.js 中:

```jsx title=""
export const metadata = {
  title: "About Page",
  description: "This is the about page",
};
```

Next.js 會自動從對應路由下尋找 metadata.js 並提取元數據應用到頁面中。

這種集中式管理元數據的方式有幾個優點:

- 代碼結構更清晰,元數據與頁面內容分離
- 方便元數據的共享和重用,避免重複定義
- 更好的可擴展性,未來可能支持更多元數據選項

但缺點是失去了一些靈活性,如需動態設置頁面標題就需要額外處理。

總的來說,App Router 的元數據管理方式更有利於代碼組織和維護,更適合大型項目。

## 靜態檔案處理

`Pages Router` - public 目錄

在`Pages Router`中,所有靜態文件如圖片、字體、視頻等都需要放置在專門的`public`目錄下。

```jsx title=""
public / images / logo.png;
```

然後在頁面組件中可以這樣引用:

```jsx title=""
import Image from "next/image";

export default function HomePage() {
  return (
    <div>
      <Image src="/images/logo.png" />
    </div>
  );
}
```

App Router - app 內部目錄

而在 App Router 中,靜態文件不再放在單獨的 public 目錄,而是直接與頁面組件放在同一個 app 目錄結構下。

例如:

```jsx title=""
app / page.js;
static / images / logo.png;
fonts / roboto.ttf;
```

在組件中引用也更直觀:

```jsx title=""
import Image from "next/image";

export default function HomePage() {
  return (
    <div>
      <Image src="/static/images/logo.png" />
    </div>
  );
}
```

Next.js 會自動為 app 內 static 子目錄及其子目錄下的靜態資源提供服務。

這種設計使得靜態資源與對應的組件更緊密，有利於代碼組織和共享。
