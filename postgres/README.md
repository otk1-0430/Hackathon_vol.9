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
#### usersテーブル
略
#### placesテーブル
全スポットの名前、緯度経度を記録
#### stampsテーブル
誰がどこに訪れたかを記録
- PKは主キー(Primary Key)
    - テーブルにおけるレコードを一意に特定する識別子
- FKは外部キー(Foreign Key)
    - 別テーブルのPK
    - 本テーブルのレコードと別テーブルのレコードを結びつける
        - テーブル結合
### 初期データ
#### usersテーブル
| user_id | user_name | password |
| ---- | ---- | ---- |
| 1 | testuser1 | password1 |
| 2 | testuser2 | password2 |
#### placesテーブル
| place_id | placename | latitude | longitude |
| ---- | ---- | ---- | ---- |
| 1 | north pole | 90.00000000 | 0.000000 |
| 2 | south pole | -90.00000000 | 0.000000 |
#### stampsテーブル
| stamp_id | user_id | place_id |
| ---- | ---- | ---- |
| 1 | 1 | 1 |
| 2 | 2 | 2 |
| 3 | 1 | 2 |

## 各種データ操作のsql文
- ユーザー認証
    ```sql
    SELECT * FROM users WHERE username='username' AND password='password';
    ```
    - usersテーブルからusernameとpasswordのand検索をする
    - どちらか間違っていたら拒否
    - usersのレコードが帰ってきたら認証
- 取得系
    - 全ての訪問するべきスポットを取得
        - place_id, place_name, 緯度経度
    ```sql
    SELECT * FROM places;
    ```
    - ユーザーの訪問済みスポットを取得
    ```sql
    SELECT
    s.place_id,
    s.timestamp
    FROM 
        stamps s
    JOIN 
        users u ON s.user_id = u.user_id
    WHERE 
        u.username = '指定したいユーザー名';
    ```
    - 近くのスポットを取得
- 追加系
    - 新規訪問済みスポットを追加
    ```sql
    -- 1. トランザクションの開始
    BEGIN;
    
    -- 2. usernameからuser_idを取得
    -- 'some_username'を実際のusernameに置き換えてください
    WITH user_cte AS (
        SELECT user_id
        FROM users
        WHERE username = 'some_username'
    )
    -- 3. user_idを使ってstampsテーブルにデータを挿入
    INSERT INTO stamps (user_id, place_id)
    SELECT user_id, 'some_place_id' -- 'some_place_id'を実際のplace_idに置き換えてください
    FROM user_cte;
    
    -- 4. トランザクションのコミット
    COMMIT;
    ```
- 更新系
    - usernameの変更
    - passwordの変更
