import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box, Grid, Link } from "@mui/material";


function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    //ページの遷移のために絶対にいる
    e.preventDefault();

    //フォームデータをバックエンドに送信
    const response = await fetch('http://localhost:5000/api/register', {
      //データ送信のためにPOSTメソッド使用　POSTリクエストを送信
      method: 'POST',
      //リクエストのコンテキストをサーバーに送信
      headers: {
        //リクエストのコンテンツタイプをjsonに指定
        'Content-Type': 'application/json',
      },
      //usernameとpasswordを含むオブジェクトをjson文字列に変換する
      body: JSON.stringify({ username, password }),
    });

    //レスポンスが200~299ならtrue
    if (response.ok) {
      //指定されたパス/profifeにナビゲート(遷移)する
      navigate('/mypage', { state: { username } });
    } else {
      //メッセージを表示
      alert('登録に失敗しました');
    }
  };

  return (
  <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          会員登録
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="ユーザーネーム"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            会員登録
          </Button>
          <Grid container>
            <Grid item>
              <Link href="#" variant="body2" onClick={() => navigate('/')}>
                ログイン画面に戻る
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;