import MasterDataManager from '../../../components/MasterDataManager';

type Batch = {
  id: number;
  farm: { id: number; name: string } | number;
  name: string;
  size: number;
  start_date: string;
  end_date: string | null;
  status: string;
};

export default function BatchesPage() {
  return (
    <MasterDataManager<Batch>
      title="Batches"
      endpoint="batches/"
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'farm', header: 'Farm', render: (row) => (typeof row.farm === 'object' ? row.farm.name : row.farm) },
        { key: 'size', header: 'Size' },
        { key: 'start_date', header: 'Start Date' },
        { key: 'status', header: 'Status' },
      ]}
      fields={[
        { type: 'text', name: 'name', label: 'Name', required: true },
        { type: 'text', name: 'farm', label: 'Farm ID', required: true, placeholder: 'Enter Farm ID' },
        { type: 'text', name: 'size', label: 'Size', required: true, placeholder: 'Number of birds' },
        { type: 'text', name: 'start_date', label: 'Start Date (YYYY-MM-DD)', required: true },
        { type: 'text', name: 'end_date', label: 'End Date (optional)' },
        { type: 'text', name: 'status', label: 'Status', required: true },
      ]}
      normalizeIn={(v) => ({ ...v, farm: Number(v.farm), size: Number(v.size) })}
    />
  );
}


