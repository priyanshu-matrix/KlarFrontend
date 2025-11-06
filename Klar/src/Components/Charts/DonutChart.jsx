import React, { useRef, useEffect } from 'react';

const DonutChart = ({ data, width = 300, height = 300, className = "" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (!data || data.length === 0) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2 - 20;
    const innerRadius = outerRadius * 0.6;

    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) return;

    let currentAngle = -Math.PI / 2; // Start from top

    // Draw segments
    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;

      // Draw slice
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();

      ctx.fillStyle = item.color;
      ctx.fill();

      // Add subtle stroke
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      currentAngle += sliceAngle;
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#f9fafb';
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw total in center
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(total, centerX, centerY);

    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Total', centerX, centerY + 20);

  }, [data, width, height]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className={className}
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {data?.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600 truncate">
              {item.name}
            </span>
            <span className="text-gray-900 font-medium ml-auto">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;