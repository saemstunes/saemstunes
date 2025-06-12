
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  timeLimit?: number;
  requiredScore?: number;
}

export const musicQuizzes: Quiz[] = [
  {
    id: 'music-theory-basics',
    title: 'Music Theory Basics',
    description: 'Test your knowledge of fundamental music theory concepts',
    category: 'Theory',
    difficulty: 'easy',
    questions: [
      {
        id: '1',
        question: 'How many notes are in a major scale?',
        options: ['5', '6', '7', '8'],
        correctAnswer: 2,
        explanation: 'A major scale contains 7 different notes (8 if you count the octave).',
        difficulty: 'easy',
        category: 'Theory'
      },
      {
        id: '2',
        question: 'What is the dominant chord in the key of C major?',
        options: ['C major', 'F major', 'G major', 'A minor'],
        correctAnswer: 2,
        explanation: 'The dominant chord (V) in C major is G major.',
        difficulty: 'easy',
        category: 'Theory'
      },
      {
        id: '3',
        question: 'Which interval is known as a perfect fifth?',
        options: ['C to E', 'C to F', 'C to G', 'C to A'],
        correctAnswer: 2,
        explanation: 'C to G is a perfect fifth interval.',
        difficulty: 'easy',
        category: 'Theory'
      },
      {
        id: '4',
        question: 'What does the term "forte" mean in music?',
        options: ['Soft', 'Loud', 'Fast', 'Slow'],
        correctAnswer: 1,
        explanation: 'Forte (f) means loud in musical dynamics.',
        difficulty: 'easy',
        category: 'Theory'
      },
      {
        id: '5',
        question: 'How many beats are in a 4/4 time signature per measure?',
        options: ['2', '3', '4', '6'],
        correctAnswer: 2,
        explanation: '4/4 time signature has 4 quarter note beats per measure.',
        difficulty: 'easy',
        category: 'Theory'
      },
      {
        id: '6',
        question: 'What is the relative minor of C major?',
        options: ['A minor', 'E minor', 'D minor', 'B minor'],
        correctAnswer: 0,
        explanation: 'A minor is the relative minor of C major.',
        difficulty: 'easy',
        category: 'Theory'
      },
      {
        id: '7',
        question: 'Which note is the leading tone in C major?',
        options: ['A', 'B', 'D', 'F'],
        correctAnswer: 1,
        explanation: 'B is the leading tone (7th degree) in C major.',
        difficulty: 'easy',
        category: 'Theory'
      },
      {
        id: '8',
        question: 'What type of chord is built on the first degree of a major scale?',
        options: ['Minor', 'Major', 'Diminished', 'Augmented'],
        correctAnswer: 1,
        explanation: 'The I chord in a major scale is a major chord.',
        difficulty: 'easy',
        category: 'Theory'
      },
      {
        id: '9',
        question: 'What is the interval from C to E?',
        options: ['Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th'],
        correctAnswer: 2,
        explanation: 'C to E is a major third interval.',
        difficulty: 'easy',
        category: 'Theory'
      },
      {
        id: '10',
        question: 'Which clef is commonly used for higher-pitched instruments?',
        options: ['Bass clef', 'Treble clef', 'Alto clef', 'Tenor clef'],
        correctAnswer: 1,
        explanation: 'Treble clef is used for higher-pitched instruments and voices.',
        difficulty: 'easy',
        category: 'Theory'
      }
    ]
  },
  {
    id: 'jazz-fundamentals',
    title: 'Jazz Fundamentals',
    description: 'Explore the basics of jazz theory and harmony',
    category: 'Jazz',
    difficulty: 'medium',
    questions: [
      {
        id: '1',
        question: 'What is a ii-V-I progression in the key of C major?',
        options: ['Dm7-G7-Cmaj7', 'Em7-A7-Dmaj7', 'Am7-D7-Gmaj7', 'Fm7-Bb7-Ebmaj7'],
        correctAnswer: 0,
        explanation: 'In C major, the ii-V-I progression is Dm7-G7-Cmaj7.',
        difficulty: 'medium',
        category: 'Jazz'
      },
      {
        id: '2',
        question: 'What scale is commonly played over a dominant 7th chord?',
        options: ['Major scale', 'Natural minor', 'Mixolydian mode', 'Dorian mode'],
        correctAnswer: 2,
        explanation: 'Mixolydian mode is the most common scale for dominant 7th chords.',
        difficulty: 'medium',
        category: 'Jazz'
      },
      {
        id: '3',
        question: 'What is the 7th note in a C major 7th chord?',
        options: ['A', 'B', 'D', 'F'],
        correctAnswer: 1,
        explanation: 'The 7th in Cmaj7 is B (major 7th).',
        difficulty: 'medium',
        category: 'Jazz'
      },
      {
        id: '4',
        question: 'Which chord tone is typically omitted in jazz guitar comping?',
        options: ['Root', '3rd', '5th', '7th'],
        correctAnswer: 2,
        explanation: 'The 5th is commonly omitted in jazz guitar voicings.',
        difficulty: 'medium',
        category: 'Jazz'
      },
      {
        id: '5',
        question: 'What is a tritone substitution?',
        options: ['Replacing V7 with bII7', 'Replacing I with vi', 'Replacing IV with ii', 'Replacing iii with V'],
        correctAnswer: 0,
        explanation: 'Tritone substitution replaces V7 with bII7.',
        difficulty: 'medium',
        category: 'Jazz'
      },
      {
        id: '6',
        question: 'What tempo marking is "ballad" typically associated with?',
        options: ['60-80 BPM', '120-140 BPM', '160-180 BPM', '200+ BPM'],
        correctAnswer: 0,
        explanation: 'Jazz ballads are typically played at 60-80 BPM.',
        difficulty: 'medium',
        category: 'Jazz'
      },
      {
        id: '7',
        question: 'What is the characteristic rhythm of swing?',
        options: ['Straight eighths', 'Triplet feel', 'Dotted rhythms', 'Syncopation'],
        correctAnswer: 1,
        explanation: 'Swing uses a triplet feel for eighth notes.',
        difficulty: 'medium',
        category: 'Jazz'
      },
      {
        id: '8',
        question: 'Which scale degree is flatted in a blues scale?',
        options: ['2nd and 6th', '3rd and 7th', '4th and 5th', '1st and 5th'],
        correctAnswer: 1,
        explanation: 'Blues scales typically flat the 3rd and 7th degrees.',
        difficulty: 'medium',
        category: 'Jazz'
      },
      {
        id: '9',
        question: 'What is comping in jazz?',
        options: ['Composing', 'Chord accompaniment', 'Competing', 'Comparing'],
        correctAnswer: 1,
        explanation: 'Comping refers to chord accompaniment in jazz.',
        difficulty: 'medium',
        category: 'Jazz'
      },
      {
        id: '10',
        question: 'What does "Giant Steps" refer to in jazz?',
        options: ['A dance move', 'Large interval jumps', 'A famous composition', 'A type of scale'],
        correctAnswer: 2,
        explanation: 'Giant Steps is a famous John Coltrane composition known for its chord changes.',
        difficulty: 'medium',
        category: 'Jazz'
      }
    ]
  },
  {
    id: 'classical-composers',
    title: 'Classical Composers',
    description: 'Test your knowledge of famous classical composers and their works',
    category: 'Classical',
    difficulty: 'medium',
    questions: [
      {
        id: '1',
        question: 'Who composed "The Four Seasons"?',
        options: ['Bach', 'Vivaldi', 'Mozart', 'Beethoven'],
        correctAnswer: 1,
        explanation: 'Antonio Vivaldi composed "The Four Seasons".',
        difficulty: 'medium',
        category: 'Classical'
      },
      {
        id: '2',
        question: 'Which composer wrote "Symphony No. 9 in D minor"?',
        options: ['Mozart', 'Haydn', 'Beethoven', 'Brahms'],
        correctAnswer: 2,
        explanation: 'Beethoven composed Symphony No. 9, also known as the "Choral Symphony".',
        difficulty: 'medium',
        category: 'Classical'
      },
      {
        id: '3',
        question: 'What period is Mozart associated with?',
        options: ['Baroque', 'Classical', 'Romantic', 'Modern'],
        correctAnswer: 1,
        explanation: 'Mozart was a key figure in the Classical period.',
        difficulty: 'medium',
        category: 'Classical'
      },
      {
        id: '4',
        question: 'Who composed "The Well-Tempered Clavier"?',
        options: ['Bach', 'Handel', 'Telemann', 'Scarlatti'],
        correctAnswer: 0,
        explanation: 'J.S. Bach composed "The Well-Tempered Clavier".',
        difficulty: 'medium',
        category: 'Classical'
      },
      {
        id: '5',
        question: 'Which composer is known for "Für Elise"?',
        options: ['Mozart', 'Chopin', 'Beethoven', 'Liszt'],
        correctAnswer: 2,
        explanation: 'Beethoven composed "Für Elise".',
        difficulty: 'medium',
        category: 'Classical'
      },
      {
        id: '6',
        question: 'What nationality was Frédéric Chopin?',
        options: ['French', 'German', 'Polish', 'Austrian'],
        correctAnswer: 2,
        explanation: 'Chopin was Polish, though he spent much of his career in France.',
        difficulty: 'medium',
        category: 'Classical'
      },
      {
        id: '7',
        question: 'Who composed "The Magic Flute"?',
        options: ['Verdi', 'Puccini', 'Wagner', 'Mozart'],
        correctAnswer: 3,
        explanation: 'Mozart composed the opera "The Magic Flute".',
        difficulty: 'medium',
        category: 'Classical'
      },
      {
        id: '8',
        question: 'Which composer wrote "Pictures at an Exhibition"?',
        options: ['Tchaikovsky', 'Mussorgsky', 'Rimsky-Korsakov', 'Rachmaninoff'],
        correctAnswer: 1,
        explanation: 'Modest Mussorgsky composed "Pictures at an Exhibition".',
        difficulty: 'medium',
        category: 'Classical'
      },
      {
        id: '9',
        question: 'What instrument did Paganini famously play?',
        options: ['Piano', 'Violin', 'Cello', 'Flute'],
        correctAnswer: 1,
        explanation: 'Niccolò Paganini was a virtuoso violinist.',
        difficulty: 'medium',
        category: 'Classical'
      },
      {
        id: '10',
        question: 'Who composed "Bolero"?',
        options: ['Debussy', 'Ravel', 'Satie', 'Fauré'],
        correctAnswer: 1,
        explanation: 'Maurice Ravel composed "Bolero".',
        difficulty: 'medium',
        category: 'Classical'
      }
    ]
  },
  {
    id: 'advanced-harmony',
    title: 'Advanced Harmony',
    description: 'Challenge yourself with complex harmonic concepts',
    category: 'Theory',
    difficulty: 'hard',
    questions: [
      {
        id: '1',
        question: 'What is a Neapolitan sixth chord?',
        options: ['A major chord on the flattened second degree', 'A diminished chord on the sixth degree', 'An augmented chord on the second degree', 'A minor chord on the raised fourth degree'],
        correctAnswer: 0,
        explanation: 'A Neapolitan sixth chord is a major chord built on the flattened second degree, typically in first inversion.',
        difficulty: 'hard',
        category: 'Theory'
      },
      {
        id: '2',
        question: 'In a German augmented sixth chord in C major, what notes are present?',
        options: ['Ab-C-D#-F#', 'Ab-C-Eb-F#', 'A-C-D#-F#', 'Ab-Cb-D#-F#'],
        correctAnswer: 0,
        explanation: 'The German augmented sixth in C major contains Ab-C-D#-F#.',
        difficulty: 'hard',
        category: 'Theory'
      },
      {
        id: '3',
        question: 'What is the function of a common-tone diminished seventh chord?',
        options: ['Modulation', 'Chromatic voice leading', 'Sequence', 'Cadential emphasis'],
        correctAnswer: 1,
        explanation: 'Common-tone diminished seventh chords primarily serve chromatic voice leading functions.',
        difficulty: 'hard',
        category: 'Theory'
      },
      {
        id: '4',
        question: 'What scale is implied by the chord progression: Cmaj7 - F#dim7 - Dm7 - G7?',
        options: ['C major with chromatic passing chord', 'C lydian', 'G mixolydian', 'F major'],
        correctAnswer: 0,
        explanation: 'This progression uses a chromatic passing diminished chord between I and ii.',
        difficulty: 'hard',
        category: 'Theory'
      },
      {
        id: '5',
        question: 'What is an enharmonic German sixth chord equivalent to?',
        options: ['Dominant seventh chord', 'Diminished seventh chord', 'Half-diminished seventh chord', 'Major seventh chord'],
        correctAnswer: 0,
        explanation: 'An enharmonically respelled German sixth chord is equivalent to a dominant seventh chord.',
        difficulty: 'hard',
        category: 'Theory'
      },
      {
        id: '6',
        question: 'In Schenkerian analysis, what is the Urlinie?',
        options: ['The fundamental bass line', 'The fundamental melodic descent', 'The harmonic rhythm', 'The motivic structure'],
        correctAnswer: 1,
        explanation: 'The Urlinie is the fundamental melodic descent in Schenkerian analysis.',
        difficulty: 'hard',
        category: 'Theory'
      },
      {
        id: '7',
        question: 'What characterizes a Tristam chord?',
        options: ['Half-diminished seventh chord', 'Augmented sixth chord', 'Altered dominant chord', 'Neapolitan chord'],
        correctAnswer: 0,
        explanation: 'The Tristan chord is analyzed as a half-diminished seventh chord.',
        difficulty: 'hard',
        category: 'Theory'
      },
      {
        id: '8',
        question: 'What is the theoretical basis for negative harmony?',
        options: ['Symmetrical inversion around the tonic', 'Modal interchange', 'Chromatic mediant relationships', 'Enharmonic equivalence'],
        correctAnswer: 0,
        explanation: 'Negative harmony is based on symmetrical inversion around the axis between tonic and dominant.',
        difficulty: 'hard',
        category: 'Theory'
      },
      {
        id: '9',
        question: 'What interval class does the tritone represent in twelve-tone theory?',
        options: ['IC 4', 'IC 5', 'IC 6', 'IC 7'],
        correctAnswer: 2,
        explanation: 'The tritone represents interval class 6 in twelve-tone theory.',
        difficulty: 'hard',
        category: 'Theory'
      },
      {
        id: '10',
        question: 'What is a pivot chord modulation?',
        options: ['Direct modulation without preparation', 'Modulation using a chord common to both keys', 'Chromatic modulation', 'Sequential modulation'],
        correctAnswer: 1,
        explanation: 'A pivot chord modulation uses a chord that functions in both the old and new keys.',
        difficulty: 'hard',
        category: 'Theory'
      }
    ]
  }
];

export const getQuizById = (id: string): Quiz | undefined => {
  return musicQuizzes.find(quiz => quiz.id === id);
};

export const getQuizzesByCategory = (category: string): Quiz[] => {
  return musicQuizzes.filter(quiz => quiz.category === category);
};

export const getQuizzesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Quiz[] => {
  return musicQuizzes.filter(quiz => quiz.difficulty === difficulty);
};
