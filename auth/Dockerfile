FROM node:alpine

WORKDIR /app
COPY packages packages
COPY auth auth
WORKDIR /app/packages/common
RUN npm install
WORKDIR /app/auth
RUN npm install
#COPY . .

CMD ["npm", "start"]
