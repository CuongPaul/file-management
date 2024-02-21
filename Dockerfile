## ---- Development ----
FROM node:21-alpine as development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --only=development

COPY . .

RUN yarn build

CMD [ "yarn", "start:dev" ]

## ---- Production ----
FROM node:21-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD [ "yarn", "start:prod" ]
