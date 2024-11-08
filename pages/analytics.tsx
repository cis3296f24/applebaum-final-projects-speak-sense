import React from 'react';
import Page from '../PWASetUp/components/page';
import Section from '../PWASetUp/components/section';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage: React.FC = () => {
  // Example data - replace with real data from your storage service
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Words per Session',
        data: [150, 230, 180, 290, 200, 250, 300],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      }
    ]
  };

  return (
    <Page>
      <Section title="Analytics">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Total Sessions</h3>
              <p className="text-2xl font-bold">7</p>
            </div>
            <div className="bg-surface p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Avg. Words per Session</h3>
              <p className="text-2xl font-bold">228</p>
            </div>
            <div className="bg-surface p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Most Used Word</h3>
              <p className="text-2xl font-bold">the</p>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Weekly Progress</h3>
            <Line
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </div>
        </div>
      </Section>
    </Page>
  );
};

export default AnalyticsPage;