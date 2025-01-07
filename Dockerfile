FROM node:current-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:mainline-alpine-slim AS runtime
ENV TZ=Asia/Shanghai
COPY --from=build /app/dist/ /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80