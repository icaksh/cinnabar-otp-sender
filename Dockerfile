FROM node:18 AS base

FROM base AS builder
WORKDIR /app
COPY . .

RUN npm install --production
RUN npm run build

FROM gcr.io/distroless/nodejs18-debian11 
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/static /app/static
COPY --from=builder /app/node_modules /app/node_modules

WORKDIR /app
EXPOSE 3000
CMD ["dist/app.js"]
