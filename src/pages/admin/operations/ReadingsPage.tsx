import MasterDataManager from '../../../components/MasterDataManager';

type Reading = {
  id: number;
  device: { id: number; name: string } | number;
  sensor_type: { id: number; name: string; unit: string } | number;
  value: number;
  timestamp: string;
};

export default function ReadingsPage() {
  return (
    <MasterDataManager<Reading>
      title="Readings"
      endpoint="readings/"
      columns={[
        { key: 'timestamp', header: 'Timestamp' },
        { key: 'device', header: 'Device', render: (r) => (typeof r.device === 'object' ? r.device.name : r.device) },
        { key: 'sensor_type', header: 'Sensor', render: (r) => (typeof r.sensor_type === 'object' ? `${r.sensor_type.name} (${r.sensor_type.unit})` : r.sensor_type) },
        { key: 'value', header: 'Value' },
      ]}
      fields={[
        { type: 'text', name: 'timestamp', label: 'Timestamp (ISO or YYYY-MM-DD HH:MM:SS)', required: true },
        { type: 'text', name: 'device', label: 'Device ID', required: true },
        { type: 'text', name: 'sensor_type', label: 'Sensor Type ID', required: true },
        { type: 'text', name: 'value', label: 'Value', required: true },
      ]}
      normalizeIn={(v) => ({ ...v, device: Number(v.device), sensor_type: Number(v.sensor_type), value: Number(v.value) })}
    />
  );
}


