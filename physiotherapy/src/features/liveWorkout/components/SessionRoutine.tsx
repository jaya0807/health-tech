import React from 'react';
import { ListTodo, CheckCircle2, Circle } from 'lucide-react';
import { Exercise } from '../../portal/components/PrescriptionEditor.js';

interface SessionRoutineProps {
  routine: Exercise[];
  currentExerciseIndex: number;
}

export const SessionRoutine: React.FC<SessionRoutineProps> = ({ routine, currentExerciseIndex }) => {
  return (
    <div className="glass-panel" style={{ padding: '24px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <ListTodo size={20} color="#10b981" />
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Session Routine</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
        {/* Timeline Line */}
        <div style={{ position: 'absolute', left: '9px', top: '20px', bottom: '20px', width: '2px', backgroundColor: '#e2e8f0', zIndex: 0 }} />
        
        {routine.map((ex, idx) => {
          const isCompleted = idx < currentExerciseIndex;
          const isCurrent = idx === currentExerciseIndex;
          
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1, opacity: isCompleted ? 0.6 : 1 }}>
              <div style={{ 
                marginTop: '2px', 
                backgroundColor: '#ffffff', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isCompleted ? (
                  <CheckCircle2 size={20} color="#10b981" />
                ) : isCurrent ? (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                  </div>
                ) : (
                  <Circle size={20} color="#cbd5e1" />
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#0f172a' : '#64748b' }}>
                  {ex.name}
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
                  {ex.sets} sets × {ex.reps} reps
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
