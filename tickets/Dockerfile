FROM node:alpine

WORKDIR /app
COPY packages packages
COPY tickets tickets
WORKDIR /app/packages/common
RUN npm install
WORKDIR /app/tickets
RUN npm install
#COPY . .

CMD ["npm", "start"]
