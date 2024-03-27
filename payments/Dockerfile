FROM node:alpine

WORKDIR /app
COPY packages packages
COPY payments payments
WORKDIR /app/packages/common
RUN npm install
WORKDIR /app/payments
RUN npm install
#COPY . .

CMD ["npm", "start"]
