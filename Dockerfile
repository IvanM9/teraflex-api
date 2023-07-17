FROM node:18-alpine
 
WORKDIR /user/src/app

COPY package.json yarn.lock ./
COPY . .

RUN yarn install
RUN yarn run build

USER node
 
CMD ["yarn", "run", "start:prod"]