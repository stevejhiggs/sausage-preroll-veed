import fetchVeed from './fetchVeed';

export type AssetType = 'video' | 'image';
export type AssetState = 'pending'; // unclear from the docs what possibilites this has

export interface Asset {
  id: string;
  type: AssetType;
  state: AssetState;
  workspace_id: String;
  path: String;
  metadata: Record<string, any>;
  transcribe: {
    language: string;
  };
  extracted_audio_path: string | null;
  transcription_path: string | null;
  transcription: string | null;
  created_at: number;
  modified_at: number;
  url: string;
  extracted_audio_url: string | null;
  proxy_url: string | null;
  transcription_url: string | null;
}

interface AssetSlot {
  url: string;
  asset: Asset;
}

export async function createAsset(apiKey: string, extension: string, transcriptionLanguage?: string): Promise<AssetSlot> {
  const body: any = { extension };
  if (transcriptionLanguage) {
    body.transcribe = { language: transcriptionLanguage };
  }

  const veed = fetchVeed(apiKey);
  return veed.post<AssetSlot>('https://api.veed.io/api/assets', body);
}

export async function listAssets(apiKey: string): Promise<Asset[]> {
  const veed = fetchVeed(apiKey);
  return veed.get<Asset[]>('https://api.veed.io/api/assets');
}

export async function getAssetInfo(apiKey: string, assetId: string): Promise<Asset | null> {
  const veed = fetchVeed(apiKey);
  return veed.get<Asset>(`https://api.veed.io/api/assets/${assetId}`);
}
