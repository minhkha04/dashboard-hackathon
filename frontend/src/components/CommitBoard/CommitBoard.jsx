import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

const CommitBoard = ({ data }) => {
    console.log("Fetched commits in board:", data);

    // constants layout
    const REPO_COL_WIDTH = 100;
    const TOTAL_COL_WIDTH = 90;
    const GAP_COL = 12;
    const gridLeft = REPO_COL_WIDTH + TOTAL_COL_WIDTH + GAP_COL + 40;

    // 2️⃣ Sắp xếp repo theo commit mới nhất
    const sorted = useMemo(() => {
        return [...data].sort((a, b) => {
            const aTime = a.commits.length ? new Date(a.commits[0].created_at) : 0;
            const bTime = b.commits.length ? new Date(b.commits[0].created_at) : 0;
            return bTime - aTime;
        });
    }, [data]);

    // 3️⃣ Map repo name → info nhanh
    const byName = useMemo(() => {
        const map = new Map();
        sorted.forEach(r => map.set(r.repo_full_name, r));
        return map;
    }, [sorted]);

    // 4️⃣ Flatten commits ra thành các điểm scatter
    const points = useMemo(() => {
        return sorted.flatMap(repo =>
            repo.commits.map(c => ({
                value: [c.created_at, repo.repo_full_name, c.commit_sha],
                url: `https://github.com/${repo.repo_full_name}/commit/${c.commit_sha}`,
                isNew: false, // Đặt tất cả commit về size bình thường
            }))
        );
    }, [sorted]);

    // 5️⃣ ECharts option
    const option = useMemo(
        () => ({
            backgroundColor: "transparent", // Changed to transparent for futuristic background
            grid: { left: gridLeft, right: 50, top: 120, bottom: 60 },

            title: [
                {
                    text: "REALTIME COMMIT",
                    left: "center",
                    top: 25,
                    textStyle: {
                        color: "#00ffff",
                        fontSize: 30,
                        fontWeight: "bold",
                        fontFamily: "monospace",
                        textShadowColor: "#00ffff",
                        textShadowBlur: 10,
                        textShadowOffsetX: 0,
                        textShadowOffsetY: 0
                    },
                },
                {
                    text: "TEAM",
                    left: 20,
                    top: 100,
                    textStyle: {
                        color: "#00eaff",
                        fontSize: 30,
                        fontWeight: "bold",
                        fontFamily: "monospace"
                    },
                },
                {
                    text: "COMMIT",
                    left: REPO_COL_WIDTH + 30,
                    top: 100,
                    textStyle: {
                        color: "#ffd166",
                        fontSize: 30,
                        fontWeight: "bold",
                        fontFamily: "monospace"
                    },
                },
            ],
            // table where hover
            tooltip: {
                trigger: "item",
                backgroundColor: "rgba(15, 15, 15, 0.95)",
                borderColor: "#00ffff",
                borderWidth: 2,
                textStyle: {
                    color: "#00ffff",
                    fontFamily: "monospace",
                    fontSize: 12
                },
                formatter: p =>
                    `<div style="border-left: 3px solid #00ffff; padding-left: 8px;">
                        <b style="color: #00ffff;">[SQUAD]: ${p.value[1]}</b><br/>
                        <span style="color: #ffd166;">[SHA]: ${p.value[2]}</span><br/>
                        <span style="color: #8a2be2;">[TIMESTAMP]: ${new Date(p.value[0]).toLocaleString("vi-VN")}</span>
                    </div>`,
                extraCssText: `
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
                    border-radius: 4px;
                `
            },

            xAxis: {
                type: "time",
                name: "Time",
                nameTextStyle: {
                    color: "#00ffff",
                    fontFamily: "monospace",
                    fontSize: 12
                },
                nameLocation: "middle",
                nameGap: 35,
                axisLabel: {
                    color: "#00eaff",
                    fontFamily: "monospace",
                    fontSize: 10,
                    formatter: val =>
                        new Date(val).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#00ffff",
                        width: 2,
                        shadowColor: "#00ffff",
                        shadowBlur: 5
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#001a33",
                        type: "dashed",
                        opacity: 0.5
                    }
                },
            },

            yAxis: {
                type: "category",
                inverse: true,
                data: sorted.map(r => r.repo_full_name),
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#00ffff",
                        width: 2,
                        shadowColor: "#00ffff",
                        shadowBlur: 5
                    }
                },
                axisTick: { show: false },
                axisLabel: {
                    margin: 12,
                    formatter: value => {
                        const repo = byName.get(value);
                        return `{repo|${repo.repo_full_name}}{gap|}{total|${repo.total_commits}}`;
                    },
                    rich: {
                        repo: {
                            color: "#00eaff",
                            fontWeight: "bold",
                            fontSize: 20,
                            width: REPO_COL_WIDTH,
                            align: "left",
                            fontFamily: "monospace",
                            textShadowColor: "#00eaff",
                            textShadowBlur: 3,
                        },
                        gap: { width: GAP_COL },
                        total: {
                            width: TOTAL_COL_WIDTH,
                            align: "center",
                            color: "#ffd166",
                            fontSize: 20,
                            fontFamily: "monospace",
                            padding: [2, 4],
                        },
                    },
                },
            },

            series: [
                {
                    type: "scatter",
                    data: points.map(p => ({
                        ...p,
                        symbolSize: 24, // Size đồng nhất cho tất cả commits
                        itemStyle: {
                            color: "#00ff80", // Màu xanh neon đồng nhất
                            opacity: 0.9,
                            shadowColor: "#00ff80",
                            borderColor: "#ffffff",
                            borderWidth: 1,
                            borderType: "solid"
                        },
                    })),
                    emphasis: { itemStyle: { color: "#ff7777", borderColor: "#fff", borderWidth: 1 } },

                    animationDuration: 800,
                    animationEasing: "elasticOut",
                    animationDurationUpdate: 1200,
                    animationEasingUpdate: "bounceOut",
                },
            ],

            animationDurationUpdate: 1200,
            animationEasingUpdate: "bounceOut",
        }),
        [sorted, byName, points, gridLeft]
    );

    const onEvents = {
        click: params => {
            const url = params.data?.url;
            if (url) window.open(url, "_blank");
        },
    };

    return (
        <div className="w-90vw h-[85vh] ">
            {/* Chart container with futuristic border */}
            <div className="h-full">
                <ReactECharts
                    option={option}
                    onEvents={onEvents}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        </div>
    );
};

export default CommitBoard;
