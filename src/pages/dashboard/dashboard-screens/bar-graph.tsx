// src/components/BarGraph/BarGraph.tsx

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface BarGraphProps {
  labels: string[];           // ['Mon', 'Tue', ...]
  datasetA: number[];         // [820, 932, ...]
  datasetB: number[];         // [720, 800, ...]
  nameA?: string;             // Name for dataset A (default: "Points Issued")
  nameB?: string;             // Name for dataset B (default: "Points Redeemed")
}

const BarGraph: React.FC<BarGraphProps> = ({
  labels,
  datasetA,
  datasetB,
  nameA = "Points Issued",
  nameB = "Points Redeemed",
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current!);

    const option = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: [nameA, nameB],
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
          name: nameA,
          type: "bar",
          data: datasetA,
        },
        {
          name: nameB,
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
  }, [labels, datasetA, datasetB, nameA, nameB]);

  return <div ref={chartRef} className="w-full h-64" />;
};

export default BarGraph;
