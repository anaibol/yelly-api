FROM node:lts-alpine

ARG DATABASE_URL 
ARG ALGOLIA_API_KEY 
ARG ALGOLIA_APP_ID 
ARG ALGOLIA_INDEX_PREFIX 

ENV DATABASE_URL=$DATABASE_URL
ENV ALGOLIA_API_KEY=$ALGOLIA_API_KEY
ENV ALGOLIA_APP_ID=$ALGOLIA_APP_ID
ENV ALGOLIA_INDEX_PREFIX=$ALGOLIA_INDEX_PREFIX

#==============#
# PROVISIONING #
#==============#
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . /app

CMD npm run start
EXPOSE 8080