# 第一阶段：构建阶段
FROM node:16 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码文件
COPY . .

# 构建前端应用
RUN npm run build

# 第二阶段：部署阶段，使用 Nginx
FROM nginx:alpine

# 从构建阶段复制生成的 build 文件夹到 Nginx 的 html 目录
COPY --from=build /app/build /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 开放 Nginx 默认端口 80
EXPOSE 3000

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]