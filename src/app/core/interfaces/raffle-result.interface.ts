import {Stargazer} from './stargazer.interface';

export interface RaffleResult {
  winner: Stargazer;
  timestamp: Date;
  repoName: string;
  totalParticipants: number;
}
