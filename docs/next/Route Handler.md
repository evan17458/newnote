## Route Handler

`Route Handler` 等同 `Pages Router` 中的 `API Router`，顧名思義，我們可以將路由定義成 `API endpoint`，來處理 HTTP `request` 和 `response`。

要如何創建 `route handler` 呢？

我們只需要在 **`/app`** 中的資料夾，建一個 **`route.ts/js`** 即可，路由定義的模式跟 **`page.tsx**` 相同，也可以使用巢狀、動態路由。

舉例來說，**`/app/api/products/route.ts`** 即會對應 /api/products 這支 API；

**`/app/new_api/profile/route.ts**`/ 即會對應 /new_api/profile 這支 API。

但一個資料夾中不能同時有 **`/route.ts**`/ 和 **`/page.tsx\*\*`/。

不然就會吃不到 Page，並跳出 **`/Conflicting route and page**`/ 的報錯。

Route handler 支援 **`/GET、POST、PUT、PATCH、DELETE、HEAD、OPTIONS**`/ 七種 HTTP methods，

假如使用這七種以外的 methods，Next 會 **`/return 405 Method Not Allowed**`/。

要使用哪個 method，就以該 method 當作 export function 的名稱。比方說：

```jsx title=""
/* app/api/products/route.ts */
export function GET() {
…
}
export function POST(){
…
}
```

API request 和 response，可以使用 Fetch API 的 Request 和 Response 物件：

```jsx title=""
/* app/api/hello/route.ts */
export function GET() {
  return Response.json({ message: "Hello World!" });
}
```

這時候打 http://localhost:3000/api/hello 這支 API ( GET )，就可以得到

```jsx title=""
{
  "message": "Hello World!"
}
```

除了可使用 Fetch API 原生的 `Request` 和 `Response` 物件外，

`Next` 也有擴充兩者，開發一個 methods 更多的物件 - **`/NextRequest`** 和 **`/NextResponse`**
