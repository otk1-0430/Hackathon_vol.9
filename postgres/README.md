## dockerのインストール
https://www.docker.com/ja-jp/products/docker-desktop/
でwindows版 or mac版 をダウンロードしてインストール

## 始め方
- docker desktopを起動
- power shell か zsh で
```bash
cd ..
docker compose up -d
```

## 止め方
ctrl + c

## ER図
![alt text](image.png)
### 解説
- PKは主キー(Primary Key)
    - テーブルにおけるレコードを一意に特定する識別子
- FKは外部キー(Foreign Key)
    - 別テーブルのPK
    - 本テーブルのレコードと別テーブルのレコードを結びつける
        - テーブル結合

## 各種データ操作のsql文
- ユーザー認証
    ```sql
    SELECT * FROM users WHERE username='username' AND password='password';
    ```
    - usersテーブルからusernameとpasswordのand検索をする
    - どちらか間違っていたら拒否
    - usersのレコードが帰ってきたら認証
- 取得系
    - ユーザーの訪問済みスポットを取得
    ```sql
    SELECT
        u.user_id,
        u.username,
        p.place_id,
        p.placename,
        p.latitude,
        p.longitude,
        s.timestamp
    FROM
        stamps s
    JOIN
        users u ON s.user_id = u.user_id
    JOIN
        places p ON s.place_id = p.place_id
    WHERE
        u.user_id = 1;  -- ここで特定のユーザーIDを指定
    ```
    - 近くのスポットを取得
- 追加系
    - 新規訪問済みスポットを追加
    ```sql
    INSERT INTO stamps (user_id, place_id) VALUES (user_id, place_id) -- VALUESの後に実際のuserid, placeidを入れる
    ```
- 更新系
    - usernameの変更
    - passwordの変更