//app.jsにサーバーの動作を記述
const express = require('express'); // express のインポート
const { Pool } = require('pg'); // sqlと接続するためのパッケージpgのインポート
const cors = require('cors'); // 異なるドメインからのリクエストを許可するために使用
const bodyParser = require('body-parser'); // body-parserのインポート//HTTPリクエストのボディを解析するために使用
const dayjs = require('dayjs'); // JavascriptのDate型がバグの原因になるので日付をきちんと扱うため
const utc = require('dayjs/plugin/utc');
const e = require('express');
dayjs.extend(utc);

const app = express(); // インスタンス化
const PORT = 5000; // サーバーのポート番号
app.use(cors()); // エラー消すためのまじない

// todo: 機能ごとにファイル分けたり整理する

//body-parserの設定
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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


// ユーザー登録エンドポイント
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password); // 検証用

  try {
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
    const values = [username, password];
    const result = await pool.query(query, values);

    res.status(201).send(`User registered successfully: ${result.rows[0].id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});

// ログインエンドポイントの設定
// localhost:5000/login にアクセスしたときの動作
// username, passwordをDBと照合し、レスポンス返す response.okにその結果が格納される
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    try {
      const query =  'SELECT * FROM users WHERE username=$1 AND password=$2;';
      const values = [username, password];
      const result = await pool.query(query, values);
      if(result.rows.length > 0){
        res.status(200).json({ message: 'ログイン成功！' });
      } else {
        res.status(401).json({ message: 'ユーザー名かパスワードが間違っています' });
      }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({message: 'Internal server error'});
    }
});

//マイページエンドポイントの設定
// 現在地と比較してあってたらtrue
// からのDB更新
// todo:きれいなコードにする

app.post('/api/mypage', async (req, res) => {
  const { username, latitude, longitude} = req.body;
  console.log(username, latitude, longitude);
  try {
    // 現在地と一致するplace_idを検索
    const query = 'SELECT * FROM places WHERE longitude=$1 AND latitude=$2;';
    const values = [longitude, latitude];
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      const place_id = result.rows[0].place_id;
      console.log(place_id);
      // stampsテーブルにstamp追加する
      // user_idの取得
      const queryGetUserId = 'SELECT user_id FROM users WHERE username=$1';
      const values2 = [username];
      const result2 = await pool.query(queryGetUserId, values2);
      const user_id = result2.rows[0].user_id;
      console.log(user_id);
      // stampの追加
      // 同じ場所のスタンプを最近作ってたら追加しない フロントの位置情報更新に伴って無限に追加される場合があるので
      const queryCheckTimeStamp = 'SELECT timestamp FROM stamps WHERE user_id=$1 AND place_id=$2'
      const values3 = [user_id, place_id];
      const result3 = await pool.query(queryCheckTimeStamp, values3);
      //日付チェック
      if (result3.rows.length > 0) {
        console.log(result3);
        const lastStampDate = dayjs(result3.rows[result3.rows.length-1].timestamp).utc(true);
        const currentDate = dayjs.utc();
        console.log(lastStampDate['$d'], currentDate['$d']);
        // 過去のスタンプが最近１日以内なら追加しない
        if (currentDate.diff(lastStampDate, 'day') < 1) {
          console.log('stamp is too close')
          res.status(200).json({ match: false });
          return;
        };
      };
      // スタンプなければ普通に追加
      const queryAddStamp = 'INSERT INTO stamps (user_id, place_id) VALUES ($1, $2)';
      const result4 = await pool.query(queryAddStamp, values3);
      console.log(result4);
      res.status(200).json({ match: true, places: result.rows[0] });
      
      
    } else {
      console.log('any place matched');
      res.status(200).json({ match: false });
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
})

//placesテーブルから全ての情報を取ってくる
app.get('/api/mypage', async (req, res) => {
  try{
    const query = 'SELECT * FROM places'
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
})

//訪問済みの場所の情報を取ってくる
app.get('/api/mypage/postvis', async (req, res) => {
  try{
    const { username } = req.query;
    console.log(username);
    const query = `
      SELECT
        p.place_id,
        p.placename,
        p.latitude,
        p.longitude
      FROM
          stamps s
      JOIN 
          users u ON s.user_id = u.user_id
      JOIN 
          places p ON s.place_id = p.place_id
      WHERE 
          u.username = $1;
      `
    const result = await pool.query(query, [username]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
})

// サーバーの起動
app.listen(PORT, () => {
    console.log(`サーバー起動中🚀http://localhost:${PORT}`);
});
