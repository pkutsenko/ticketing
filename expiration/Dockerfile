FROM node:alpine

WORKDIR /app
COPY packages packages
COPY expiration expiration
WORKDIR /app/packages/common
RUN npm install
WORKDIR /app/expiration
RUN npm install
#COPY . .

CMD ["npm", "start"]
