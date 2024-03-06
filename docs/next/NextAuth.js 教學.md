# NextAuth.js 教學

## 為什麼要用 NextAuth.js?

- **簡化了認證流程** - 抽象化並簡化了複雜的認證邏輯,可以輕鬆地將許多的認證提供者(如 Google、Facebook 等)整合到你的應用中。
- **自動處理 session 和 token** - 自動處理 session 和 JWT token 的生成、更新和驗證。這簡化了認證相關的狀態管理。
- **支援多種認證提供者** - 支援`數十個主要認證提供者`,你可以輕鬆地同時使用多個提供者。
- **方便擴充和自定義** - 提供了擴充接口和 hook,讓你可以根據需要自定義認證流程的各個部分。
- **良好的開發人員體驗** - 提供了詳細的文件和示例,並且 API 設計簡單明瞭,可以加快開發速度。
- **開源免費** - 在 MIT 許可下發布的開源軟件,可以免費使用。

## 設置方法

---

NextAuth.js 的設置全部都在 API route 的 `[...nextauth].js` 檔案中

## 安裝

```
  npm install next-auth
```

## 設置 API route

因應 Next.js 升級後 app route 以 `Route Handler` 作為 API 設置的方法，目前 NextAuth.js 也支援 page route 及 app route 兩種設置方法。兩個設置內容都相同，只是最後 `export` 的方法有些不一樣~

## Page Route

在 pages/api/auth 中建立 [...nextauth].js 檔案

- 定義一個 authOptions 的物件，型別為 `AuthOptions`
- 物件中會有些基本設置，例如 providers、pages、session、secret 等等
- 最後調用 NextAuth ，並 export NextAuth(authOptions) 即完成

```jsx title=""
import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions: AuthOptions = {
	<-------- NextAuth 主要設定 -------->
}

export default NextAuth(authOptions)
```

## App Rout

在 app/api/auth/[...nextauth] 中建立 `route.js` 檔案

- 一樣設置型別為 AuthOptions 的 authOptions 的物件
- 開始設置內容
- 設置完成調用 NextAuth ，並設置 NextAuth(authOptions) 為 handler 或其他變數
- 最後 export GET 及 POST

```jsx title=""
import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions: AuthOptions = {
 <-------- NextAuth 主要設定 -------->
// adapter:PrismaAdapter(prisma),
// providers:[].
// pages:{},
// secret:process.env.NEXTAUTH_SECRET,
// callback:{}
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

## 設置 authOptions

## adapter

可作為與`資料庫`連接的橋樑，負責`建立和保存用戶的身份驗證數據`，除了 `MongoDB、MySQL、PostgreSQL` 也支援 `Prisma` ! 由於我的專案是以 Prisma 建置，以下就以 `Prisma`為例

- 安裝 @auth/prisma-adapter

```jsx title=""
   npm install @auth/prisma-adapter
```

- 在 options 中設定 adapter，引入 `prisma client` 後，將其設置於 PrismaAdapter 中

```jsx title=""
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/libs/prismadb"; // 封裝好的 prisma client 實例

export const authOptions = {
  adapter: PrismaAdapter(prisma),
};
```

## provider

必填欄位，設定登入驗證的 `providers`，可設定多組如：Google, Facebook, Twitter, GitHub, Email 等等 provider，主要分為 `OAuth`、`Email` 及 `Credential`s 三種驗證方式

## OAuth

第三方驗證，主要設置該種類的 `clientId` 和 `clientSecret`

先引入欲設定的 OAuth Provider 後，於該服務取得 ID 及金鑰後再於`環境變數`中設定並引用

```jsx title=""
Provider({
      clientId: process.env.****_CLIENT_ID as string,
      clientSecret: process.env.****_SECRET as string
    })
```

## Credentials

使用自定義的 `Username` / `Email` 和 `Password` 等憑證進行身份驗證，可連接至 `db` 設定權限

- name：用來定義在登錄表單上如何顯示這種認證方法

  如果將 `name` 設置為 "Credentials"，那麼在登錄表單上，用戶會看到一個按鈕，上面寫著 "Sign in with Credentials" 或類似的文字。

- credentials：定義和描述應該在登錄表單上出現的欄位，當用戶提交這些欄位的值時的驗證型別。

- authorize：檢查提交的 `Username` / `Email` 和 `Password` 是否與存儲在資料庫中的數據相符，當用戶提交憑證嘗試登錄時，`authorize` 會被調用。

```jsx title=""
import CredentialsProvider from "next-auth/providers/credentials";
providers: [
  CredentialsProvider({
    name: "Credentials",
    // 指定你預期提交的任何欄位
    credentials: {
      email: { label: "email", type: "text" },
      password: { label: "password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password)
        throw new Error("Invalid credentials");
      // 與 prisma中的 user 進行比對
      const user = await prisma.user.findUnique({
        where: {
          email: credentials.email,
        },
      });

      if (!user || !user.hashedPassword) throw new Error("Invalid credentials");
      // 確認密碼正確
      const isValid = await bcrypt.compare(
        credentials.password,
        user.hashedPassword
      );

      if (!isValid) throw new Error("Invalid credentials");

      return user;
    },
  }),
];
```

## pages

代表 NextAuth.js 提供各種驗證方法的路徑位置，自定義身份`驗證`和`授權`過程中不同頁面的路徑

```jsx title=""
pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
		// 當出現身份驗證錯誤時，例如驗證失敗或訪問被拒絕，
		// NextAuth.js 會將用戶重定向到這個路徑，以顯示相應的錯誤信息。
    error: '/auth/error', // Error code passed in query string as ?error=
		// 當需要用戶進行電子郵件驗證時，NextAuth.js 會將用戶重定向到這個路徑，
		// 以顯示相關的驗證請求。
    verifyRequest: '/auth/verify-request', // (used for check email message)
    // 當有新用戶進行註冊操作並需要額外資料時，NextAuth.js 會將用戶重定向到這個路徑，
		// 以收集新用戶的相關資料。
    newUser: '/auth/new-user'
		// 當用戶忘記密碼並需要進行密碼重置時，NextAuth.js 會將用戶重定向到這個路徑，
		// 以執行密碼重置相關的操作。
   forgotPassword: '/auth/fogot-password'
   resetPassword: '/auth/reset-password'
  }
```

## secret

對 tokens 及 cookies 進行加密的密碼，
`⚠若在 production 中沒有設置會跳出錯誤警告`

```jsx title=""
secret: process.env.NEXTAUTH_SECRET;
```

## debug

當設定為 `true` 時，`NextAuth` 會在 terminal 輸出 log 及資訊，建議僅在`開發`環境中開啟。

```jsx title=""
debug: process.env.NODE_ENV === 'development',
```

## jwt

主要用於 JWT 本身設定

- `maxAge`: 這是 `JWT` 的最大有效期。這意味著，當 JWT 過期後，它將不再有效，並且用戶需要重新獲取新的 JWT。
- `encode` 和 `decode`: 自定義函數，可以對 JWT 的內容進行加密和解密。

```jsx title=""
  jwt: {
  maxAge: 60 * 60 * 24 * 30,
  async encode() {},
  async decode() {},
}
```
