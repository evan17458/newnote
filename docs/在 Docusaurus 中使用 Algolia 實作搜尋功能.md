## 在 Docusaurus 中使用 Algolia 實作搜尋功能

介紹如何在 Docusaurus 中去使用 Algolia 搜尋我們的文章以及文章內的文字，
讓使用者能夠在我們的 Docusaurus 搜尋關鍵字找到自己要的文章。

文章已經先將 Docusaurus 專案部署至 Github Page，因為我的作業環境是 Windows，
比較難在本地端用 ip 進行測試，所以文章後面的 Demo 是使用 Github Page 來示範。

## 安裝

先在 Docusaurus 專案底下安裝 docsearch。

```jsx title=""
npm install @docsearch/react
```

## 註冊 Algolia

先到 Algolia 官方網站 進行註冊並登入。

登入成功後會直接來到後台頁面，先建立 index，等下這個 index 的名稱會用到，建議可以先複製下來。

點擊 API Keys 後會來到這個頁面。

接著點擊 All API Keys，再點擊右邊的 New API Key，

在最下方的 ACL 我們還需要新增另外三個參數，分別是 `addObject`、`editSettings`、`deleteIndex`，新增完成後就按下 Create。

## Docusaurus Config

開啟 `docusaurus.config.js`，在 themeConfig 新增一個 algolia 物件，在該物件中需要帶入三個參數。

- `apiKey` : Algolia 的 API Key，記得是要將我們剛剛新增的 apiKey 給帶入。
- `indexName` : Algolia 的 index 名稱。
- `appId` : Algolia 的 Application ID。

```jsx title="docusaurus.config.js"
themeConfig: ({
  algolia: {
    apiKey: "b14c96609eebac13e6412d80802884bb",
    indexName: "docusaurus-demo-algolias",
    appId: "XWN4XQZ58C",
  },
  ...
});

```

成功的話，會在我們的 Docusaurus 專案的右上角看到搜尋欄。

## 環境變數與爬蟲設定檔

這邊就照著官方文件的步驟將相關的工具裝起來

先在 Docusaurus 專案的根目錄新增 .env，並在裡面填上你的 Algolia 的 Application ID 和 Api Key。

```jsx title=".env"
APPLICATION_ID=你的Algolia Application ID
API_KEY=你的Algolia Api Key (後來新增的)

```

之後在根目錄再新增一個 json 檔案，名為 `config.json`，並將以下程式碼貼上。

有三個地方需要做更改，分別是：

`index_name`：你的 Algolia index 名稱
`start_urls`：你的 Docusaurus 網址
`sitemap_urls`：你的 Docusaurus 網址的 sitemap

```jsx title="config.json"
  {
  "index_name": "docusaurus-demo-algolias",
  "start_urls": ["https://weiyun0912.github.io/Docusaurus-Demo-Algolia/"],
  "sitemap_urls": [
    "https://weiyun0912.github.io/Docusaurus-Demo-Algolia/sitemap.xml"
  ],
  "sitemap_alternate_links": true,
  "stop_urls": ["/tests"],
  "selectors": {
    "lvl0": {
      "selector": "(//ul[contains(@class,'menu__list')]//a[contains(@class, 'menu__link menu__link--sublist menu__link--active')]/text() | //nav[contains(@class, 'navbar')]//a[contains(@class, 'navbar__link--active')]/text())[last()]",
      "type": "xpath",
      "global": true,
      "default_value": "Documentation"
    },
    "lvl1": "header h1",
    "lvl2": "article h2",
    "lvl3": "article h3",
    "lvl4": "article h4",
    "lvl5": "article h5, article td:first-child",
    "lvl6": "article h6",
    "text": "article p, article li, article td:last-child"
  },
  "strip_chars": " .,;:#",
  "custom_settings": {
    "separatorsToIndex": "_",
    "attributesForFaceting": ["language", "version", "type", "docusaurus_tag"],
    "attributesToRetrieve": [
      "hierarchy",
      "content",
      "anchor",
      "url",
      "url_without_anchor",
      "type"
    ]
  },
  "conversation_id": ["833762294"],
  "nb_hits": 46250
}

```

比較麻煩的部分來了，由於我是使用 Windows 作業系統，所以要安裝一些工具會比較複雜些。

先安裝 `Docker Desktop`，因為我們待會需要使用 Docker Daemon。

接著使用 chocolatey 安裝 jq，先來安裝 chocolatery，將 CMD 使用系統管理員開啟，並將以下指令貼上送出。

```jsx title=""

@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

之後就可以用 chocolatey 安裝 jq 了：

```jsx title=""

choco install jq
```

## 爬取資料並新增至 Algolia

如果以上的設定都沒有問題的話，現在用 Git Base 打開我們的 Docusaurus 專案，並輸入以下指令：

```jsx title=""
winpty docker run -it --env-file=.env -e "CONFIG=$(cat ./config.json | jq -r tostring)" algolia/docsearch-scraper

```

執行成功的話，會看到 `docsearch-scraper` 正在爬取我們的網站內容，並將資料新增至 `Algoli`a。

因為我是 Windows 作業環境，預設的 CMD 沒有 `cat` 指令，所以用 `Git Bash` 取代。

接著回到 Algolia 的後台，在 Search 頁面中，可以看到我們的網站內容被新增成功了。
