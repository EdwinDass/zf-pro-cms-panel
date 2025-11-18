// src/components/qr-dashboard/QRStats.tsx

import React, { FC, useEffect, useRef } from "react";
import * as echarts from "echarts";

interface QRStatsProps {
  generated: number;
  scanned: number;
}

const QRStats: FC<QRStatsProps> = ({ generated, scanned }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const scanRate =
    generated > 0 ? ((scanned / generated) * 100).toFixed(1) : "0.0";
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    chart.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
      },
      legend: {
        bottom: 0,
        orient: "horizontal"
      },
      series: [
        {
          name: "QR Stats",
          type: "pie",
          radius: ["50%", "75%"],
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold"
            }
          },
          data: [
            { value: generated, name: "Generated", itemStyle: { color: "#3B82F6" } },
            { value: scanned, name: "Scanned", itemStyle: { color: "#F59E0B" } }
          ]
        }
      ]
    });

    // Cleanup on unmount
    return () => {
      chart.dispose();
    };
  }, [generated, scanned]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border mt-6">
      <h2 className="text-xl font-semibold mb-6">QR Statistics</h2>

      <div className="w-full flex justify-center mb-8">
        <div ref={chartRef} style={{ width: 350, height: 300 }}></div>
      </div>

      {/* Stats list */}
      <div className="grid grid-cols-2 gap-y-3 text-gray-700">
        <span>Total QRs Generated</span>
        <span className="text-right font-semibold">
          {generated.toLocaleString()}
        </span>

        <span>Total QRs Scanned</span>
        <span className="text-right font-semibold">
          {scanned.toLocaleString()}
        </span>
        <span>Scan Rate</span>
        <span className="text-right font-semibold">
          {scanRate}%
        </span>
      </div>
    </div>
  );
};

export default QRStats;
