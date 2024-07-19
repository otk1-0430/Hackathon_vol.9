import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    //ページの遷移のために絶対にいる
    e.preventDefault();

    // フォームデータをバックエンドに送信
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      navigate('/profile', { state: { username } });
    } else {
      alert('登録に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>ユーザーネーム</label>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>パスワード</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">会員登録</button>
    </form>
  );
}

export default SignUp;