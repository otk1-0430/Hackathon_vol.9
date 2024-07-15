//ここにサーバーの動作を記述
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');

const app = express();
const port = 3000;

// MongoDB接続
mongoose.connect('mongodb://localhost:27017/user-auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ユーザー登録エンドポイント
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  // ユーザーの作成
  const newUser = new User({ username, password });
  
  try {
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
