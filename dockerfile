FROM node:latest as api-build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM node:latest as api

WORKDIR /app

COPY package.json package-lock.json .env ./
COPY --from=api-build /app/lib ./lib

RUN npm install --omit=dev

EXPOSE 80

CMD npm start
