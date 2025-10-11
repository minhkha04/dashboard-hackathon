# ===== Stage 1: install dependencies (cacheable) =====
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev

# ===== Stage 2: runtime gọn nhẹ =====
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup -S nodegrp && adduser -S nodeuser -G nodegrp

# Copy code trước khi gán quyền
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gán quyền toàn bộ project cho nodeuser (bao gồm cả thư mục mới tạo runtime)
RUN chown -R nodeuser:nodegrp /app

USER nodeuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

EXPOSE 8080
CMD ["npm", "run", "start"]