// service/realtimeProviders/socketProvider.js
import { io } from "socket.io-client";

let socket = null;

/**
 * Khởi tạo kết nối socket nếu chưa có
 */
const getSocket = () => {
    if (!socket) {
        socket = io("http://localhost:8080", {
            transports: ["websocket"],
            reconnection: true,
        });
    }
    return socket;
};

export const listenSocketCommits = (onNewCommit) => {
    const s = getSocket();

    s.on("connect", () => {
        console.log("✅ [Socket] Connected:", s.id);
    });

    s.on("new_commit", (commit) => {
        console.log("🔥 [Socket] New commit:", commit);
        onNewCommit(commit);
    });

    s.on("disconnect", () => {
        console.log("❌ [Socket] Disconnected");
    });

    // Cleanup khi unmount
    return () => {
        s.off("new_commit", onNewCommit);
    };
};
