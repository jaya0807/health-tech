export type SupportedLanguage = 'en' | 'hi' | 'or' | 'ta' | 'te' | 'es';

export type VoiceCueCategory =
  | 'START_SESSION'
  | 'BEND_MORE'
  | 'OVER_FLEXION'
  | 'SLOW_DOWN'
  | 'STRAIGHTEN_BACK'
  | 'EXCELLENT_REP'
  | 'REPS_REMAINING'
  | 'FATIGUE_REST'
  | 'SESSION_COMPLETE';

export const LOCALIZED_VOICE_PROMPTS: Record<SupportedLanguage, Record<VoiceCueCategory, string>> = {
  en: {
    START_SESSION: "Let's begin your therapy session. Stand in full view.",
    BEND_MORE: 'Bend slightly more to reach full range.',
    OVER_FLEXION: 'Ease back slightly, do not overextend.',
    SLOW_DOWN: 'Slow down your movement for better muscle control.',
    STRAIGHTEN_BACK: 'Keep your chest open and back straight.',
    EXCELLENT_REP: 'Great repetition! Perfect form.',
    REPS_REMAINING: 'Only {count} more repetitions to go.',
    FATIGUE_REST: "You look tired. Let's take a short 2-minute rest.",
    SESSION_COMPLETE: 'Outstanding work today! Session completed.',
  },
  hi: {
    START_SESSION: 'आइए आपका थेरेपी सत्र शुरू करें। कैमरे के सामने खड़े हों।',
    BEND_MORE: 'लक्ष्य तक पहुंचने के लिए थोड़ा और मोड़ें।',
    OVER_FLEXION: 'थोड़ा पीछे हटें, अधिक न खींचें।',
    SLOW_DOWN: 'मांसपेशियों के बेहतर नियंत्रण के लिए गति धीमी करें।',
    STRAIGHTEN_BACK: 'अपनी पीठ सीधी रखें।',
    EXCELLENT_REP: 'बहुत बढ़िया! बिल्कुल सही तरीका।',
    REPS_REMAINING: 'बस {count} और रेप्स बाकी हैं।',
    FATIGUE_REST: 'आप थके हुए लग रहे हैं। 2 मिनट का आराम लें।',
    SESSION_COMPLETE: 'शानदार काम! आज का सत्र पूरा हुआ।',
  },
  or: {
    START_SESSION: 'ଆସନ୍ତୁ ଆପଣଙ୍କର ଥେରାପି ଅଧିବେଶନ ଆରମ୍ଭ କରିବା।',
    BEND_MORE: 'ପୂର୍ଣ୍ଣ ଲକ୍ଷ୍ୟ ପାଇଁ ଆଉ ଟିକେ ମୋଡ଼ନ୍ତୁ।',
    OVER_FLEXION: 'ଅଧିକ ଟାଣନ୍ତୁ ନାହିଁ, ଟିକେ ଶାନ୍ତ ହୁଅନ୍ତୁ।',
    SLOW_DOWN: 'ଧୀରେ ଧୀରେ ଗତି କରନ୍ତୁ।',
    STRAIGHTEN_BACK: 'ଆପଣଙ୍କ ପିଠି ସିଧା ରଖନ୍ତୁ।',
    EXCELLENT_REP: 'ଉତ୍କୃଷ୍ଟ! ଠିକ୍ ଏହିପରି କରନ୍ତୁ।',
    REPS_REMAINING: 'ଆଉ କେବଳ {count} ଥର ବାକି ଅଛି।',
    FATIGUE_REST: 'ଆପଣ କ୍ଳାନ୍ତ ଲାଗୁଛନ୍ତି। ୨ ମିନିଟ୍ ବିଶ୍ରାମ ନିଅନ୍ତୁ।',
    SESSION_COMPLETE: 'ବହୁତ ବଢ଼ିଆ! ଆଜିର ଅଧିବେଶନ ସମାପ୍ତ ହେଲା।',
  },
  ta: {
    START_SESSION: 'உங்கள் உடற்பயிற்சியைத் தொடங்குவோம்.',
    BEND_MORE: 'இன்னும் கொஞ்சம் வளைக்கவும்.',
    OVER_FLEXION: 'அதிகமாக வளைக்க வேண்டாம், சற்று தளர்த்தவும்.',
    SLOW_DOWN: 'மெதுவாகச் செய்யுங்கள்.',
    STRAIGHTEN_BACK: 'முதுகை நேராக வைக்கவும்.',
    EXCELLENT_REP: 'அருமை! சரியான முறை.',
    REPS_REMAINING: 'இன்னும் {count} முறை மட்டுமே.',
    FATIGUE_REST: 'நீங்கள் சோர்வாக இருக்கிறீர்கள். 2 நிமிடம் ஓய்வெடுங்கள்.',
    SESSION_COMPLETE: 'சிறப்பான வேலை! இன்றைய பயிற்சி முடிந்தது.',
  },
  te: {
    START_SESSION: 'మీ థెరపీ సెషన్ ప్రారంభిద్దాం.',
    BEND_MORE: 'లక్ష్యాన్ని చేరుకోవడానికి కాస్త వంచండి.',
    OVER_FLEXION: 'ఎక్కువగా లాగవద్దు.',
    SLOW_DOWN: 'కదలికను నెమ్మదిగా చేయండి.',
    STRAIGHTEN_BACK: 'వీపును నిటారుగా ఉంచండి.',
    EXCELLENT_REP: 'చాలా బాగుంది! సరైన విధానం.',
    REPS_REMAINING: 'ఇంకా {count} సార్లు మాత్రమే మిగిలి ఉన్నాయి.',
    FATIGUE_REST: 'మీరు అలసిపోయినట్లున్నారు. 2 నిమిషాలు విశ్రాంతి తీసుకోండి.',
    SESSION_COMPLETE: 'అద్భుతం! నేటి సెషన్ పూర్తయింది.',
  },
  es: {
    START_SESSION: 'Comencemos su sesión de terapia.',
    BEND_MORE: 'Flexione un poco más para alcanzar el rango completo.',
    OVER_FLEXION: 'Retroceda suavemente, no hiperextienda.',
    SLOW_DOWN: 'Reduzca la velocidad para un mejor control muscular.',
    STRAIGHTEN_BACK: 'Mantenga la espalda recta.',
    EXCELLENT_REP: '¡Excelente repetición! Forma perfecta.',
    REPS_REMAINING: 'Solo quedan {count} repeticiones.',
    FATIGUE_REST: 'Parece fatigado. Tomemos un descanso de 2 minutos.',
    SESSION_COMPLETE: '¡Gran trabajo hoy! Sesión completada.',
  },
};

export function getVoiceCue(category: VoiceCueCategory, lang: SupportedLanguage = 'en', count?: number): string {
  const table = LOCALIZED_VOICE_PROMPTS[lang] ?? LOCALIZED_VOICE_PROMPTS.en;
  let text = table[category] ?? LOCALIZED_VOICE_PROMPTS.en[category];
  if (count !== undefined) {
    text = text.replace('{count}', count.toString());
  }
  return text;
}
