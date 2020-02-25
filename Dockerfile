FROM node:13.8.0-alpine3.10

# Update apk repo
RUN echo "http://dl-4.alpinelinux.org/alpine/v3.7/main" >> /etc/apk/repositories && \
    echo "http://dl-4.alpinelinux.org/alpine/v3.7/community" >> /etc/apk/repositories

WORKDIR /server

COPY ./package.json ./

RUN npm install

COPY . .

# Install chromeDriver, Redis and chromium-chromedriver
RUN rm -rvf chromedriver \
    && apk update \
    && set -xe \
    && apk add --no-cache redis \
    && apk add chromium chromium-chromedriver

# Set environment varables passed in from cloud provider
ENV NODE_ENV=production \
    NAME="$NAME" \
    MONGO_URI="$MONGO_URI" \
    SLACK_TOKEN="$SLACK_TOKEN"

EXPOSE 8080

CMD redis-server --daemonize yes && npm run server