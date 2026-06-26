# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy custom build to nginx static path
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx custom config if needed, or rely on defaults
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
