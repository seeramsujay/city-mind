import React from 'react';
import PipelineHeader from '../components/PipelineHeader';
import StatCards from '../components/StatCards';
import CityMap from '../components/CityMap';
import ZonePanel from '../components/ZonePanel';
import BaselineDiff from '../components/BaselineDiff';
import CommitStream from '../components/CommitStream';
import MemoryArchitecture from '../components/MemoryArchitecture';
import DataSavingsCard from '../components/DataSavingsCard';

export default function LiveCityPage({ 
  zones, 
  commits, 
  selectedZone, 
  onSelectZone, 
  onCloseZonePanel, 
  onSelectCommit 
}) {
  return (
    <div className="space-y-6">
      {/* Prominent Hackathon Concept Pipeline */}
      <PipelineHeader />

      {/* 5 High-Quality Stat Cards */}
      <StatCards zones={zones} commitCount={commits.length} />

      {/* City Map + Zone Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={selectedZone ? "lg:col-span-2" : "lg:col-span-3"}>
          <CityMap 
            zones={zones} 
            selectedZone={selectedZone} 
            onSelectZone={onSelectZone} 
          />
        </div>

        {selectedZone && (
          <div className="lg:col-span-1">
            <ZonePanel 
              zone={selectedZone} 
              commits={commits} 
              onClose={onCloseZonePanel} 
              onViewCommitDetails={onSelectCommit} 
            />
          </div>
        )}
      </div>

      {/* Baseline vs Diff Component */}
      <BaselineDiff selectedZone={selectedZone} />

      {/* Live Commit Stream */}
      <CommitStream commits={commits} onSelectCommit={onSelectCommit} />

      {/* Memory Architecture Section */}
      <MemoryArchitecture />

      {/* Data Savings Card */}
      <DataSavingsCard />
    </div>
  );
}
