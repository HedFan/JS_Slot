import { WinPosition } from '../components/slot-machine/slot-machine.config';

export interface WinResultData {
  readonly paytableIndex: number;
  readonly winAmount: number;
  readonly lineIndex: number;
}

export type GameAction =
  | { type: 'SPIN_START'; data?: Array<WinPosition> }
  | { type: 'SPIN_COMPLETE'; data: Map<number, WinPosition> }
  | { type: 'SPIN_RESULT'; data: Array<WinResultData> };
