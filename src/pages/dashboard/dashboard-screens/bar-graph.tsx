// src/components/BarGraph/BarGraph.tsx

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface BarGraphProps {
  labels: string[];           // ['Mon', 'Tue', ...]
  datasetA: number[];         // [820, 932, ...]
  datasetB: number[];         // [720, 800, ...]
}

const BarGraph: React.FC<BarGraphProps> = ({ labels, datasetA, datasetB }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current!);

    const option = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Dataset A", "Dataset B"],
        top: 10,            // moves legend downward
      },
      xAxis: {
        type: "category",
        data: labels,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Dataset A",
          type: "bar",
          data: datasetA,
        },
        {
          name: "Dataset B",
          type: "bar",
          data: datasetB,
        },
      ],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
    };

    chart.setOption(option);

    // Auto resize
    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current!);

    return () => {
      chart.dispose();
      resizeObserver.disconnect();
    };
  }, [labels, datasetA, datasetB]);

  return <div ref={chartRef} className="w-full h-64" />;
};

export default BarGraph;
