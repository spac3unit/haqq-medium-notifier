FROM node:16

WORKDIR /usr/src/haqq-medium-notifier

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
