# PurgeCSS + PostCSS

## PurgeCSS

可偵測 html 使用到的 class，將沒使用的屏除掉，達到壓縮節省檔案空間。

## PostCSS

[PostCSS](https://github.com/postcss/postcss/blob/master/docs/README-cn.md) 使用 JavaScript 轉換 CSS 許多功能的工具，可以加入前綴詞。

## 使用方式

1. 初始化 node 專案目錄

   > npm init -y

2. [postcss-cli](https://github.com/postcss/postcss-cli)

   > npm i -D postcss postcss-cli

3. [PurgeCSS](https://purgecss.com/plugins/postcss.html#installation)

   > npm i -D @fullhuman/postcss-purgecss

4. 建立 postcss.config.js

   ```js
   const purgecss = require('@fullhuman/postcss-purgecss')
   module.exports = {
     plugins: [
       purgecss({
         content: ['./**/*.html']
       })
     ]
   }
   ```

5. package.json

   ```json
     "scripts": {
       "postcss": "postcss ./css/ -r ./css/",
       "postcssmin": "postcss ./dist/ -r ./dist/"
     },
   ```

   > postcss input 指令 output

   指令參考：https://www.npmjs.com/package/postcss-cli

   -o：輸出檔案
   -d：輸出目錄
   -r：覆蓋檔案

6. 最後執行

   > npm run postcss
   > npm run postcssmin
