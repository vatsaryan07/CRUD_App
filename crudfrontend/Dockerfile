FROM node:16-alpine

WORKDIR /crudfrontend/

COPY package*.json /crudfrontend/
RUN npm install

COPY . /crudfrontend/

EXPOSE 3000

CMD ["npm", "start"]