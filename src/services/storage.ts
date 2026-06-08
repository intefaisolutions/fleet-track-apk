import { api, unwrapApi, type ApiEnvelope } from './api';

export type StorageFolder = 'receipts' | 'vehicles' | 'profiles';

export interface UploadImageResult {
  url: string;
  path: string;
}

export interface RNUploadFile {
  uri: string;
  type: string;
  name: string;
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function uploadImage(
  file: RNUploadFile,
  folder: StorageFolder,
): Promise<UploadImageResult> {
  const formData = new FormData();
  formData.append('file', file as unknown as Blob);

  const response = await api.post<ApiEnvelope<UploadImageResult>>(
    `/storage/upload?folder=${folder}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: (data) => data,
    },
  );

  return unwrapApi(response);
}

export { MAX_UPLOAD_BYTES };
