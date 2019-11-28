FROM node:13.1

WORKDIR /app

COPY ["package*.json", "/app/"]

RUN npm install

COPY [".", "."]

EXPOSE 8080
EXPOSE 5000

CMD [ "npm", "run", "serve" ]
