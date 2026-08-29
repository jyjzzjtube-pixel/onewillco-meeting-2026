# 공간브릿지 백오피스 — Node 22 (내장 SQLite)
FROM node:22-slim
WORKDIR /app
COPY . .
ENV PORT=8080
ENV SB_DB=/data/data.sqlite
EXPOSE 8080
CMD ["node", "--no-warnings", "server.js"]
