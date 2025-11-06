import React, { useRef, useEffect } from 'react';

const LineChart = ({ data, width = 400, height = 300, className = "" }) => {
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

    // Find max values for scaling
    const maxRevenue = Math.max(...data.map(d => d.revenue));
    const maxExpenses = Math.max(...data.map(d => d.expenses));
    const maxValue = Math.max(maxRevenue, maxExpenses);

    // Calculate step size
    const stepX = chartWidth / (data.length - 1);

    // Set up styling
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.strokeWidth = 2;

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

    // Vertical grid lines and X-axis labels
    data.forEach((item, index) => {
      const x = padding + stepX * index;

      // Grid line
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      // X-axis label
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.fillText(item.monthShort, x, height - padding + 20);
    });

    // Draw revenue line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((item, index) => {
      const x = padding + stepX * index;
      const y = padding + chartHeight - (item.revenue / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw revenue points
    ctx.fillStyle = '#22c55e';
    data.forEach((item, index) => {
      const x = padding + stepX * index;
      const y = padding + chartHeight - (item.revenue / maxValue) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw expenses line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((item, index) => {
      const x = padding + stepX * index;
      const y = padding + chartHeight - (item.expenses / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw expenses points
    ctx.fillStyle = '#ef4444';
    data.forEach((item, index) => {
      const x = padding + stepX * index;
      const y = padding + chartHeight - (item.expenses / maxValue) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw legend
    const legendY = 20;

    // Revenue legend
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(width - 150, legendY, 12, 12);
    ctx.fillStyle = '#374151';
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Revenue', width - 130, legendY + 9);

    // Expenses legend
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(width - 150, legendY + 20, 12, 12);
    ctx.fillStyle = '#374151';
    ctx.fillText('Expenses', width - 130, legendY + 29);

  }, [data, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default LineChart;