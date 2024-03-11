# next-swagger-doc

https://github.com/jellydn/next-swagger-doc

## 先決條件

- Nextjs >= 9
- Node >= 18

This package reads your `JSDoc-annotated source code` on `NextJS API route` and generates an `OpenAPI (Swagger) specification`.

`nextjs` + `swagger-jsdoc` =`next-swagger-doc`

## Install

```jsx title=""
npm install next-swagger-doc

npm install swagger-ui-react
npm i --save-dev @types/swagger-ui-react

Try `npm i --save-dev @types/swagger-ui-react` if it exists or add a new declaration (.d.ts) file containing `declare module 'swagger-ui-react';

```

## next-swagger-doc 與 Next.js 13

若要與您的 Next.js 13 專案合併 `next-swagger-doc`，請依照下列步驟操作。

此設定將根據您的程式碼為您的 API 產生 Swagger 文檔，並提供用於查看文檔的內建 Swagger UI。

### 建立 Swagger 規範

建立一個新文件 `lib/swagger.ts`。

此檔案使用該 `next-swagger-doc` 程式庫根據 Next.js 專案中的 API 路由建立 Swagger 規範。

```jsx title=""
import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next Swagger API Example",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
```

### 建立 Swagger UI 元件

生一個名為 的新檔案 `app/api-doc/react-swagger.tsx`
在此文件中，建立並匯出一個 React 元件，
該 `swagger-ui-react` 元件利用該程式庫根據提供的規格呈現 Swagger UI

```jsx title=""
"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

type Props = {
  spec: Record<string, any>,
};

function ReactSwagger({ spec }: Props) {
  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;
```

### 建立 API 文檔頁面

建立一個新文件`app/api-doc/page.tsx`。
此頁面匯入 `Swagger` 規格和 `Swagger UI` 元件以顯示 `Swagger` 文件。

```jsx title=""
import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./react-swagger";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
```

### 為 API 路由新增 Swagger 註釋

將 Swagger 註解新增至您的 API 路由`app/api/hello/route.ts`。
此註解包含有關 API 端點的元數據，該元資料將由`next-swagger-do`c
Swagger 規格讀取並包含在其中。

```jsx title=""
/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */
export async function GET(_request: Request) {
  // Do whatever you want
  return new Response("Hello World!", {
    status: 200,
  });
}
```

導航到 localhost:3000/api-doc（或託管 Next.js 應用程式的任何位置），
會看到 swagger UI。
