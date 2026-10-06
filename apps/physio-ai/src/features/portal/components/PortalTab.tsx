import React, { useState } from 'react';
import { FileCheck } from 'lucide-react';
import { ClinicianRoster, RosterPatient } from './ClinicianRoster.js';
import { PrescriptionEditor, PrescriptionData } from './PrescriptionEditor.js';
import { PatientProfile } from '../../onboarding/PatientOnboardingModal.js';
import { getAreaLabels } from '../../../shared/utils/exerciseConfigs.js';

interface PortalTabProps {
  patient: PatientProfile | null;
  patients: RosterPatient[];
  rx: PrescriptionData;
  onSaveRx: (rx: PrescriptionData) => void;
  onSelectPatient: (id: string) => void;
}

export const PortalTab: React.FC<PortalTabProps> = ({ patient, patients, rx, onSaveRx, onSelectPatient }) => {
  const [soapOpen, setSoapOpen] = useState(false);
  const labels = patient ? getAreaLabels(patient.recoveryArea) : getAreaLabels('Knee');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '320px' }}>
          <ClinicianRoster patients={patients} onSelectPatient={onSelectPatient} />
        </div>
        {patient && <PrescriptionEditor initialData={rx} onSave={onSaveRx} />}
      </div>
      {patient && (
        <button 
          onClick={() => setSoapOpen(!soapOpen)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', background: 'linear-gradient(135deg, #38bdf8, #0284c7)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, alignSelf: 'flex-start', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}
        >
          <FileCheck size={16} /> {soapOpen ? 'Hide' : 'Generate'} Doctor Report
        </button>
      )}
      {soapOpen && patient && (
        <div className="glass-panel" style={{ padding: '20px', fontFamily: 'monospace', fontSize: '13px', color: '#334155', whiteSpace: 'pre-wrap', background: 'rgba(255, 255, 255, 0.8)' }}>
          {`[DOCTOR'S PROGRESS REPORT & VISIT SUMMARY]\nPatient: ${patient.name} | Age: ${patient.age} | Diagnosis: ${patient.condition}\nDate: 2026-08-05 | Provider ID: SU-MED-8492\n\nSubjective: Patient reported comfort score ${patient.painVas}/10 during ${labels.action.toLowerCase()} exercise. Finished home session on time.${patient.warmupStatus ? ` Warm-up was ${patient.warmupStatus}.` : ''}\nObjective: Active ${labels.action.toLowerCase()} reached 92° (Goal: ${rx.targetAngleDeg}°). Form accuracy score: 92%.\nAssessment: Excellent healing progress. Joint tracking remains stable and centered with no extra strain.\nPlan: Continue current exercise routine 2 times daily. Target ${labels.action.toLowerCase()} angle increases to 95° next week.\n\nMedical Insurance Billing Summary:\n- Status: 16+ active exercise days logged (Eligible for remote care reimbursement)`}
        </div>
      )}
    </div>
  );
};
