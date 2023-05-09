# Fase de construcción
FROM node:18.16.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY public /app/public
RUN npm run build

# Fase de producción
FROM node:18.16.0
WORKDIR /app
COPY --from=build /app/build /app/build
COPY package*.json ./
RUN npm install --only=production
EXPOSE 80
CMD ["npm", "run", "start:prod"]