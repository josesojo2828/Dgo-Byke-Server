FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npm install -g @nestjs/cli
# -------------------------

RUN npx prisma generate

COPY . .

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

# ###################
# # ETAPA 1: BUILD
# ###################
# FROM node:20-alpine As builder

# WORKDIR /usr/src/app

# COPY package*.json ./

# COPY prisma ./prisma/
# COPY views ./views/
# COPY public ./public/
# COPY src/i18n ./src/i18n

# RUN npm install
# RUN npm install -g @nestjs/cli
# RUN npx prisma generate

# COPY . .

# RUN npm run build

# ###################
# # ETAPA 2: PRODUCTION
# ###################
# FROM node:20-alpine As production

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --only=production
# RUN npm install -g @nestjs/cli

# COPY prisma ./prisma/
# RUN npx prisma generate

# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/views ./views
# COPY --from=builder /usr/src/app/public ./public
# COPY --from=builder /usr/src/app/src/i18n ./src/i18n

# COPY docker-entrypoint.sh /usr/local/bin/
# RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# ENTRYPOINT ["docker-entrypoint.sh"]