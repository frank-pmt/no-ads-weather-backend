FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY src/static/data /app/dist/static/data

RUN npm run build

EXPOSE 3001

# CMD ["npm", "start"]
CMD ["sh", "-c", "ls -la && echo '--- dist dir ---' && ls -la dist/ && npm start"]
