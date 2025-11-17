// src/components/LineGraph/LineGraph.tsx

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface LineGraphProps {
    labels: string[];     // ['Mon', 'Tue', ...]
    values: number[];     // [820, 932, ...]
}

const LineGraph: React.FC<LineGraphProps> = ({ labels, values }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chart = echarts.init(chartRef.current!);

        const option = {
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: labels,
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    data: values,
                    type: "line",
                    areaStyle: {},
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 6,
                },
            ],
            tooltip: {
                trigger: "axis",
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
        };

        chart.setOption(option);

        // Auto-resize
        const resizeObserver = new ResizeObserver(() => chart.resize());
        resizeObserver.observe(chartRef.current!);

        return () => {
            chart.dispose();
            resizeObserver.disconnect();
        };
    }, [labels, values]);

    return <div ref={chartRef} className="w-full h-64" />;
};

export default LineGraph;
