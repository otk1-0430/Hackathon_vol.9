CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- uuidいつか使うかも

-- memo
-- SERIAL型は連番
-- DECIMAL型は任意精度の浮動小数点
-- DECIMAL = NUMERIC
-- インデックスは検索高速化のためのデータ構造、２分木てきな

-- ユーザーテーブルの作成
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- スポットテーブル(訪れるべき場所)の作成
DROP TABLE IF EXISTS places;
CREATE TABLE places (
    place_id SERIAL PRIMARY KEY,
    placename VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8)
);

-- スタンプテーブル(訪れた場所)
DROP TABLE IF EXISTS stamps;
CREATE TABLE stamps (
    stamp_id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    place_id INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (place_id) REFERENCES places(place_id)
);

-- インデックスの作成（オプション：パフォーマンス向上のため）
-- stampsテーブルのユーザーごとにstampのB-treeを構築->特定のユーザーのstampsを集めるのに便利
-- stampsテーブルのplaceごとにstampのB-treeを構築->place_idによるstampsの検索に便利 今は必要ないかも
CREATE INDEX idx_stamps_user_id ON stamps(user_id);
CREATE INDEX idx_stamps_place_id ON stamps(place_id);


-- テストデータ、初期データの挿入
-- ユーザーデータの挿入
INSERT INTO users (username, password)
    VALUES
        ('testuser1', 'password1'),
        ('testuser2', 'password2');

-- スポットデータの挿入
INSERT INTO places (placename, latitude, longitude)
    VALUES
        ('north pole', 90.000000, 0.000000),
        ('south pole', -90.000000, 0.000000);

-- スタンプデータの挿入
INSERT INTO stamps (user_id, place_id)
    VALUES
        (1, 1),
        (2, 2),
        (1, 2);