export interface Size {
  readonly width: number;
  readonly height: number;
}

export interface Coordinates {
  readonly x: number;
  readonly y: number;
}

export interface TickerData {
  readonly elapsedMS: number;
  readonly lastTime: number;
  readonly deltaTime: number;
}

export interface Updatable {
  update(tickerData: TickerData): void;
}
