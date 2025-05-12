import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Button from './ui/Button';
import { Card, CardContent, CardFooter } from './ui/Card';
import { isValidImageFile, createImagePreview } from '../utils/imageHelpers';
import { uploadFoodImage } from '../services/api';
import { UploadStatus } from '../types';

interface ImageUploadProps {
  onUploadComplete: (recipeId: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    progress: 0,
    error: null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (!isValidImageFile(file)) {
      setUploadStatus({
        ...uploadStatus,
        error: 'Please select a valid image file (JPEG, PNG, or WebP)'
      });
      return;
    }
    
    try {
      const preview = await createImagePreview(file);
      setPreviewUrl(preview);
      setSelectedFile(file);
      setUploadStatus({
        isUploading: false,
        progress: 0,
        error: null
      });
    } catch (error) {
      setUploadStatus({
        ...uploadStatus,
        error: 'Failed to create image preview'
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploadStatus({
      isUploading: true,
      progress: 0,
      error: null
    });
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadStatus(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 300);
      
      const response = await uploadFoodImage(selectedFile);
      
      clearInterval(progressInterval);
      
      setUploadStatus({
        isUploading: false,
        progress: 100,
        error: null
      });
      
      onUploadComplete(response.id);
    } catch (error) {
      setUploadStatus({
        isUploading: false,
        progress: 0,
        error: 'Failed to upload image'
      });
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Upload Food Image</h2>
        <p className="text-slate-600 mb-6">
          Take a photo of your food and our AI will generate a recipe for you.
        </p>
        
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 
            ${previewUrl ? 'border-[#8AC926]' : 'border-slate-300'} 
            ${uploadStatus.error ? 'border-red-400' : ''}
            transition-colors duration-200
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {previewUrl ? (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Food preview" 
                className="w-full rounded-lg object-cover max-h-[300px]"
              />
              <button
                onClick={handleClearImage}
                className="absolute top-2 right-2 bg-slate-800/70 text-white p-1 rounded-full hover:bg-slate-900/70 transition-colors"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#FF6B35]/10 flex items-center justify-center mb-4">
                <ImageIcon className="h-6 w-6 text-[#FF6B35]" />
              </div>
              <p className="text-sm font-medium text-slate-700 mb-1">Drag and drop your food image here</p>
              <p className="text-xs text-slate-500 mb-4">or</p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleBrowseClick}
              >
                Browse files
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={e => handleFileChange(e.target.files)}
              />
            </div>
          )}
          
          {uploadStatus.error && (
            <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
              {uploadStatus.error}
            </div>
          )}
          
          {uploadStatus.isUploading && (
            <div className="mt-4">
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div 
                  className="bg-[#FF6B35] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadStatus.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Uploading... {uploadStatus.progress}%
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-3 bg-slate-50">
        <Button
          type="button"
          variant="ghost"
          onClick={handleClearImage}
          disabled={!selectedFile || uploadStatus.isUploading}
        >
          Reset
        </Button>
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || uploadStatus.isUploading}
          isLoading={uploadStatus.isUploading}
          icon={<Upload size={16} />}
        >
          Generate Recipe
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageUpload;