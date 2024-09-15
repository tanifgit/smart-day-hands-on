FROM node:18.10-alpine AS builder

USER root
WORKDIR /app
COPY /smart-ui .

RUN npm install
RUN node node_modules/@angular/cli/bin/ng build --configuration production

FROM nginx
COPY --from=builder ./app/dist/smart-ui/ /usr/share/nginx/html

COPY /smart-ui/cert/smart_ui.crt /etc/nginx/ssl/smart_ui.crt
COPY /smart-ui/cert/smart_ui.key /etc/nginx/ssl/smart_ui.key

COPY /smart-ui/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443