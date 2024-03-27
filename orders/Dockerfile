FROM node:alpine

WORKDIR /app
COPY packages packages
COPY orders orders
WORKDIR /app/packages/common
RUN npm install
WORKDIR /app/orders
RUN npm install
#COPY . .

CMD ["npm", "start"]
