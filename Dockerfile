FROM node:13.8.0-alpine3.10

# update apk repo
RUN echo "http://dl-4.alpinelinux.org/alpine/v3.7/main" >> /etc/apk/repositories && \
    echo "http://dl-4.alpinelinux.org/alpine/v3.7/community" >> /etc/apk/repositories

COPY . /parallel

WORKDIR /parallel

# install chromedriver
RUN rm -rvf chromedriver \
    && apk update \
    && set -xe \
    && apk add --no-cache redis \
    && apk add chromium chromium-chromedriver

ENV NODE_ENV=production

EXPOSE 8080

CMD ["redis-server;", "npm run server"]