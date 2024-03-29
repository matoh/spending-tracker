# Use a Node.js runtime image as the base image
FROM node:20-alpine

# Create and set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY /package.json /app/package.json
COPY /package-lock.json /app/package-lock.json

# Install the application's dependencies
RUN npm install

# Copy the rest of the application's code to the working directory
COPY / .

# Generate DB schemas
CMD ./node_modules/.bin/kysely-codegen

# Run the application
CMD ./node_modules/.bin/next