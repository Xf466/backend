FROM node:alpine
WORKDIR /usr/src
COPY package*.json .
RUN npm ci
COPY . .
# CMD ["npm", "start"]
# Run developer mode...
CMD ["npm", "run", "dev"]
