FROM node:lts-alpine

ARG DATABASE_URL 
ARG ALGOLIA_API_KEY 
ARG ALGOLIA_APP_ID 
ARG ALGOLIA_INDEX_PREFIX 
ARG EMAIL_PROVIDER_API_KEY 
ARG SENDBIRD_BASE_URL 
ARG SENDBIRD_TOKEN 
ARG GOOGLE_API_KEY 
ARG APOLLO_KEY
ARG APOLLO_GRAPH_ID
ARG APOLLO_GRAPH_VARIANT
ARG APOLLO_SCHEMA_REPORTING
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

ENV DATABASE_URL=$DATABASE_URL
ENV ALGOLIA_API_KEY=$ALGOLIA_API_KEY
ENV ALGOLIA_APP_ID=$ALGOLIA_APP_ID
ENV ALGOLIA_INDEX_PREFIX=$ALGOLIA_INDEX_PREFIX
ENV EMAIL_PROVIDER_API_KEY=$EMAIL_PROVIDER_API_KEY
ENV SENDBIRD_BASE_URL=$SENDBIRD_BASE_URL
ENV SENDBIRD_TOKEN=$SENDBIRD_TOKEN
ENV GOOGLE_API_KEY=$GOOGLE_API_KEY
ENV APOLLO_KEY=$APOLLO_KEY
ENV APOLLO_GRAPH_ID=$APOLLO_GRAPH_ID
ENV APOLLO_GRAPH_VARIANT=$APOLLO_GRAPH_VARIANT
ENV APOLLO_SCHEMA_REPORTING=$APOLLO_SCHEMA_REPORTING
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

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