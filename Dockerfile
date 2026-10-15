FROM node:lts-alpine AS builder

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

FROM busybox:stable-musl AS runtime

WORKDIR /www
COPY --from=builder /app/dist .
COPY httpd.conf /etc/httpd.conf

USER 1000:1000
EXPOSE 8000
CMD ["httpd", "-f", "-p", "8000", "-h", "/www", "-c", "/etc/httpd.conf"]

