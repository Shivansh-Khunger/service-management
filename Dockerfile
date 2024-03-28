FROM node:21.6.1-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:21.6.1-alpine
WORKDIR /app
COPY --from=builder /app/dist ./
COPY package*.json ./
RUN npm install --only=production
EXPOSE 3007
CMD [ "node", "index.js" ]
