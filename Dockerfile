# Use the official Node.js LTS version as the base image
FROM node:23

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install PM2 globally
RUN npm install -g pm2

# Copy the rest of the application code
COPY . .

# (Optional) Build the application if necessary
# Ensure that a "build" script exists in package.json before uncommenting
# RUN npm run build

# Expose the application's port
EXPOSE 8000

# Start the application using PM2
CMD ["npm", "start"]