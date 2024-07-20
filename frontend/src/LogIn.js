import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    console.log(response.message)
    if(response.ok){
        alert('ログインに成功しました！');
        navigate('/profile', { state: { username } });
    }else{
        alert('ログインに失敗しました');
    }
  };

  return(
    <div>
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
      <button type="submit">ログイン</button>
      </form>
      <button onClick={() => navigate('/signup')}>新規登録の方はこちら</button>
    </div>
  );
}

export default LogIn;