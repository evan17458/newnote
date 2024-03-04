# 圖片優化：next/image

next/image
Next 延伸了 HTML `image` 元素，提供一個效能更優的 component - next/image。

優化內容有幾項：

- 自動將圖片轉成 WebP/AVIF 格式
- 自動預防 layout shift
- 預設 lazy loading

要如何使用呢？

使用本機圖檔

```jsx title=""
import Image from "next/image";
import heroImage from "./heroImage.png";

export default function Page() {
  return <Image src={heroImage} />;
}
```

## 自動轉檔

可以從上面 看到，heroImage 的格式原本是 png，但假設進到頁面另存這張圖檔，會發現下載的圖檔格式為 WebP。

因為使用 `Image`，Next 會自動幫你轉圖片格式。

Next 會依據 request header 中，Accept array 的順序來決定轉檔的格式。假如想自訂格式順位，可以在 next.config.js 中設定：

```jsx title="@type {import('next').NextConfig}"
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
```

假如瀏覽器支援 AVIF，`Image` 的圖片就會優先轉為 AVIF。

## 自動設定圖片尺寸

假如使用本機圖檔，Next 會自動根據圖檔尺寸設定 `img` 的 width 和 height。
為什麼要特別設定 width 跟 height 呢？

為了預留位置給圖片，防止 layout shift。

但這時你可能會想：圖片載入成功前，畫面一塊白白的很奇怪，有辦法先顯示一個模糊的版本嗎？

## blur-up placeholder

`Image` 可以帶一個 placehoder prop。
加入 placeholder='blur' 就可以在圖片載完前先顯示模糊的版本：

```jsx title=""
<Image src={heroImage} placeholder="blur" />
```

## 預設 lazy loading

檢視網頁原始碼可發現，Next 幫我們在 `img` 加上 loading="lazy" 的 attribute。

所以當圖片接近 viewport 時，瀏覽器才會載入圖片：

假如想捨棄 lazy loading，可以將 loading prop 改為 eager：

```jsx title=""
<Image src={heroImage} loading="eager" />
```

## 優先載入

我們可以在它的 `<Image/>`加上 priority prop，讓這張圖片優先載入。

假如 `<Image/>` 的 priority 為 true，則會取消 lazy loading，優先載入

```jsx title=""
export default function Page() {
  return (
    <>
      <Image src={image1} alt='image 1' />
      {/* 讓 image2 優先載入 */}
      <Image src={image2} alt='image2' priority />
    <>
  );
}
```

## 使用 Remote Images

假如圖片不是從本機匯入 (ex: 雲端)，要做幾項設定：

- 須在 next.config.js 中設定支援的圖片來源資訊：

```jsx title=" @type {import('next').NextConfig}"
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "/my-bucket/**",
      },
    ],
  },
};

module.exports = nextConfig;
```

- 須手動設定 width 跟 height：

width 與 height 主要目的是預留位置給圖片，避免 layout shift，不會影到圖片顯示比例。

假設 width 小於原圖的寬，則圖片會依照設定的 width 搭配對應的高顯示。比方說我的圖片比例為 4:3，尺寸為 800 \* 600，假如我設定 `<Image>` 的 width 與 height 都為 400，那 loading 時預留的空間會是 400x400，最終圖片使寸會是 400x300

如果不知道原圖的尺寸該怎麼辦？我們可以在 `<Image>` 包一層父元素，並在`<Image>` 加上 fill 這個 prop，來讓圖片填滿父元素

但因為加上 fill 後，圖片會是 position absolute，必須讓父元素為 position relative:

```jsx title=""
/* 父層必須是 position relative */}
  <div className='w-[500px] h-[500px] relative'>
    <Image
      src='...'
      fill
    />
  </div>
```

上述例子，圖片 loading 時預留的空間，和最終顯示的尺寸都會是 500x500。

也可以使用 sizes 和 style 進一步調整圖片尺寸：

```jsx title=""
<Image
  src="..."
  fill
  sizes="100vw"
  style={{
    objectFit: "cover",
  }}
/>
```

- 須手動設定 blurDataURL
  remote 圖片使用 placeholder="blur"，須提供 placeholder 圖片的 Data URL。

  假如想使用簡單色塊，可以使用一些現成服務生成 Data

```jsx title=""
<Image blurDataURL="data:..." />
```
