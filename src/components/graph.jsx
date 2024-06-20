// components/TimeSeriesGraph.js

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-zoom';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

const TimeSeriesGraph = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [period, setPeriod] = useState('daily');
  
  useEffect(() => {
    fetchRevenueData(period);
  }, [period]);

  const fetchRevenueData = async (period) => {
    const response = await fetch(`/api/revenue?period=${period}`);
    const data = await response.json();
    setRevenueData(data);
  };

  const data = {
    labels: revenueData.map(d => d.period),
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map(d => d.revenue),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: period === 'daily' ? 'day' : period === 'weekly' ? 'week' : 'month',
        },
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
  };

  return (
    <div>
      <div>
        <button onClick={() => setPeriod('daily')}>Daily</button>
        <button onClick={() => setPeriod('weekly')}>Weekly</button>
        <button onClick={() => setPeriod('monthly')}>Monthly</button>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default TimeSeriesGraph;
