FROM node:14-alpine as build
LABEL maintainer="wilsons80@gmail.com"
WORKDIR /app
RUN npm cache clean --force
COPY . .
RUN npm install && npm run build

#######################################################

FROM nginx:latest AS ngi
LABEL maintainer="wilsons80@gmail.com"
RUN rm -rf /usr/share/nginx/html/*

#TODO: configurar o certificado digital SSL/HTTPS
#TODO: configurar o /opt/bitnami/nginx/conf/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80