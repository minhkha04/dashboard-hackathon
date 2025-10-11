# 🚀 Structure ExpressJS

A sample architecture for **ExpressJS** projects organized following **Clean Architecture**: Controller → Service → Repository → Model.  

---

## 📂 Project Structure

```
src/
├── config/           # System config (DB, environment)
├── constants/        # Global constants (role, account type, upload type…)
├── controllers/      # Directs request from route -> calls service
├── mapper/           # Entity/data mapping
├── middlewares/      # Middleware: auth, error handler, upload, validate
├── models/           # Mongoose models (User, OTP, Refresh Token)
├── repositories/     # Repository: direct DB operations
├── routes/           # API routes definition
├── schemas/          # Joi schema validation
├── seeds/            # Seeder for default data (admin account…)
├── services/         # Business logic
├── socketIO/         # Socket.io handlers (real-time features)
├── swagger/          # Swagger API docs definition
├── templates/        # Email templates (HTML)
├── utils/            # Helpers: JWT, bcrypt, crypto, response, error
├── validators/       # Middleware validators integrating schemas
└── app.js            # App entry (bootstrap express)
```

---

## 📝 Naming Conventions

| Layer       | Rule | Example |
|-------------|------|---------|
| **File/Folder** | `kebab-case` | `auth.controller.js`, `user.service.js` |
| **Class**   | `PascalCase`    | `UserService`, `AuthRepository` |
| **Function/Var** | `camelCase`   | `loginUser`, `userId`, `generateToken` |
| **Constants** | `UPPER_SNAKE_CASE` | `ACCOUNT_TYPE.LOCAL`, `ROLE.ADMIN` |
| **Schemas/Validators** | `PascalCase` with `Request` suffix | `RegisterRequest`, `LoginRequest` |

---

## 🔄 Request → Response Flow

1. **Client calls API** (e.g., `POST /auths/login`)  
2. **Route** maps endpoint to **controller** (`auth.route.js` → `AuthController.login`)  
3. **Controller** receives `req`, validates input, calls **service** (`AuthService.login`)  
4. **Service** handles business logic, calls **repository** if needed  
5. **Repository** communicates with DB via **model** (Mongoose)  
6. Result is standardized through `utils/response.util.js` → returned as **JSON response**  
7. On error → `throw new BaseError()` → **errorHandler middleware** sends standardized error response  

---

## ⚙️ Installation & Run

```bash
# Clone project
git clone https://github.com/minhkha04/structure-expressJS.git
cd structure-expressJS

# Install dependencies
npm install

# Copy env
cp .env.example .env

# Run dev
npm run dev

# Run production
npm start
```

---

## 📌 Best Practices

- Keep controllers thin, no business logic inside controllers  
- Services handle business logic, repositories only interact with DB  
- Validate input with Joi before reaching controllers  
- Centralized error handling, standardized error messages  
- Constants separated for easier maintenance  

---