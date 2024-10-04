# Stage 1: Build
FROM node:18 AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src/

# Compile TypeScript files
RUN npm install -g typescript && tsc

# Stage 2: Production
FROM node:18 AS release

# Set working directory
WORKDIR /usr/src/app

# Copy node_modules and compiled files from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/src ./src

# Copy package.json
COPY package.json ./

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app (using the compiled JavaScript file)
CMD ["node", "src/index.js"]
