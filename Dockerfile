FROM node:20-alpine

# Set working directory to /app
WORKDIR /app

# Copy the backend package.json files
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend source code
COPY backend/ ./

# Expose the port (Render assigns process.env.PORT, default to 10000)
EXPOSE 10000

# Start the application
CMD ["npm", "start"]
