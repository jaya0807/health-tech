export const exercisesByCondition: Record<string, string[]> = {
  'ACL Reconstruction': ['Mini Squats', 'Step Ups', 'Single Leg Balance'],
  'Knee Replacement': ['Seated Knee Extensions', 'Mini Squats', 'Standing Knee Flexion'],
  'Ankle Injury': ['Calf Raise', 'Single Leg Balance', 'Weight Shift'],
  'Lower Back Pain': ['Standing Trunk Rotation', 'Standing Side Bend', 'Hip Hinge'],
  'Shoulder Rehabilitation': ['Shoulder Flexion', 'Shoulder Abduction', 'Wall Slide'],
};

export const getAreaLabels = (area: string) => {
  switch (area) {
    case 'Shoulder': return { pressure: 'Shoulder', tension: 'Rotator Cuff', alignment: 'Shoulder', action: 'Reach' };
    case 'Back': return { pressure: 'Spinal', tension: 'Lumbar', alignment: 'Spine', action: 'Bend' };
    case 'Ankle': return { pressure: 'Ankle', tension: 'Achilles', alignment: 'Ankle', action: 'Flexion' };
    case 'Hip': return { pressure: 'Hip', tension: 'Pelvic', alignment: 'Hip', action: 'Flexion' };
    default: return { pressure: 'Knee', tension: 'Kneecap', alignment: 'Knee', action: 'Bend' };
  }
};

export const getExerciseGifUrl = (exerciseName: string): string | null => {
  const name = exerciseName.toLowerCase();
  
  if (name === 'squats' || name === 'mini squats') return '/exercises/squat.gif';
  if (name === 'seated knee extensions') return '/exercises/knee.gif';
  if (name === 'wall crawl (flexion)') return '/exercises/shoulder.gif';
  
  return null;
};
