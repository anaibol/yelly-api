FROM node:lts-alpine

ARG DATABASE_URL
ARG DATABASE_READ_URL
ARG ALGOLIA_API_KEY 
ARG ALGOLIA_APP_ID 
ARG ALGOLIA_INDEX_PREFIX 
ARG EMAIL_PROVIDER_API_KEY 
ARG GOOGLE_API_KEY 
ARG APOLLO_KEY
ARG APOLLO_GRAPH_ID
ARG APOLLO_GRAPH_VARIANT
ARG APOLLO_SCHEMA_REPORTING
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG APP_BASE_URL
ARG EXPO_ACCESS_TOKEN
ARG TWILIO_ACCOUNT_SID
ARG TWILIO_AUTH_TOKEN
ARG TWILIO_VERIFICATION_SERVICE_SID
ARG NEO4J_USER
ARG NEO4J_PASSWORD
ARG NEO4J_URI
ARG AMPLITUDE_API_KEY
ARG REDIS_HOST
ARG REDIS_PORT
ARG YOTI_CLIEND_SDK_ID
ARG YOTI_KEY_FILE_PATH

ENV DATABASE_URL=$DATABASE_URL
ENV DATABASE_READ_URL=$DATABASE_READ_URL
ENV ALGOLIA_API_KEY=$ALGOLIA_API_KEY
ENV ALGOLIA_APP_ID=$ALGOLIA_APP_ID
ENV ALGOLIA_INDEX_PREFIX=$ALGOLIA_INDEX_PREFIX
ENV EMAIL_PROVIDER_API_KEY=$EMAIL_PROVIDER_API_KEY
ENV GOOGLE_API_KEY=$GOOGLE_API_KEY
ENV APOLLO_KEY=$APOLLO_KEY
ENV APOLLO_GRAPH_ID=$APOLLO_GRAPH_ID
ENV APOLLO_GRAPH_VARIANT=$APOLLO_GRAPH_VARIANT
ENV APOLLO_SCHEMA_REPORTING=$APOLLO_SCHEMA_REPORTING
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV APP_BASE_URL=$APP_BASE_URL
ENV EXPO_ACCESS_TOKEN=$EXPO_ACCESS_TOKEN
ENV TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID
ENV TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN
ENV TWILIO_VERIFICATION_SERVICE_SID=$TWILIO_VERIFICATION_SERVICE_SID
ENV NEO4J_USER=$NEO4J_USER
ENV NEO4J_PASSWORD=$NEO4J_PASSWORD
ENV NEO4J_URI=$NEO4J_URI
ENV AMPLITUDE_API_KEY=$AMPLITUDE_API_KEY
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT
ENV YOTI_CLIEND_SDK_ID=$YOTI_CLIEND_SDK_ID
ENV YOTI_KEY_FILE_PATH=$YOTI_KEY_FILE_PATH

#==============#
# PROVISIONING #
#==============#
WORKDIR /app

COPY yarn.lock ./
COPY package.json ./
COPY prisma ./prisma/

RUN yarn --frozen-lockfile
# RUN yarn --frozen-lockfile --production
RUN npx prisma migrate deploy 

COPY . .

CMD yarn start
EXPOSE 8080
