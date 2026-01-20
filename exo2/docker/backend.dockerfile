
FROM node:18-alpine

WORKDIR /app
COPY backend/src/package.json ./
RUN npm install

COPY backend/src/ ./

RUN mkdir -p /data
ENV DB_PATH=/data/app.db

EXPOSE 5000
CMD ["npm", "start"]