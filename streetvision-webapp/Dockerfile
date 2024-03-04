# FROM node:20

# WORKDIR /usr/src/app

# COPY package*.json ./
# RUN npm install

# COPY . .

# CMD ["npm", "start"]

# EXPOSE 3000


FROM node:20 as build

WORKDIR /usr/src/app

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY package*.json ./
RUN npm install

COPY . .
# RUN PUBLIC_URL=/uk npm run build
# RUN npm run build

# FROM nginx:latest

# COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 3000

# CMD ["nginx", "-g", "daemon off;"]
CMD ["npm", "start"]