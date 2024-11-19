### 使用技術

##### メイン

[![nodejs][node.js]][nodejs-url]
[![React][React.js]][React-url]
[![Typescript][Typescript]][Typescript-url]
[![webpack][Webpack.com]][webpack-url]
[![electron][Electron.com]][Electron-url]

##### UI ライブラリ

[![mui][mui.com]][Electron-url]

##### チャートライブラリ

[![eCharts][eCharts.com]][eCharts-url]

##### 株式API

[![yahoo-finance][yfinance.com]][yfinance-url]

## 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [はじめる](#はじめる)
3. [操作方法](#操作方法)

# stock stock

## プロジェクトについて

株式取引を手軽に保存確認ができます。
保存したデータは、取引日時に合わせたチャート情報を確認でき、全体または特定期間の損益をグラフで確認することもできます。

## はじめる

### 前提条件

node.js

> 開発時バージョン
> v20.12.2

[node.js install](https://nodejs.org/en/download/package-manager)

### ビルド

以下コマンドを順番に実行

```
# クローン
git clone https://github.com/makanai-j/stock-stock-app.git
```

```
# 依存関係インストール
npm install
```

```
# ビルドスタート
npm run start
```

### コマンド一覧

| コマンド       | 実行内容             |
| -------------- | -------------------- |
| npm run start  | ビルド＆スタート     |
| npm run make   | exeファイル作成      |
| npm run lint   | フォーマットチェック |
| npm run fix    | import 部分修正      |
| npm run format | コードフォーマット   |

> [!WARNING]
>
> ```
> npm run make
> ```
>
> は、クローンしたディレクトリへのパスにローマ字以外(一部記号除く)が含まれているとエラーが出ます

## 操作方法

[stockstock 操作マニュアル](https://makanai-j.github.io/stock-stock.github.io/?version=a1b2c3d)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

<!--main process-->

[node.js]: https://img.shields.io/badge/Node.js-fff?style=flat&logo=nodedotjs&logoColor=%235FA04E
[nodejs-url]: https://nodejs.org/en/
[React.js]: https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Typescript]: https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=fff
[Typescript-url]: https://www.typescriptlang.org/
[Electron.com]: https://img.shields.io/badge/electron-47848F?style=flat&logo=electron&logoColor=fff
[Electron-url]: https://www.electronjs.org/ja/
[Webpack.com]: https://img.shields.io/badge/webpack-2b3a42?style=flat&logo=webpack&logoColor=%238DD6F9
[Webpack-url]: https://webpack.js.org/

<!--renderer process-->

[mui.com]: https://img.shields.io/badge/MUI-fff?style=flat&logo=mui&logoColor=%23007FFF
[mui-url]: https://mui.com/
[eCharts.com]: https://img.shields.io/badge/apache%20eCharts-fff?style=flat&logo=apacheecharts&logoColor=%23AA344D
[eCharts-url]: https://echarts.apache.org/en/index.html
[yfinance.com]: https://img.shields.io/badge/yahoofinance2-fff?style=flat&logoColor=fff&color=639
[yfinance-url]: https://github.com/gadicc/node-yahoo-finance2#readme
