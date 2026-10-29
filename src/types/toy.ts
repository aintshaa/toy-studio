export type ToyId =
  | 'robot'
  | 'doll'
  | 'car'
  | 'kite'
  | 'ball'
  | 'train'
  | 'blocks'
  | 'teddy';

export interface ToyItem {
  id: ToyId;
  name: string;
  article: 'a' | 'an' | 'some';
  spriteRow: number; // 0 or 1
  spriteCol: number; // 0, 1, 2, 3
  isFromSheet: boolean;
  phonics: string;
  soundCue: string;
  funFact: string;
  emoji: string;
  accentColor: string;
}

export type WordCategory = 'size' | 'age_speed' | 'colours';

export interface DescribingWord {
  id: string;
  word: string;
  category: WordCategory;
  article: 'a' | 'an'; // rule for "It's [a/an] [word] [toy]"
  visualCue: string;
  meaning: string;
  colorSwatch?: string;
  iconName: string;
}

export type LabelTheme = 'pastelPink' | 'pastelMint' | 'pastelLavender' | 'pastelButter' | 'pastelPeach';

export interface ToyLabel {
  id: string;
  studentName: string;
  studentClass: string;
  toyId: ToyId;
  describingWordId: string;
  sentence: string;
  extraSentence?: string;
  theme: LabelTheme;
  createdAt: string;
  likes: number;
}
