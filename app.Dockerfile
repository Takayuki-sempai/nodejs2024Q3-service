FROM node:22-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm config set strict-ssl false
RUN npm install
COPY . .

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app /app
ENTRYPOINT ["npm","run","start:migrate"]