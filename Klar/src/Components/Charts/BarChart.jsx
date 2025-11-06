import React, { useRef, useEffect } from 'react';

const BarChart = ({ data, width = 400, height = 300, className = "" }) => {
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

    // Set up chart area
    const padding = 50;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.value));

    // Calculate bar width
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;

    // Set up styling
    ctx.font = '12px Inter, system-ui, sans-serif';

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels
      const value = maxValue * (1 - i / 5);
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'right';
      ctx.fillText(`$${(value / 1000).toFixed(0)}k`, padding - 10, y + 4);
    }

    // Draw bars
    data.forEach((item, index) => {
      const x = padding + (chartWidth / data.length) * index + barSpacing / 2;
      const barHeight = (item.value / maxValue) * chartHeight;
      const y = padding + chartHeight - barHeight;

      // Draw bar
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, item.color || '#3b82f6');
      gradient.addColorStop(1, item.color ? item.color + '80' : '#3b82f680');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw bar border
      ctx.strokeStyle = item.color || '#3b82f6';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, barWidth, barHeight);

      // Draw value on top of bar
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'center';
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.fillText(`$${(item.value / 1000).toFixed(1)}k`, x + barWidth / 2, y - 5);

      // Draw category name
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Inter, system-ui, sans-serif';
      const maxLabelWidth = barWidth + barSpacing;
      const label = item.name.length > 8 ? item.name.substring(0, 8) + '...' : item.name;
      ctx.fillText(label, x + barWidth / 2, height - padding + 15);
    });

  }, [data, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default BarChart;