export function convertCommitsToHeatmap(data) {
    const hours = [7, 8, 9, 10, 11, 12, 13, 14];
    const SLOT_COUNT = 4;
    const SLOT_MINUTES = 60 / SLOT_COUNT;

    return data.map(repo => {
        const heatmap = {};
        for (const h of hours) heatmap[h] = new Array(SLOT_COUNT).fill(0);

        const commits = repo.commits || [];

        // ======================================================
        // 🧪 TEST MODE (chỉ dùng khi test)
        // 👉 Bỏ comment khối này để bật chế độ test
        if (commits.length > 0) {
            // Random chọn 1 commit bất kỳ để test heatmap
            const randomCommit = commits[Math.floor(Math.random() * commits.length)];
            const d = new Date(randomCommit.created_at);
            let hour = d.getHours();
            const slot = Math.floor(d.getMinutes() / SLOT_MINUTES);

            // Nếu giờ nằm ngoài khung [7–14] → random 1 giờ hợp lệ
            if (hour < 7 || hour > 14) {
                const randomValidHour = hours[Math.floor(Math.random() * hours.length)];
                hour = randomValidHour;
            }

            // Tự tạo khung nếu giờ chưa tồn tại (tránh lỗi undefined)
            if (!heatmap[hour]) heatmap[hour] = new Array(SLOT_COUNT).fill(0);

            heatmap[hour][slot] += 1;

            return {
                repo_full_name: repo.repo_full_name,
                heatmap,
                highlight: !!repo.highlight,
            };
        }

        // 🧩 PRODUCTION LOGIC (giữ nguyên logic gốc)
        commits.forEach(commit => {
            const d = new Date(commit.created_at);
            const hour = d.getHours();
            if (hour < 7 || hour > 14) return;
            const slot = Math.floor(d.getMinutes() / SLOT_MINUTES);
            heatmap[hour][slot] += 1;
        });

        return {
            repo_full_name: repo.repo_full_name,
            heatmap,
            highlight: !!repo.highlight,
        };
    });
}


export function sortReposByLatestCommit(repos) {
    return [...repos].sort((a, b) => {
        const latestA = Math.max(...a.commits.map(c => new Date(c.created_at).getTime()));
        const latestB = Math.max(...b.commits.map(c => new Date(c.created_at).getTime()));
        return latestB - latestA; // Mới nhất lên trước
    });
}

const generateFakeCommits = (repoName) => {
    const commits = [];
    const startHour = 7;
    const endHour = 15; // exclusive (tức 14:59 là cuối)
    const now = new Date();

    const base = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        startHour,
        0,
        0,
        0
    );

    const totalMinutes = (endHour - startHour) * 60; // 480 phút
    const avgCommitPer3Min = 2; // trung bình 2 commit / 3 phút
    const totalCommits = Math.floor((totalMinutes / 3) * avgCommitPer3Min);

    for (let i = 0; i < totalCommits; i++) {
        // Random phút trong khung 7g–14g59
        const randomMinutes = Math.floor(Math.random() * totalMinutes);
        const commitTime = new Date(base.getTime() + randomMinutes * 60 * 1000);

        // Thêm random vài giây cho tự nhiên
        commitTime.setSeconds(Math.floor(Math.random() * 60));

        commits.push({
            commit_sha: `${repoName.replace(/\s/g, "_").toLowerCase()}_${i
                .toString()
                .padStart(4, "0")}`,
            created_at: commitTime.toISOString(),
        });
    }

    // Sắp xếp commit theo thời gian (cho dễ đọc)
    commits.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return {
        repo_full_name: repoName,
        total_commits: commits.length,
        commits,
    };
};

