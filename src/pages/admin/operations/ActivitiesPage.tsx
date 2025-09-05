import MasterDataManager from '../../../components/MasterDataManager';

type Activity = {
  id: number;
  batch: { id: number; name: string } | number;
  activity_type: { id: number; name: string } | number;
  date: string;
  notes: string;
};

export default function ActivitiesPage() {
  return (
    <MasterDataManager<Activity>
      title="Activities"
      endpoint="batch-activities/"
      columns={[
        { key: 'date', header: 'Date' },
        { key: 'batch', header: 'Batch', render: (r) => (typeof r.batch === 'object' ? r.batch.name : r.batch) },
        { key: 'activity_type', header: 'Type', render: (r) => (typeof r.activity_type === 'object' ? r.activity_type.name : r.activity_type) },
        { key: 'notes', header: 'Notes' },
      ]}
      fields={[
        { type: 'text', name: 'date', label: 'Date (YYYY-MM-DD)', required: true },
        { type: 'text', name: 'batch', label: 'Batch ID', required: true },
        { type: 'text', name: 'activity_type', label: 'Activity Type ID', required: true },
        { type: 'textarea', name: 'notes', label: 'Notes' },
      ]}
      normalizeIn={(v) => ({ ...v, batch: Number(v.batch), activity_type: Number(v.activity_type) })}
    />
  );
}


