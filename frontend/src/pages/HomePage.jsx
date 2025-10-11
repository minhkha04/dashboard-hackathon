import { useCallback, useEffect, useState } from 'react'
import CommitBoard from '../components/CommitBoard/CommitBoard'
import MainHeader from '../components/MainHeader/MainHeader'
import { commitService } from '../service/commit.service'
import { io } from 'socket.io-client'
import CommitBoardV2 from '../components/CommitBoard/CommitBoardV2'

// 🧩 Hàm merge commit vào repo
const mergeCommitToRepo = (currentList, newCommit) => {
    const updated = [...currentList];
    const repoIndex = updated.findIndex(
        (r) => r.repo_full_name === newCommit.repo_full_name
    );

    if (repoIndex !== -1) {
        // repo đã có sẵn → thêm commit mới
        const repo = updated[repoIndex];
        repo.commits.unshift({
            commit_sha: newCommit.commit_sha,
            created_at: newCommit.created_at,
            isNew: true,
        });
        repo.total_commits += 1;
    } else {
        // repo mới hoàn toàn
        updated.unshift({
            repo_full_name: newCommit.repo_full_name,
            total_commits: 1,
            commits: [
                {
                    commit_sha: newCommit.commit_sha,
                    created_at: newCommit.created_at,
                    isNew: true,
                },
            ],
        });
    }

    // sắp xếp repo theo commit mới nhất
    updated.sort((a, b) => {
        const aTime = new Date(a.commits[0]?.created_at || 0);
        const bTime = new Date(b.commits[0]?.created_at || 0);
        return bTime - aTime;
    });

    return updated;
}

// 🧩 Hàm nhận socket commit mới
const useSocketCommits = (onNewCommit) => {
    useEffect(() => {
        // ⚙️ Dùng static reference để tránh tạo nhiều socket khi re-render
        const socket = io("http://localhost:8080", {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
        });

        console.log("🔌 Socket connecting...");

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
        });

        socket.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
        });

        socket.on("connect_error", (err) => {
            console.error("⚠️ Socket connection error:", err.message);
        });

        // 🔥 Lắng nghe commit mới
        socket.on("new_commit", (data) => {
            console.log("🟢 Commit mới từ socket:", data);
            if (data && typeof onNewCommit === "function") {
                onNewCommit(data);
            }
        });

        // 🚪 Cleanup khi component unmount hoặc F5
        return () => {
            console.log("🧹 Cleaning up socket...");
            socket.removeAllListeners(); // gỡ tất cả event listener
            socket.disconnect(); // đóng kết nối
        };
    }, [onNewCommit]);
};

const HomePage = () => {

    const [commits, setCommits] = useState([]);

    // get initial commits
    useEffect(() => {
        commitService.getAll()
            .then(res => {
                const list = res.data?.data || [];
                setCommits(list);
                console.log("Fetched commits:", list);
            })
            .catch(console.error);
    }, []);

    // 2️⃣ Nhận commit mới từ socket
    const handleSocketCommit = useCallback(
        (newCommit) => {
            setCommits((prev) => mergeCommitToRepo(prev, newCommit));
        },
        [setCommits]
    );

    useSocketCommits(handleSocketCommit);


    return (
        <div className='min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-cyan-900 relative overflow-hidden'>
            {/* Futuristic background effects with brighter colors */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/15 via-blue-400/15 to-purple-400/15 animate-pulse"></div>

            {/* Tech grid pattern overlay with brighter cyan */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="w-full h-full"
                    style={{
                        backgroundImage: `
                             linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
                         `,
                        backgroundSize: '50px 50px'
                    }}>
                </div>
            </div>


            {/* Scanning lines with brighter neon colors */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-pulse opacity-90 shadow-cyan-300 shadow-lg"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent animate-pulse delay-1000 opacity-90 shadow-purple-300 shadow-lg"></div>

            {/* Side glow effects with enhanced brightness */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-300 to-transparent animate-pulse delay-500 opacity-90 shadow-blue-300 shadow-lg"></div>
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-pulse delay-1500 opacity-90 shadow-cyan-300 shadow-lg"></div>

            {/* Main content with enhanced glassmorphism */}
            <div className="relative z-10 ">
                <MainHeader />

                {commits && commits.length > 0 ? (
                    <CommitBoard data={commits} />
                ) : (
                    <div className="flex items-center justify-center h-[85vh] text-center">
                        <div className="space-y-4">
                            <div className="text-6xl text-cyan-300/50 font-mono">
                                [ NO DATA ]
                            </div>
                            <div className="text-cyan-200/70 text-lg font-mono tracking-wide">
                                WAITING FOR COMMIT DATA...
                            </div>
                            <div className="flex justify-center space-x-2 mt-6">
                                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {/* Enhanced ambient lighting with brighter colors */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl opacity-60 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-blue-400/15 rounded-full blur-2xl opacity-50 animate-pulse delay-500"></div>
        </div>
    )
}

export default HomePage
