import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import {
    GridComponent,
    TooltipComponent,
    TitleComponent
} from "echarts/components";
import { BarChart, ScatterChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
    GridComponent,
    TooltipComponent,
    TitleComponent,
    BarChart,
    ScatterChart,
    CanvasRenderer
]);

const CommitBoard = ({ data }) => {
    data = [
        { repo: "A", totalCommit: 12, commits: ["06:10", "08:15", "10:20", "13:05"] },
        { repo: "B", totalCommit: 32, commits: ["07:00", "09:15", "09:30", "11:45", "14:10"] },
        { repo: "C", totalCommit: 1, commits: ["08:50"] },
        { repo: "D", totalCommit: 2, commits: ["10:00", "12:30"] },
        { repo: "E", totalCommit: 3, commits: ["07:45", "09:00", "13:30"] },
        { repo: "F", totalCommit: 5, commits: ["06:15", "08:45", "11:00", "13:15", "14:40"] }
    ];

    const { categories, totals, scatterData, maxTotal } = useMemo(() => {
        const categories = data.map((d) => d.repo);
        const totals = data.map((d) => d.totalCommit);
        const maxTotal = Math.max(...totals, 1);

        // chuyển "06:30" -> timestamp
        const toTimeMs = (timeStr) => {
            const [h, m] = timeStr.split(":").map(Number);
            return new Date(2025, 0, 1, h, m).getTime();
        };

        const scatterData = data.flatMap((r, i) =>
            r.commits.map((t) => [toTimeMs(t), i])
        );

        return { categories, totals, scatterData, maxTotal };
    }, [data]);

    const option = {
        title: [
            { left: 20, top: 8, text: "Repo" },
            { left: 110, top: 8, text: "Commit total" },
        ],
        grid: [
            { left: 80, top: 40, bottom: 40, width: 80 },
            { left: 170, right: 30, top: 40, bottom: 40 }
        ],
        tooltip: {
            trigger: "item",
            formatter: (p) => {
                if (p.seriesType === "scatter") {
                    const date = new Date(p.value[0]);
                    const hh = date.getHours().toString().padStart(2, "0");
                    const mm = date.getMinutes().toString().padStart(2, "0");
                    return `
            <div><b>Repo:</b> ${categories[p.value[1]]}</div>
            <div><b>Time:</b> ${hh}:${mm}</div>
          `;
                }
                return "";
            }
        },
        xAxis: [
            {
                type: "value",
                gridIndex: 0,
                min: 0,
                max: Math.max(5, Math.ceil((maxTotal + 1) / 5) * 5),
                splitLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                axisLine: { show: false }
            },
            {
                type: "time",
                gridIndex: 1,
                min: new Date(2025, 0, 1, 6, 0).getTime(),
                max: new Date(2025, 0, 1, 15, 0).getTime(),
                axisLabel: {
                    formatter: (v) => {
                        const d = new Date(v);
                        return `${d.getHours()}:00`;
                    }
                },
                splitLine: { show: true }
            }
        ],
        yAxis: [
            {
                type: "category",
                gridIndex: 0,
                data: categories,
                axisLabel: { align: "right", margin: 10 },
                axisTick: { show: false }
            },
            {
                type: "category",
                gridIndex: 1,
                data: categories,
                axisLabel: { show: false },
                axisTick: { show: false }
            }
        ],
        series: [
            // Cột “Commit total” bên trái
            {
                type: "bar",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: totals,
                barWidth: 16,
                itemStyle: { opacity: 0 },
                label: {
                    show: true,
                    position: "right",
                    formatter: ({ value }) => `${value}`
                },
                silent: true
            },
            // Dữ liệu commit theo giờ
            {
                type: "scatter",
                xAxisIndex: 1,
                yAxisIndex: 1,
                symbolSize: 12,
                data: scatterData,
                encode: { x: 0, y: 1 },
                tooltip: { trigger: "item" }
            }
        ]
    };

    return (
        <ReactECharts
            echarts={echarts}
            option={option}
            style={{ height: '85vh', width: "100%" }}
        />
    );
};

export default CommitBoard;
