import express from 'express';
import env from './config/environment.config.js';
import cors from 'cors';
import rootRouter from './routes/root.route.js';
import { errorHandler } from "./middlewares/error-handle.middleware.js";
import { Server } from "socket.io";
import http from "http";

const app = express();
const PORT = env.PORT;
const ALLOWED_CORS_ORIGIN = env.CORS_ORIGIN;
const PREFIX_API = env.PREFIX_API
const INTERVAL_MS = 10000; // 3 giây
app.use(cors({
    origin: (origin, callback) => {
        // Nếu không có origin (ví dụ: từ Postman), cho phép tất cả
        if (!origin) return callback(null, true);

        // Nếu CORS_ORIGIN là '*' thì cho phép tất cả các domain
        if (ALLOWED_CORS_ORIGIN.includes('*')) {
            return callback(null, true);
        }

        // Kiểm tra xem origin có trong whitelist không
        if (ALLOWED_CORS_ORIGIN.includes(origin)) {
            console.log(`Allowed by CORS: ${origin}`);  // Log các domain được phép
            return callback(null, true);
        }

        // Nếu không có trong whitelist -> block
        console.log(`Not allowed by CORS: ${origin}`);  // Log các domain không được phép
        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true  // Cho phép cookie, token
}));

app.use(express.json());
app.use(express.static('.'));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    // thông báo riêng client mới
    socket.emit("welcome", { message: "Connected to commit stream!" });

    // bắt sự kiện disconnect
    socket.on("disconnect", (reason) => {
        console.log(`❌ Client ${socket.id} disconnected:`, reason);
    });
});

// chỉ emit 1 timer toàn cục (cho tất cả client)
setInterval(() => {
    const fakeCommit = {
        repo_full_name: `Repo team ${Math.ceil(Math.random() * 10)}`,
        commit_sha: Math.random().toString(36).substring(2, 10),
        created_at: new Date().toISOString(),
    };
    io.emit("new_commit", fakeCommit);
}, INTERVAL_MS);

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});


app.use(PREFIX_API, rootRouter);
app.use(errorHandler);



