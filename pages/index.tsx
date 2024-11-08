import React from 'react';
import Page from '../PWASetUp/components/page';
import Section from '../PWASetUp/components/section';

export default function Home() {
  return (
    <Page>
      <Section title="Today's Stats">
        {/* Today's stats content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Total Words</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-surface p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Top Used</h3>
            <p className="text-2xl font-bold">-</p>
          </div>
          <div className="bg-surface p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Second Most</h3>
            <p className="text-2xl font-bold">-</p>
          </div>
          <div className="bg-surface p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Less Used</h3>
            <p className="text-2xl font-bold">-</p>
          </div>
        </div>
      </Section>

      <Section title="Top Words">
        <div className="bg-surface p-4 rounded-lg">
          {/* Top words content */}
          <p className="text-gray-400">No recordings yet</p>
        </div>
      </Section>
    </Page>
  );
}