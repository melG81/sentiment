FROM node:8.9.0
LABEL maintainer="howieburger"

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Expose publc port and run npm command
EXPOSE 4000
CMD ["npm", "start"]