import { WinPosition } from '../components';

export interface WinResultData {
  readonly paytableIndex: number;
  readonly winAmount: number;
  readonly lineIndex: number;
}

export type GameAction =
  | { type: 'SPIN_START'; data?: Array<WinPosition> }
  | { type: 'SPIN_COMPLETE'; data: Map<number, WinPosition> }
  | { type: 'SPIN_RESULT'; data: Array<WinResultData> }
  | { type: 'UPDATE_BALANCE'; data: number };

export type DebugModeAction =
  | { type: 'SWITCH_MODE'; data: boolean }
  | { type: 'SENT_MOCK_DATA'; data: Array<WinPosition> }
  | { type: 'SPIN_COMPLETE'; data: Array<Array<string>> | undefined }
  | { type: 'UPDATE_BALANCE'; data: number };
