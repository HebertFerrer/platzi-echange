FROM node:13.1

# Vue
RUN npm install -g @vue/cli

RUN npm install -g serve

COPY [".", "/app"]

WORKDIR /app

EXPOSE 8080
EXPOSE 5000

CMD [ "npm", "run", "serve" ]
