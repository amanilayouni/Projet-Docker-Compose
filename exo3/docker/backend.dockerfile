
FROM node:18-alpine

WORKDIR /app
COPY backend/src/package.json ./
RUN npm install

COPY backend/src/ ./

EXPOSE 5000
CMD ["npm","start"]
