FROM node:16-buster

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN apt-get update && \
    apt-get install -y ffmpeg

COPY . .

EXPOSE 9000

# CMD [ "node", "app.js" ]
# CMD [ "npm", "start" ]
CMD ["npm", "run", "dev"]