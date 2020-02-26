FROM node:13.8.0-alpine3.10

# Update apk repo
RUN echo "http://dl-4.alpinelinux.org/alpine/v3.7/main" >> /etc/apk/repositories && \
    echo "http://dl-4.alpinelinux.org/alpine/v3.7/community" >> /etc/apk/repositories

WORKDIR /parallel

COPY package.json package.json* ./
COPY client/package.json client/package.json* ./client/

COPY . .

# Install and build parallel client
RUN cd client \
    && npm install --no-optional \
    && npm cache clean --force \
    && npm run build \
    && cd ..

# Install server dependencies
RUN npm install --no-optional && npm cache clean --force

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
    SLACK_TOKEN="$SLACK_TOKEN" \
    SLACK_CHANNEL="$SLACK_CHANNEL" \
    AWS_ACCESS_KEY="$AWS_ACCESS_KEY" \
    AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
    S3_BUCKET="$S3_BUCKET"

EXPOSE 8080

CMD redis-server --daemonize yes && npm run server