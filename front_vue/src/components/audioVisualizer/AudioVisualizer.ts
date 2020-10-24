export declare class AudioVisualizer {
  static readonly AudioVisualizer: typeof AudioVisualizer;
  constructor(
    context: string | CanvasRenderingContext2D | HTMLCanvasElement | ArrayLike<CanvasRenderingContext2D | HTMLCanvasElement>,
    // options: AudioVisualizer.ChartConfiguration
  )
  src: string;
  width: number | null;
  height: number | null;
  ctx: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement | null;

  static defaults: {

  };
}
