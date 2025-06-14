# MinIO Console

> [!NOTE]
> [minio/object-browser](https://github.com/minio/object-browser) をフォークしてシス研部員向けに改変しています。

# セットアップ
## 開発環境
### 環境変数の設定
```bash
cp .env.example .env.dev
```

`.env` ファイルを編集して、必要な環境変数を設定します。


### 起動
```bash
make up-dev
```

```bash
cd console
make
./console server
```

```bash
cd console/web-app
yarn install
yarn dev
```

## 本番環境
### 環境変数の設定
```bash
cp .env.example .env.prod
```

### 起動
```bash
make up-prod
```


# LICENSE
[GNU Affero General Public License](./LICENSE)
