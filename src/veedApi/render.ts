import fetchVeed from './fetchVeed';

interface RenderParams {
  dimensions?: {
    width: number;
    height: number;
  };
}

interface RenderParams {
  dimensions?: {
    width: number;
    height: number;
  };
  background_color?: string;
  duration: number | string;
}

type ElementSource = { url: string } | { asset_id: string };

interface ElementPosition {
  origin?: 'top left' | 'top right' | 'bottom left' | 'bottom right';
  x: number | 'center' | 'left' | 'right';
  y: number | 'center' | 'top' | 'bottom';
}

interface ElementCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ElementDuration {
  from: number;
  to: number;
}

interface ElementTrim {
  from: number;
  to: number;
}

interface ElementDimensions {
  width: number;
  height: number;
}

interface VideoElement {
  source: ElementSource;
  trim?: ElementTrim;
  duration?: ElementDuration;
  crop?: ElementCrop;
  dimensions?: ElementDimensions;
  position: ElementPosition;
  z_index?: number;
  rotation?: number;
  volume?: number;
  playback_rate?: number;
  loop?: boolean;
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    exposure?: number;
  };
  effects?: 'vhs' | 'glitch' | 'old';
}

interface AudioElement {
  source: ElementSource;
  trim?: ElementTrim;
  duration?: ElementDuration;
  volume?: number;
  playback_rate?: number;
  loop?: boolean;
}

interface ImageElement {
  source: ElementSource;
  duration?: ElementDuration;
  volume?: number;
  playback_rate?: number;
  loop?: boolean;
  crop?: ElementCrop;
  dimensions?: ElementDimensions;
  position?: ElementPosition;
  z_index?: number;
  rotation?: number;
}

interface TextElement {
  value: string;
  style?: Record<string, string | number>;
  duration?: ElementDuration;
  position?: ElementPosition;
  z_index?: number;
  rotation?: number;
}

interface ProgressBarElement {
  value: string;
  style?: {
    color?: string;
    secondary_color?: string;
    type?: string;
  };
  duration?: ElementDuration;
  dimensions?: ElementDimensions;
  position?: ElementPosition;
  z_index?: number;
  rotation?: number;
}

interface AudioWaveElement {
  value: string;
  style?: {
    color?: string;
    secondary_color?: string;
    type?: string;
  };
  ftt?: { min_db: number; max_db: number };
  duration?: ElementDuration;
  dimensions?: ElementDimensions;
  position?: ElementPosition;
  z_index?: number;
  rotation?: number;
}

interface Element {
  type: 'video' | 'audio' | 'image' | 'text' | 'progress_bar' | 'audio_wave';
  params: VideoElement | AudioElement | ImageElement | TextElement | ProgressBarElement | AudioWaveElement;
}

export interface RenderRequest {
  params?: RenderParams;
  elements: Element[];
}

interface RenderResponse {
  id: string;
}

export interface RenderInfoResponse {
  id: string;
  workspace_id: string;
  data: Element[];
  latest_event: {
    type: 'RENDER/SUCCESS' | 'RENDER/QUEUED' | 'RENDER/PROGRESS' | 'RENDER/FAILURE';
    payload: {
      render_id: string;
      progress: number;
      url?: string;
      message?: string;
    };
  };
  created_at: number;
  modified_at: number;
}

export async function render(apiKey: string, renderDetails: RenderRequest): Promise<RenderResponse> {
  const veed = fetchVeed(apiKey);
  return veed.post<RenderResponse>('https://api.veed.io/api/renders', renderDetails);
}

export async function getRenderInfo(apiKey: string, renderId: string): Promise<RenderInfoResponse> {
  const veed = fetchVeed(apiKey);
  return veed.get<RenderInfoResponse>(`https://api.veed.io/api/renders/${renderId}`);
}
