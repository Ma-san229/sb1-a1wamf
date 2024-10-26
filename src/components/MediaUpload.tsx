import React, { useState } from 'react';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface MediaUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

function MediaUpload({ onUpload, currentUrl }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const isImage = file.type.startsWith('image/');
    const isSizeValid = file.size <= 5 * 1024 * 1024; // 5MB limit

    if (!isImage) {
      toast.error('画像ファイルのみアップロード可能です');
      return;
    }

    if (!isSizeValid) {
      toast.error('ファイルサイズは5MB以下にしてください');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `memories/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUpload(publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onUpload('');
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      ) : (
        <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-pink-300 transition-colors cursor-pointer">
          <div className="flex flex-col items-center space-y-2">
            {uploading ? (
              <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  クリックして画像をアップロード
                </span>
                <span className="text-xs text-gray-400">
                  5MB以下のJPG、PNG、GIF
                </span>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

export default MediaUpload;