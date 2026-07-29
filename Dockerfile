FROM node:lts-alpine AS builder

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

FROM denoland/deno:alpine-2.9.4 AS runtime

WORKDIR /usr/app

RUN deno install --allow-net --allow-read --allow-sys --global jsr:@std/http/file-server
COPY --from=builder --chown=deno:deno /app/dist ./dist

EXPOSE 8000
CMD ["file-server", "./dist", "--port", "8000"]
