FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS local
ENV NODE_ENV=local
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS build
ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "run", "start"]
