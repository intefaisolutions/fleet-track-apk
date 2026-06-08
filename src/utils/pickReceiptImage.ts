import { Alert } from 'react-native';
import {
  launchImageLibrary,
  type Asset,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import { getApiErrorMessage } from '../services/api';
import { MAX_UPLOAD_BYTES, uploadImage, type StorageFolder } from '../services/storage';

const PICKER_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  selectionLimit: 1,
  quality: 0.85,
  maxWidth: 1920,
  maxHeight: 1920,
};

function assetToUploadFile(asset: Asset) {
  const uri = asset.uri;
  if (!uri) {
    throw new Error('Could not read image file');
  }

  const type = asset.type || 'image/jpeg';
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
  const name = asset.fileName || `upload-${Date.now()}.${ext}`;

  return { uri, type, name };
}

export async function pickAndUploadImage(
  folder: StorageFolder = 'receipts',
): Promise<string | null> {
  const result = await launchImageLibrary(PICKER_OPTIONS);

  if (result.didCancel || !result.assets?.length) {
    return null;
  }

  const asset = result.assets[0];
  if (asset.fileSize && asset.fileSize > MAX_UPLOAD_BYTES) {
    Alert.alert('Error', 'Image must be under 5MB');
    return null;
  }

  try {
    const file = assetToUploadFile(asset);
    const uploaded = await uploadImage(file, folder);
    return uploaded.url;
  } catch (error) {
    Alert.alert('Upload failed', getApiErrorMessage(error, 'Could not upload image'));
    return null;
  }
}
