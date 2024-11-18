FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm config set strict-ssl false
RUN npm install
COPY . .
ENTRYPOINT ["npm","run","start:migrate"]