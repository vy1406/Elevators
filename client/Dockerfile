FROM node:18-alpine

# Set the working directory
WORKDIR /srv/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]