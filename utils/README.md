# 各ファイルの説明
## `gen_query_add_place.py`
## 概要
- 入力
    - 任意の場所の名前(文字列)
- 出力
    - その名前と座標をDBのplacesテーブルにINSERTするSQL文を返す
### 実行環境
- ~~Google Cloud (旧GCP)で新規プロジェクトを作り、そこで実行する~~
- 実行はローカルでok
- apiの取得にGoogle Cloudが必要
### apiの有効化
- 作成したプロジェクトの画面→プロダクト→サービスへのアクセス
- `Places api`を検索し、有効にする
- 鍵と認証情報に行って"認証情報を作成"
- apiキーをコピー
- 有効期限はないらしい
- pyhtonを実行するターミナルで環境変数にapiキーを保存
    - windows
        ```powershell
        $ setx PLACES_API_KEY "your_api_key_here"
        ```
        - 再起動
    - mac, linux
        ```sh
        $ export PLACES_API_KEY="your_api_key_here"
        ```
        - 設定の反映
        ```sh
        $ source ~/.bashrc
        # または
        $ source ~/.bash_profile
        ```
        - 確認
        ```shprintenv | grep "PLACES"
        $ 
        ```
        - 取得したキーが表示されたらok
        ```sh
        PLACES_API_KEY="your api key"
        ```

## なぜapiを使うか
- google map api使ってplacesの自動生成できそう
    1. 人気スポットまとめて取得
    1. スポットごとに名前・座標取得
    1. DBにINSERT INTOする

