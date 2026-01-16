export type GameMode = "single" | "continuous";

export type Difficulty = "easy" | "normal" | "hard";

export type JudgeResult = "perfect" | "good" | "ok" | "ko";

export interface BattleData {
  bossStatement: string;
  phrases: {
    first: string[];
    second: string[];
    third: string[];
  };
}

export interface GenerateBattleRequest {
  mode: GameMode;
  difficulty?: Difficulty;
}

export interface GenerateBattleResponse {
  bossStatement: string;
  phrases: {
    first: string[];
    second: string[];
    third: string[];
  };
}

export interface JudgeRequest {
  bossStatement: string;
  playerResponse: string;
}

export interface JudgeResponse {
  score: number;
  coherence: number;
  rebuttal: number;
  comment: string;
  result: JudgeResult;
}

export interface GameState {
  mode: GameMode;
  score: number;
  combo: number;
  currentBattle: BattleData | null;
  selectedPhrases: [string?, string?, string?];
  gameOver: boolean;
}
