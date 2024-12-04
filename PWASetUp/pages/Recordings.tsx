import { useState } from 'react';
import Page from '../components/page';
import Section from '../components/section';
import { Card, CardBody, Chip } from '@nextui-org/react';

interface Recording {
  id: number;
  title: string;
  date: string;
  duration: string;
}

const Recordings: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([
    { id: 1, title: 'Meeting 1', date: '2024-12-01', duration: '30:00' },
    { id: 2, title: 'Interview with Dr. Smith', date: '2024-12-02', duration: '45:30' },
    { id: 3, title: 'Conference Call', date: '2024-12-03', duration: '1:10:15' },
  ]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id); // Toggle between expanded or collapsed
  };

  const handleDelete = (id: number) => {
    setRecordings(recordings.filter((recording) => recording.id !== id));
  };

  return (
    <Page>
      <Section>
        <div className="p-2 height-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Recordings</h1>
              <p className="text-zinc-500">Manage your recorded sessions here</p>
            </div>
          </div>

          <div className="space-y-4">
            {recordings.map((recording) => (
              <Card
                key={recording.id}
                className="transition-all duration-300 ease-in-out"
              >
                <CardBody>
                  <div
                    onClick={() => handleToggle(recording.id)}
                    className="cursor-pointer p-4 flex justify-between items-center rounded-lg hover:bg-gray"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-gray-200">{recording.title}</h2>
                      <p className="text-gray-500">{recording.date}</p>
                      <p className="text-sm text-gray-400">{recording.duration}</p>
                    </div>
                    <span className="text-sm text-gray-600">⋮</span> {/* Ellipsis icon for more options */}
                  </div>

                  {/* Expandable content with animation */}
                  <div
                    className={`${
                      expandedId === recording.id ? 'max-h-40' : 'max-h-0'
                    } overflow-hidden transition-max-height duration-500 ease-in-out mt-0 flex justify-start space-x-4`}
                  >
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all duration-300 ease-in-out">
                      Play
                    </button>
                    <button
                      onClick={() => handleDelete(recording.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all duration-300 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </Page>
  );
};

export default Recordings;
