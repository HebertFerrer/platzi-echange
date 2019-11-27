FROM node:13.1

# Vue
RUN npm install -g @vue/cli

COPY [".", "/app"]

WORKDIR /app

EXPOSE 8080

CMD [ "npm", "run", "serve" ]
