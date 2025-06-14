FROM node:22

# Yarn@4.4.0 をインストール
RUN corepack enable && \
    corepack prepare yarn@4.4.0 --activate

# Goをインストール
RUN apt-get update && \
    apt-get install -y wget git && \
    wget https://go.dev/dl/go1.22.3.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.22.3.linux-amd64.tar.gz && \
    rm go1.22.3.linux-amd64.tar.gz

# PATHを設定
ENV PATH="/usr/local/go/bin:${PATH}"

# バージョン確認用
RUN node -v && go version

COPY . /console
WORKDIR /console

# web-appをビルド
RUN cd web-app && \
    yarn install && \
    yarn build

# consoleをビルド
RUN make

ENTRYPOINT ["/console/console", "server"]
