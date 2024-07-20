
//app.jsにサーバーの動作を記述
const express = require('express'); // express のインポート
const { Pool } = require('pg'); // sqlと接続するためのパッケージpgのインポート
const cors = require('cors') // 異なるドメインからのリクエストを許可するために使用
const bodyParser = require('body-parser'); // body-parserのインポート//HTTPリクエストのボディを解析するために使用

const app = express(); // インスタンス化
const PORT = 5000; // サーバーのポート番号
app.use(cors()); // エラー消すためのまじない

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
app.get('/login', async (req, res) => {
    res.send('ログイン画面');
    const { username, password } = req.body;

    try {
      const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
      const values = [username, password];
      const result = await pool.query(query, values);
      if(result.rows.length > 0){
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
          res.status(200).json({ message: 'ログイン成功！' });
        } else {
          res.status(401).json({ message: 'パスワードが間違っています．' });
        }
      } else {
        res.status(401).json({ message: '無効な値です．' });
      } 
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({message: 'Internal server error'});
    }
});

// サーバーの起動
app.listen(PORT, () => {
    console.log(`サーバー起動中🚀http://localhost:${PORT}`);
});