export const fake_data = [
    generateFakeCommits("SWP391-FALL2025/Team-1"),
    generateFakeCommits("SWP391-FALL2025/Team-Hehe"),
    generateFakeCommits("SWP391-FALL2025/Project-Oke"),
    generateFakeCommits("SWP391-FALL2025/Project-Fake"),
    generateFakeCommits("SWP391-FALL2025/Project-Bot"),
    generateFakeCommits("SWP391-FALL2025/Project-Not-Exist"),
    generateFakeCommits("SWP391-FALL2025/Project-Test"),
    generateFakeCommits("SWP391-FALL2025/Project-Demo"),
    generateFakeCommits("SWP391-FALL2025/Project-Alpha"),
    generateFakeCommits("SWP391-FALL2025/Project-Beta"),
    generateFakeCommits("SWP391-FALL2025/Project-Gamma"),
    generateFakeCommits("SWP391-FALL2025/Project-Delta"),
    generateFakeCommits("SWP391-FALL2025/Project-Epsilon"),
    generateFakeCommits("SWP391-FALL2025/Project-Zeta"),
    generateFakeCommits("SWP391-FALL2025/Repo-team-1"),
    generateFakeCommits("SWP391-FALL2025/Repo-team-2"),
    generateFakeCommits("SWP391-FALL2025/Repo-team-3"),
    generateFakeCommits("SWP391-FALL2025/Repo-team-4"),
    generateFakeCommits("SWP391-FALL2025/Repo-team-5"),
    generateFakeCommits("SWP391-FALL2025/Oke-Team"),
    generateFakeCommits("SWP391-FALL2025/Great-Team"),
    generateFakeCommits("SWP391-FALL2025/Awesome-Team"),
    generateFakeCommits("SWP391-FALL2025/Super-Team"),
    generateFakeCommits("SWP391-FALL2025/Mega-Team"),
];

// 🎨 30 màu OKLCH cố định – tone sáng, contrast cao cho nền tối
const OKLCH_PALETTE_30 = [
    "oklch(0.70 0.28 0)",     // Red
    "oklch(0.70 0.28 12)",    // Orange-red
    "oklch(0.70 0.28 24)",    // Orange
    "oklch(0.70 0.28 36)",    // Warm yellow
    "oklch(0.70 0.28 48)",    // Yellow
    "oklch(0.70 0.28 60)",    // Lime yellow
    "oklch(0.70 0.28 72)",    // Yellow-green
    "oklch(0.70 0.28 84)",    // Green
    "oklch(0.70 0.28 96)",    // Green-cyan
    "oklch(0.70 0.28 108)",   // Cyan
    "oklch(0.70 0.28 120)",   // Aqua
    "oklch(0.70 0.28 132)",   // Sky cyan
    "oklch(0.70 0.28 144)",   // Teal
    "oklch(0.70 0.28 156)",   // Sea green
    "oklch(0.70 0.28 168)",   // Emerald
    "oklch(0.70 0.28 180)",   // Pure cyan-blue
    "oklch(0.70 0.28 192)",   // Azure blue
    "oklch(0.70 0.28 204)",   // Sky blue
    "oklch(0.70 0.28 216)",   // Blue
    "oklch(0.70 0.28 228)",   // Indigo
    "oklch(0.70 0.28 240)",   // Deep violet
    "oklch(0.70 0.28 252)",   // Purple
    "oklch(0.70 0.28 264)",   // Magenta purple
    "oklch(0.70 0.28 276)",   // Magenta
    "oklch(0.70 0.28 288)",   // Hot pink
    "oklch(0.70 0.28 300)",   // Pink
    "oklch(0.70 0.28 312)",   // Rose
    "oklch(0.70 0.28 324)",   // Red-pink
    "oklch(0.70 0.28 336)",   // Warm red
    "oklch(0.70 0.28 348)",   // Deep crimson
];


// 🗺️ Lưu map repo → màu vào localStorage
export function getTeamColor(teamName) {
    if (!teamName) return '#ccc';

    const storageKey = `team-color-map`;
    let colorMap = {};

    // 🔹 Load từ localStorage
    try {
        colorMap = JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch {
        colorMap = {};
    }

    // 🔹 Nếu repo đã có màu → trả về luôn
    if (colorMap[teamName]) return colorMap[teamName];

    // 🔹 Nếu chưa có → lấy màu tiếp theo trong palette
    const usedColors = Object.values(colorMap);
    const available = OKLCH_PALETTE_30.find(c => !usedColors.includes(c));
    const color = available || OKLCH_PALETTE_30[usedColors.length % OKLCH_PALETTE_30.length];

    // 🔹 Lưu lại để cố định lần sau (F5 vẫn giữ)
    colorMap[teamName] = color;
    localStorage.setItem(storageKey, JSON.stringify(colorMap));

    return color;
}

export function getRepoShortName(fullName) {
    if (typeof fullName !== "string") return "";

    const parts = fullName.split("/");
    return parts.length > 1 ? parts[parts.length - 1] : fullName;
}
