FROM node:lts-alpine

#==============#
# PROVISIONING #
#==============#
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . /app

CMD npm run start:${env}
EXPOSE 80