# Stage 1: Build
FROM node:20-alpine AS builder

RUN corepack enable

WORKDIR /app
COPY . .

# No --immutable, let Yarn fix internal confusion
RUN yarn install

# Now build
RUN yarn build

# Stage 2: Serve
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
