import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      navigate('/profile', { state: { username } });
    } else {
      //メッセージを表示
      alert('登録に失敗しました');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ユーザーネーム</label>
          <input
            type="text"
            //入力内容をusernameのステートにセット
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>パスワード</label>
          <input
            //入力内容を隠す
            type="password"
            //入力内容をpasswordのステートにセット
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">会員登録</button>
      </form>
      <button onClick={() => navigate('/')}>ログイン画面に戻る</button>
    </div>
  );
}

export default SignUp;