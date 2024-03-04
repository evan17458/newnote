# 如何建立 Next.js 13 專案

首先我們先來用 create-next-app 建一個 Next.js 專案：

```jsx title=""
npx create-next-app@latest
```

環境需求：

Node.js 16.14 版以上
支援作業系統：macOS、Windows ( 包含 WSL )、Linux

## What is your project named?

輸入專案名稱。須注意，名稱必須 URL friendly，意思是所有字符都必須是 ASCII subset 之一，所以只能輸入英文字母、數字、dash ( - )、底線 ( \_ )，不能輸入中文、空白等等。

除此之外，因為 npm 套件的規定，英文字母只能用小寫。有興趣了解緣由可以參考這個 issue。

(O)：myapp、my-app、my_app

(X)：my app、myApp、我的專案

## Would you like to use TypeScript? No / Yes

假如選 Yes，Next.js 就會自動幫你安裝所需的 packages 以及設定檔。

## Would you like to use ESLint? No / Yes

## Would you like to use Tailwind CSS? No / Yes

Next.js 13 更新內容中一大重點 - Server Components 目前並不支援 CSS-in-JS，所以假如習慣使用像是 `Styled-Components` 的讀者，在選擇 styling 工具時可將這點納入考量。

## Would you like to use "src/" directory? No / Yes

假如希望 /components、/lib、/utils 等資料夾不要放在根目錄，可以與設定檔 ( ex: package.json、next.config.js ) 隔開，可以選 Yes，在負責 routing 的 /app 或 /pages 外加一層 src 資料夾。

## Would you like to use App Router? (recommended) No / Yes

App Router 是 Next.js 13 推出的新的路由架構，提供了一系列能提升網頁效能和開發體驗的新功能

## Would you like to customize the default import alias? No / Yes

為了使 import 路徑能更直覺，Next.js 提供 “baseURL” 的設定讓開發者可以用絕對路徑的概念來 import modules。

直接來看官方提供的例子會更好理解：

```jsx title=""
// before
import { Button } from "../../../components/button";

// after
import { Button } from "@/components/button";
```

預設的 alias 是 `@`，如上面官方的範例；假如想自訂 alias，比方說 `@root`，這邊就選 Yes，並在下一題 What import alias would you like configured? 輸入 `@root/*`。

以相同的官方範例來說，Button 的 import 路徑就會改成：

```jsx title=""
// before
import { Button } from "@/components/button";

// after
import { Button } from "@root/components/button";
```

假如想修改 baseURL 和自訂匯入路徑，我們首先打開根目錄中的 tsconfig.json。在 compilerOptions 中找到 paths：

```jsx title=""
{
  "compilerOptions": {
    ...
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  ...
}
```

假如沒有自訂 import alias，你會看到`@/*`指向 `./src/* `這個路徑。所以假如想將 baseURL 改到 `/src/components`，就改一下 `@/*` 的 value：

```jsx title=""
{
  "compilerOptions": {
    ...
    "paths": {
      "@/*": ["./src/components/*"]
    }
  },
  ...
}
```

這時同樣以上述官方範例為例，Button 的匯入路徑就會改為：

```jsx title=""
// before
import { Button } from "@/components/button";

// after
import { Button } from "@/button";
```

假如想自訂匯入路徑，就在這邊加一個 key-value pair。比方說我新增一個路徑 `components/` 可以對應到 `./src/components/`：

```jsx title=""
{
  "compilerOptions": {
    ...
    "paths": {
      "@/*": ["./src/components/*"],
      "components/*": ["./src/components/*"]
    }
  },
  ...
}
```

官方範例的 Button 匯入路徑就可以改為：

```jsx title=""
// before
import { Button } from "@/components/button";

// after
import { Button } from "/components/button";
```
