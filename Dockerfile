# Use official Node.js image for build stage
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# Run Vite dev server with host flag to allow external access
CMD ["npm", "run", "dev", "--", "--host"]
