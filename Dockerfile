FROM node:16-alpine as builder
WORKDIR /app
COPY yarn.lock /app/
COPY package.json /app/
COPY tsconfig.json /app/
COPY src/ /app/src

RUN yarn install --frozen-lockfile  \
    && yarn build \
    && yarn prepare-web


FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/package.json /app/package.json
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist/ /app/dist/

CMD ["npm", "start"]
