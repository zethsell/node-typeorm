FROM node:16 

WORKDIR /usr/api/

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["sh","-c","npm run migrate:prod && npm start"]
