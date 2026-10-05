import React, { useState } from 'react';
import { Sliders, Check, Save } from 'lucide-react';

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

export interface PrescriptionData {
  targetAngleDeg: number;
  targetReps: number;
  holdDurationSec: number;
  sessionsPerDay: number;
  exercises?: Exercise[];
}

interface PrescriptionEditorProps {
  initialData: PrescriptionData;
  onSave: (updated: PrescriptionData) => void;
}

export const PrescriptionEditor: React.FC<PrescriptionEditorProps> = ({ initialData, onSave }) => {
  const [data, setData] = useState<PrescriptionData>(initialData);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleSave = () => {
    onSave(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sliders size={18} color="#0f172a" />
          <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>Targets</h3>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>Set patient goals</p>
      </div>
      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#475569', fontSize: '13px' }}>
        Target Angle:
        <input type="number" value={data.targetAngleDeg} onChange={(e) => setData({ ...data, targetAngleDeg: Number(e.target.value) })} style={{ width: '80px', background: 'rgba(255, 255, 255, 0.8)', color: '#0f172a', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', padding: '6px 10px', fontWeight: 700 }} />
      </label>
      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#475569', fontSize: '13px' }}>
        Target Reps per Set:
        <input type="number" value={data.targetReps} onChange={(e) => setData({ ...data, targetReps: Number(e.target.value) })} style={{ width: '80px', background: 'rgba(255, 255, 255, 0.8)', color: '#0f172a', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', padding: '6px 10px', fontWeight: 700 }} />
      </label>
      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#475569', fontSize: '13px' }}>
        Hold Time (seconds):
        <input type="number" value={data.holdDurationSec} onChange={(e) => setData({ ...data, holdDurationSec: Number(e.target.value) })} style={{ width: '80px', background: 'rgba(255, 255, 255, 0.8)', color: '#0f172a', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', padding: '6px 10px', fontWeight: 700 }} />
      </label>
      <button onClick={handleSave} style={{ marginTop: '6px', padding: '12px', background: saved ? '#10b981' : 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Targets</>}
      </button>
    </div>
  );
};
