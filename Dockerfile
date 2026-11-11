FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g --ignore-scripts serve@14.2.7
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .

FROM base AS local
ENV NODE_ENV=local
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS dev
ENV NODE_ENV=development
RUN npm run build -- --mode development
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]

FROM base AS prod
ENV NODE_ENV=production
RUN npm run build
USER node
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
