FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

FROM oven/bun:1
WORKDIR /app
COPY --from=build /app .
COPY . .
RUN bun install
ARG PORT
EXPOSE ${PORT:-3000}

CMD ["bun", "start"]