import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { StorageFolder } from '../services/storage';
import { pickAndUploadImage } from '../utils/pickReceiptImage';

type Props = {
  receiptUrl: string;
  onReceiptUrlChange: (url: string) => void;
  uploading: boolean;
  onUploadingChange: (value: boolean) => void;
  folder?: StorageFolder;
  label?: string;
  activeColor?: string;
  style?: ViewStyle;
};

export function ReceiptUploadButton({
  receiptUrl,
  onReceiptUrlChange,
  uploading,
  onUploadingChange,
  folder = 'receipts',
  label = 'Upload Receipt',
  activeColor = '#1DA1F2',
  style,
}: Props) {
  const handlePress = async () => {
    if (uploading) return;
    onUploadingChange(true);
    try {
      const url = await pickAndUploadImage(folder);
      if (url) {
        onReceiptUrlChange(url);
      }
    } finally {
      onUploadingChange(false);
    }
  };

  return (
    <View style={style}>
      <TouchableOpacity
        style={[styles.uploadBtn, { borderColor: activeColor }]}
        onPress={handlePress}
        activeOpacity={0.85}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color={activeColor} />
        ) : (
          <Icon name="camera-plus-outline" size={22} color={activeColor} />
        )}
        <Text style={[styles.uploadText, { color: activeColor }]}>
          {uploading ? 'Uploading…' : label}
        </Text>
      </TouchableOpacity>
      {receiptUrl ? (
        <View style={styles.savedRow}>
          <Icon name="check-circle" size={16} color="#059669" />
          <Text style={styles.savedText} numberOfLines={1}>
            Receipt saved
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 14,
    backgroundColor: '#F9FAFB',
  },
  uploadText: { fontWeight: '500', fontSize: 13 },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  savedText: { color: '#059669', fontSize: 12, fontWeight: '600', flex: 1 },
});
