# できるだけ軽い Debian slim 系。Node 20 の最新マイナー/パッチを取得
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# 必要最低限のツールのみ（git はあると何かと便利）
ARG INSTALL_BUILD_TOOLS=false
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     ca-certificates git openssh-client \
  && if [ "$INSTALL_BUILD_TOOLS" = "true" ]; then \
       apt-get install -y --no-install-recommends python3 make g++; \
     fi \
  && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリ
WORKDIR /workspaces

# Corepack で pnpm / yarn を軽量に利用（グローバルインストール不要）
RUN corepack enable

# 公式 node イメージの 'node' ユーザーを使用
USER node

# pnpm の PATH（将来のために設定だけ）
ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
