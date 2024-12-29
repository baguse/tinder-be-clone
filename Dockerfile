FROM node:20-alpine as base

WORKDIR /app
COPY package*.json ./
EXPOSE 4003

ARG NPM_AUTH_TOKEN 
ENV NODE_ENV=dev
COPY . ./
RUN npm install && npm run build
RUN ls -la

FROM node:20-alpine as production
WORKDIR /app
COPY --from=base /app/dist ./dist
COPY --from=base /app/package*.json ./
RUN npm install --omit=dev

CMD ["node", "dist/main.js"]
