# MinIOコンソールの開発

MinIOコンソールは[MinIOサーバー](https://github.com/minio/minio)が必要です。開発目的では、MinIOコンソールのウェブアプリとコンソールサーバーの両方を起動する必要があります。

## MinIOコンソールサーバーの起動

メインフォルダで以下を実行してサーバーをビルドします。

```go
make
```

> 注意：初回起動時は依存モジュールを整えるために`go mod tidy`を実行する必要がある場合があります。  
> サーバーを起動するには以下を実行してください。

```makefile
CONSOLE_ACCESS_KEY=<アクセスキー>
CONSOLE_SECRET_KEY=<シークレットキー>
CONSOLE_MINIO_SERVER=<minioサーバーのエンドポイント>
CONSOLE_DEV_MODE=on
./console server
```

## MinIOコンソールウェブアプリの起動

ローカルでウェブアプリを起動する方法は `/web-app` の[説明](./web-app/README.md)を参照してください。

# MinIOと一緒にビルドする

MinIOの配布形態でコンソールをテストするには、MinIOリポジトリからビルドする必要があります。以下の手順で行います。

### 0\. UI変更がある場合のビルド

コンソールのUIコンポーネントに変更を加えた場合は、まずアセットをビルドします。

コンソールフォルダで以下を実行：

```shell
make assets
```

これによりMinIOで配信される静的アセットが再生成されます。

### 1\. MinIOリポジトリをクローン

`console`リポジトリの親フォルダで以下を実行：

```shell
git clone https://github.com/minio/minio.git
```

### 2\. `go.mod`をローカル版に書き換え

MinIOリポジトリの`go.mod`を開き、最初の`require()`の後に以下の`replace()`を追加：

```python-repl
...
)

replace (
github.com/minio/console => "../console"
)

require (
...
```

### 3\. MinIOをビルド

MinIOフォルダ内で以下を実行：

```shell
make build
```

# コンソールでのLDAP認証

## セットアップ

DockerでOpenLDAPを起動します。

```shell
$ docker run --rm -p 389:389 -p 636:636 --name my-openldap-container --detach osixia/openldap:1.3.0
```

`billy.ldif`ファイルを使って新しいユーザーを作成し、グループに割り当てます。

```shell
$ docker cp console/docs/ldap/billy.ldif my-openldap-container:/container/service/slapd/assets/test/billy.ldif
$ docker exec my-openldap-container ldapadd -x -D "cn=admin,dc=example,dc=org" -w admin -f /container/service/slapd/assets/test/billy.ldif -H ldap://localhost
```

LDAPサーバーにクエリを投げて、ユーザーbillyが作成され、consoleAdminグループに割り当てられているか確認します。ユーザーとグループの一覧が表示されます。

```perl
$ docker exec my-openldap-container ldapsearch -x -H ldap://localhost -b dc=example,dc=org -D "cn=admin,dc=example,dc=org" -w admin
```

次にユーザー`billy`だけをフィルタリングしてクエリします。1件のレコードが表示されます。

```perl
$ docker exec my-openldap-container ldapsearch -x -H ldap://localhost -b uid=billy,dc=example,dc=org -D "cn=admin,dc=example,dc=org" -w admin
```

### billyユーザーのパスワード変更

`billy`のパスワードを`minio123`に設定し、`admin`をLDAP管理者のパスワードとして入力します。

```shell
$ docker exec -it my-openldap-container /bin/bash
# ldappasswd -H ldap://localhost -x -D "cn=admin,dc=example,dc=org" -W -S "uid=billy,dc=example,dc=org"
New password:
Re-enter new password:
Enter LDAP Password:
```

### MinIOでbillyにconsoleAdminポリシーを付与

```pgsql
$ cat > consoleAdmin.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "admin:*"
      ],
      "Effect": "Allow",
      "Sid": ""
    },
    {
      "Action": [
        "s3:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::*"
      ],
      "Sid": ""
    }
  ]
}
EOF
$ mc admin policy create myminio consoleAdmin consoleAdmin.json
$ mc admin policy attach myminio consoleAdmin --user="uid=billy,dc=example,dc=org"
```

## MinIOの起動

```bash
export MINIO_ACCESS_KEY=minio
export MINIO_SECRET_KEY=minio123
export MINIO_IDENTITY_LDAP_SERVER_ADDR='localhost:389'
export MINIO_IDENTITY_LDAP_USERNAME_FORMAT='uid=%s,dc=example,dc=org'
export MINIO_IDENTITY_LDAP_USERNAME_SEARCH_FILTER='(|(objectclass=posixAccount)(uid=%s))'
export MINIO_IDENTITY_LDAP_TLS_SKIP_VERIFY=on
export MINIO_IDENTITY_LDAP_SERVER_INSECURE=on
./minio server ~/Data
```

## コンソールの起動

```bash
export CONSOLE_LDAP_ENABLED=on
./console server
```
