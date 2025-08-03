export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  {
    id: "basic-music-theory",
    title: "Basic Music Theory",
    description: "Test your knowledge of fundamental music theory concepts",
    questions: [
      {
        id: "1",
        question: "How many semitones are in an octave?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2,
        explanation: "An octave contains 12 semitones (half steps)."
      },
      {
        id: "2", 
        question: "What is the dominant chord in the key of C major?",
        options: ["F major", "G major", "A minor", "D minor"],
        correctAnswer: 1,
        explanation: "The dominant chord is built on the 5th degree of the scale. In C major, that's G."
      },
      {
        id: "3",
        question: "Which time signature has four quarter note beats per measure?",
        options: ["2/4", "3/4", "4/4", "6/8"],
        correctAnswer: 2,
        explanation: "4/4 time signature means four quarter note beats per measure."
      },
      {
        id: "4",
        question: "What does the term 'forte' mean in music?",
        options: ["Soft", "Loud", "Fast", "Slow"],
        correctAnswer: 1,
        explanation: "Forte (f) is a dynamic marking that means loud."
      },
      {
        id: "5",
        question: "In Kenyan traditional music, what is a 'nyatiti'?",
        options: ["A drum", "A stringed instrument", "A wind instrument", "A dance"],
        correctAnswer: 1,
        explanation: "The nyatiti is a traditional Luo stringed instrument from Kenya."
      },
      {
        id: "6",
        question: "What is the relative minor of C major?",
        options: ["A minor", "E minor", "F major", "G major"],
        correctAnswer: 0,
        explanation: "The relative minor is found a minor third below the major key. C major's relative minor is A minor."
      },
      {
        id: "7",
        question: "How many lines are in a musical staff?",
        options: ["4", "5", "6", "7"],
        correctAnswer: 1,
        explanation: "A standard musical staff has 5 lines and 4 spaces."
      },
      {
        id: "8",
        question: "What is a 'chord progression'?",
        options: ["A single note", "A sequence of chords", "A type of scale", "A rhythm pattern"],
        correctAnswer: 1,
        explanation: "A chord progression is a sequence of chords played in succession."
      },
      {
        id: "9",
        question: "In traditional Kikuyu music, what is a 'mukanda'?",
        options: ["A ceremonial song", "A musical instrument", "A dance style", "A singing technique"],
        correctAnswer: 0,
        explanation: "Mukanda refers to traditional ceremonial songs in Kikuyu culture."
      },
      {
        id: "10",
        question: "What interval is between C and G?",
        options: ["Perfect 4th", "Perfect 5th", "Major 6th", "Perfect octave"],
        correctAnswer: 1,
        explanation: "The interval from C to G is a perfect fifth (7 semitones)."
      },
      {
        id: "11",
        question: "What does 'pianissimo' (pp) indicate?",
        options: ["Very loud", "Very soft", "Very fast", "Very slow"],
        correctAnswer: 1,
        explanation: "Pianissimo (pp) means very soft or very quiet."
      },
      {
        id: "12",
        question: "Which scale has no sharps or flats?",
        options: ["G major", "F major", "C major", "D major"],
        correctAnswer: 2,
        explanation: "C major scale contains only natural notes with no sharps or flats."
      },
      {
        id: "13",
        question: "What is the tonic note in the key of F major?",
        options: ["F", "G", "C", "A"],
        correctAnswer: 0,
        explanation: "The tonic is the first degree of any scale, so in F major, F is the tonic."
      },
      {
        id: "14",
        question: "How many beats does a half note receive in 4/4 time?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "A half note receives 2 beats in 4/4 time signature."
      },
      {
        id: "15",
        question: "What is the subdominant chord in any major key?",
        options: ["I chord", "IV chord", "V chord", "vi chord"],
        correctAnswer: 1,
        explanation: "The subdominant is the IV chord, built on the 4th degree of the scale."
      },
      {
        id: "16",
        question: "Which clef is typically used for higher-pitched instruments?",
        options: ["Bass clef", "Treble clef", "Alto clef", "Tenor clef"],
        correctAnswer: 1,
        explanation: "Treble clef is used for higher-pitched instruments and voices."
      },
      {
        id: "17",
        question: "What does 'allegro' mean in music terminology?",
        options: ["Slow", "Fast", "Moderate", "Very slow"],
        correctAnswer: 1,
        explanation: "Allegro indicates a fast, lively tempo."
      },
      {
        id: "18",
        question: "In traditional African music, what does 'polyrhythm' refer to?",
        options: ["One rhythm only", "Multiple rhythms played simultaneously", "No rhythm", "Silent rhythm"],
        correctAnswer: 1,
        explanation: "Polyrhythm is the simultaneous use of two or more conflicting rhythms."
      },
      {
        id: "19",
        question: "What is the leading tone in C major?",
        options: ["B", "C", "D", "F"],
        correctAnswer: 0,
        explanation: "The leading tone is the 7th degree of the scale. In C major, that's B."
      },
      {
        id: "20",
        question: "Which interval has the ratio 2:1?",
        options: ["Perfect 5th", "Perfect 4th", "Octave", "Major 3rd"],
        correctAnswer: 2,
        explanation: "An octave has a frequency ratio of 2:1, meaning the higher note vibrates twice as fast."
      }
    ]
  },
  {
    id: "rhythm-timing",
    title: "Rhythm & Timing",
    description: "Master the fundamentals of musical rhythm and timing",
    questions: [
      {
        id: "1",
        question: "What is the duration of a whole note in 4/4 time?",
        options: ["1 beat", "2 beats", "3 beats", "4 beats"],
        correctAnswer: 3,
        explanation: "A whole note lasts for 4 beats in 4/4 time signature."
      },
      {
        id: "2",
        question: "How many eighth notes equal one quarter note?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "Two eighth notes equal one quarter note in duration."
      },
      {
        id: "3",
        question: "What is syncopation?",
        options: ["Playing loudly", "Playing off the beat", "Playing in tune", "Playing fast"],
        correctAnswer: 1,
        explanation: "Syncopation is emphasizing beats or parts of beats that are normally unstressed."
      },
      {
        id: "4",
        question: "In 6/8 time, how many eighth note beats are in each measure?",
        options: ["6", "8", "3", "2"],
        correctAnswer: 0,
        explanation: "6/8 time has 6 eighth note beats per measure, usually felt as two groups of three."
      },
      {
        id: "5",
        question: "What is a polyrhythm?",
        options: ["One rhythm", "Two or more rhythms played simultaneously", "A fast rhythm", "A slow rhythm"],
        correctAnswer: 1,
        explanation: "Polyrhythm is the use of two or more conflicting rhythms simultaneously."
      },
      {
        id: "6",
        question: "In traditional African music, what is 'call and response'?",
        options: ["A solo performance", "A musical dialogue pattern", "A type of instrument", "A dance move"],
        correctAnswer: 1,
        explanation: "Call and response is a musical dialogue where one musician or group calls and another responds."
      },
      {
        id: "7",
        question: "What does a dot after a note do to its duration?",
        options: ["Doubles it", "Halves it", "Adds half its value", "Subtracts half its value"],
        correctAnswer: 2,
        explanation: "A dot after a note increases its duration by half of its original value."
      },
      {
        id: "8",
        question: "What is the basic beat division in compound time?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 1,
        explanation: "In compound time signatures, the basic beat is divided into three equal parts."
      },
      {
        id: "9",
        question: "What is a hemiola?",
        options: ["A type of scale", "A rhythmic device", "A chord", "An instrument"],
        correctAnswer: 1,
        explanation: "Hemiola is a rhythmic device where three beats are played in the time normally occupied by two."
      },
      {
        id: "10",
        question: "In Kenyan benga music, what characterizes the typical rhythm?",
        options: ["Slow and steady", "Fast with syncopated guitar", "No percussion", "Classical waltz"],
        correctAnswer: 1,
        explanation: "Benga music is characterized by fast tempo and syncopated guitar rhythms."
      }
    ]
  },
  {
    id: "scales-modes",
    title: "Scales & Modes",
    description: "Explore different scales and modes from around the world",
    questions: [
      {
        id: "1",
        question: "How many notes are in a major scale?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 1,
        explanation: "A major scale contains 7 different pitches (8 if you count the octave)."
      },
      {
        id: "2",
        question: "What is the pattern of whole and half steps in a major scale?",
        options: ["W-W-H-W-W-W-H", "W-H-W-W-H-W-W", "H-W-W-H-W-W-W", "W-W-W-H-W-W-H"],
        correctAnswer: 0,
        explanation: "The major scale pattern is: Whole-Whole-Half-Whole-Whole-Whole-Half."
      },
      {
        id: "3",
        question: "Which mode starts on the second degree of a major scale?",
        options: ["Ionian", "Dorian", "Phrygian", "Lydian"],
        correctAnswer: 1,
        explanation: "Dorian mode starts on the second degree of the major scale."
      },
      {
        id: "4",
        question: "What scale is commonly used in blues music?",
        options: ["Major scale", "Minor scale", "Pentatonic scale", "Chromatic scale"],
        correctAnswer: 2,
        explanation: "The pentatonic scale, particularly the minor pentatonic, is fundamental to blues music."
      },
      {
        id: "5",
        question: "In traditional Japanese music, what is the 'hirajoshi' scale?",
        options: ["A 7-note scale", "A 5-note pentatonic scale", "A 12-note scale", "A 3-note scale"],
        correctAnswer: 1,
        explanation: "Hirajoshi is a traditional Japanese pentatonic scale with 5 notes."
      },
      {
        id: "6",
        question: "What is the natural minor scale also known as?",
        options: ["Ionian mode", "Dorian mode", "Aeolian mode", "Mixolydian mode"],
        correctAnswer: 2,
        explanation: "The natural minor scale is the same as the Aeolian mode."
      },
      {
        id: "7",
        question: "How many sharps are in the key of A major?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 2,
        explanation: "A major has 3 sharps: F#, C#, and G#."
      },
      {
        id: "8",
        question: "What makes a scale 'chromatic'?",
        options: ["It has 7 notes", "It uses all 12 semitones", "It's only major", "It's only minor"],
        correctAnswer: 1,
        explanation: "A chromatic scale uses all 12 semitones within an octave."
      },
      {
        id: "9",
        question: "In Indian classical music, what is a 'raga'?",
        options: ["A rhythmic pattern", "A melodic framework", "An instrument", "A dance"],
        correctAnswer: 1,
        explanation: "A raga is a melodic framework for improvisation and composition in Indian classical music."
      },
      {
        id: "10",
        question: "What is the dominant note in any major scale?",
        options: ["1st degree", "3rd degree", "5th degree", "7th degree"],
        correctAnswer: 2,
        explanation: "The dominant is the 5th degree of any major scale."
      }
    ]
  },
  {
    id: "ear-training",
    title: "Ear Training",
    description: "Develop your musical ear and listening skills",
    questions: [
      {
        id: "1",
        question: "What is 'perfect pitch'?",
        options: ["Playing in tune", "Identifying notes without reference", "Singing loudly", "Playing fast"],
        correctAnswer: 1,
        explanation: "Perfect pitch is the ability to identify or recreate musical notes without a reference tone."
      },
      {
        id: "2",
        question: "What interval sounds the most consonant?",
        options: ["Minor 2nd", "Major 7th", "Perfect 5th", "Tritone"],
        correctAnswer: 2,
        explanation: "The perfect 5th is considered one of the most consonant intervals."
      },
      {
        id: "3",
        question: "What is relative pitch?",
        options: ["Absolute pitch identification", "Pitch relationships between notes", "Volume levels", "Tempo recognition"],
        correctAnswer: 1,
        explanation: "Relative pitch is the ability to identify relationships between musical notes."
      },
      {
        id: "4",
        question: "Which interval is known as the 'devil's interval'?",
        options: ["Perfect 4th", "Tritone", "Minor 7th", "Major 2nd"],
        correctAnswer: 1,
        explanation: "The tritone (augmented 4th/diminished 5th) was historically called the 'devil's interval'."
      },
      {
        id: "5",
        question: "What is the difference between a major and minor third?",
        options: ["1 semitone", "2 semitones", "3 semitones", "4 semitones"],
        correctAnswer: 0,
        explanation: "A major third has 4 semitones, a minor third has 3 semitones - difference of 1 semitone."
      },
      {
        id: "6",
        question: "In solfege, what syllable represents the 4th degree of the scale?",
        options: ["Fa", "Sol", "La", "Ti"],
        correctAnswer: 0,
        explanation: "In solfege, 'Fa' represents the 4th degree of the major scale."
      },
      {
        id: "7",
        question: "What creates the feeling of 'tension' in harmony?",
        options: ["Consonant intervals", "Dissonant intervals", "Perfect intervals", "Unison"],
        correctAnswer: 1,
        explanation: "Dissonant intervals create harmonic tension that seeks resolution."
      },
      {
        id: "8",
        question: "What is the inversion of a major third?",
        options: ["Minor third", "Minor sixth", "Major sixth", "Perfect fourth"],
        correctAnswer: 1,
        explanation: "The inversion of a major third (4 semitones) is a minor sixth (8 semitones)."
      },
      {
        id: "9",
        question: "What characterizes the sound of a diminished chord?",
        options: ["Bright and happy", "Dark and tense", "Neutral", "Suspended"],
        correctAnswer: 1,
        explanation: "Diminished chords have a dark, tense, unstable sound quality."
      },
      {
        id: "10",
        question: "What is the enharmonic equivalent of F#?",
        options: ["E#", "Gb", "G", "F"],
        correctAnswer: 1,
        explanation: "F# and Gb are enharmonic equivalents - same pitch, different names."
      }
    ]
  }
];

export const getRandomQuestions = (quizId: string, count: number = 10): QuizQuestion[] => {
  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz) return [];
  
  const shuffled = [...quiz.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
