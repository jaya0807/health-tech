import React, { useState } from 'react';
import { Plus, Check, Trash2, BrainCircuit, Sparkles, Loader2 } from 'lucide-react';
import { exercisesByCondition } from '../../../shared/utils/exerciseConfigs.js';

interface LogEntry {
  id: string;
  exercise: string;
  reps: number;
  sets: number;
  posture: string;
  timestamp: Date;
}

const allExercises = Array.from(new Set(Object.values(exercisesByCondition).flat())).sort();

export const ManualWorkoutLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [exercise, setExercise] = useState(allExercises[0]);
  const [reps, setReps] = useState<number | ''>('');
  const [sets, setSets] = useState<number | ''>('');
  const [posture, setPosture] = useState('Good');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const handleAddLog = () => {
    if (!exercise || !reps || !sets) return;
    
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      exercise,
      reps: Number(reps),
      sets: Number(sets),
      posture,
      timestamp: new Date()
    };
    
    setLogs([newLog, ...logs]);
    // Don't reset the exercise name so they can log multiple sets easily
    setReps('');
    setSets('');
    setPosture('Good');
  };

  const deleteLog = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  const generateAiReport = () => {
    if (logs.length === 0) return;
    setIsAnalyzing(true);
    setAiReport(null);

    // Simulate AI model latency (1.5s)
    setTimeout(() => {
      const totalReps = logs.reduce((sum, log) => sum + (log.reps * log.sets), 0);
      const uniqueExercises = [...new Set(logs.map(l => l.exercise))];
      
      const excellentCount = logs.filter(l => l.posture === 'Excellent').length;
      const poorCount = logs.filter(l => l.posture === 'Needs Adjustment').length;
      
      let insights = `You completed a total of ${totalReps} repetitions across ${uniqueExercises.length} unique exercises today. `;
      
      if (excellentCount > poorCount && poorCount === 0) {
        insights += "Your posture control was outstanding throughout the session. Maintaining this level of strict form will significantly accelerate your tissue healing.";
      } else if (poorCount > 0) {
        insights += `I noticed some form breakdown in ${poorCount} of your logged sets. It's perfectly normal as muscles fatigue, but prioritize form over volume in your next session to protect the joint.`;
      } else {
        insights += "Your form was generally good and stable. Consistent execution like this is exactly what builds long-term joint resilience.";
      }

      insights += `\n\nRecommendation: Focus on ${uniqueExercises.length > 0 ? uniqueExercises[0] : 'your primary movements'} next time, and consider adding a 5-minute ice therapy session to reduce localized inflammation post-workout.`;

      setAiReport(insights);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)' }} />
          Manual Workout Log
        </h3>
        <span style={{ color: '#475569', fontSize: '13px' }}>{logs.length} entries recorded today</span>
      </div>

      {/* Input Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr auto', gap: '12px', alignItems: 'end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>Exercise Name</label>
          <select 
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px', color: '#0f172a', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
          >
            {allExercises.map(ex => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>Reps</label>
          <input 
            type="number" 
            placeholder="0"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value) || '')}
            style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px', color: '#0f172a', fontSize: '14px', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>Sets</label>
          <input 
            type="number" 
            placeholder="0"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value) || '')}
            style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px', color: '#0f172a', fontSize: '14px', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>Posture Quality</label>
          <select 
            value={posture}
            onChange={(e) => setPosture(e.target.value)}
            style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px', color: '#0f172a', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Needs Adjustment">Needs Adjustment</option>
          </select>
        </div>
        <button 
          onClick={handleAddLog}
          disabled={!exercise || !reps || !sets}
          style={{ 
            background: exercise && reps && sets ? '#10b981' : '#e2e8f0', 
            color: exercise && reps && sets ? '#000' : '#94a3b8', 
            border: 'none', borderRadius: '8px', padding: '10px 16px', 
            height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: exercise && reps && sets ? 'pointer' : 'not-allowed',
            fontWeight: 700, transition: 'all 0.2s'
          }}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Log Table */}
      {logs.length > 0 && (
        <div style={{ overflowX: 'auto', marginTop: '8px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', background: 'rgba(255,255,255,0.5)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '12px 16px', color: '#475569', fontSize: '12px', fontWeight: 600 }}>Time</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontSize: '12px', fontWeight: 600 }}>Exercise</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontSize: '12px', fontWeight: 600 }}>Sets x Reps</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontSize: '12px', fontWeight: 600 }}>Posture</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontSize: '12px', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: '13px' }}>
                    {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>
                    {log.exercise}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#0f172a', fontSize: '14px' }}>
                    {log.sets} <span style={{ color: '#94a3b8', fontSize: '12px', margin: '0 4px' }}>×</span> {log.reps}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                      background: log.posture === 'Excellent' ? 'rgba(16, 185, 129, 0.1)' : log.posture === 'Good' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: log.posture === 'Excellent' ? '#10b981' : log.posture === 'Good' ? '#eab308' : '#ef4444'
                    }}>
                      {log.posture}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => deleteLog(log.id)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                      onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* AI Generation Footer */}
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={generateAiReport}
              disabled={isAnalyzing}
              style={{ 
                background: '#10b981',
                border: 'none', borderRadius: '8px', padding: '12px 24px', color: '#fff', fontSize: '14px', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '8px', cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                opacity: isAnalyzing ? 0.7 : 1, transition: 'all 0.2s'
              }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Analyzing Logs...
                </>
              ) : (
                <>
                  <BrainCircuit size={18} /> Generate AI Recovery Report
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* AI Report Result Box */}
      {aiReport && (
        <div style={{ 
          marginTop: '8px', padding: '20px', borderRadius: '12px', 
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)', position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#fff', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '2px 8px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={14} /> AI Insight
          </div>
          <p style={{ color: '#0f172a', fontSize: '15px', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
            {aiReport}
          </p>
        </div>
      )}
    </div>
  );
};
