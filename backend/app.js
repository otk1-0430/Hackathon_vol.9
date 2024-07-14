//app.jsにサーバーの動作を記述
const express = require('express'); // express のインポート
const Pool = require('pg'); // sqlと接続するためのパッケージpgのインポート
const cors = require('cors') // わからん

const app = express(); // インスタンス化
const PORT = 5000; // サーバーのポート番号
app.use(cors()); // エラー消すためのまじない

// pgの設定
const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'DB',
    password: 'password',
    port: 5432,
  });

// ルートエンドポイントの設定
// get, post, delete, putなどHTTPリクエストで使うメソッドがある
// HTTPリクエストとは https://qiita.com/minateru/items/8693538bbd0768855266
// localhost:5000/ にアクセスしたときの動作
app.get('/', (req, res) => {
    res.send('Hello World!'); // GETリクエストに対するレスポンスとして文章を送信している
});

// 他のエンドポイントの設定
// localhost:5000/about にアクセスしたときの動作
app.get('/about', (req, res) => {
    res.send('About Page');
});

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});