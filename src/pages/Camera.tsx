import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, Camera as CameraIcon } from 'lucide-react';
import { uploadFoodImage } from '../services/api';
import { UploadStatus } from '../types';
import AppLoader from '../components/AppLoader';

const Camera: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    progress: 0,
    error: null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const isValidImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  };

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
      
      // Mock API upload (replace with actual API call)
      const response = await new Promise<{id: string}>(resolve => {
        setTimeout(() => {
          resolve({ id: 'recipe-123' });
        }, 2000);
      });
      
      clearInterval(progressInterval);
      
      setUploadStatus({
        isUploading: false,
        progress: 100,
        error: null
      });
      
      // Navigate to recipe page
      navigate(`/recipe/${response.id}`);
    } catch (error) {
      setUploadStatus({
        isUploading: false,
        progress: 0,
        error: 'Failed to upload image'
      });
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Discover Recipes</h1>
        <p className="page-subtitle">Take a photo of food to get recipe suggestions</p>
      </div>

      <div className="card max-w-lg mx-auto">
        <div className="p-6">
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 
              ${previewUrl ? 'border-primary-main' : 'border-gray-300'} 
              ${uploadStatus.error ? 'border-feedback-error' : ''}
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
                  className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black/80 transition-colors"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-primary-main" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">Drag and drop your food image here</p>
                <p className="text-xs text-gray-500 mb-4">or</p>
                <div className="space-x-3">
                  <button 
                    className="btn btn-primary text-sm py-2 px-4"
                    onClick={handleBrowseClick}
                  >
                    <CameraIcon size={16} className="mr-2" />
                    Browse files
                  </button>
                </div>
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
              <div className="mt-4 p-3 bg-feedback-error/10 text-feedback-error rounded-md text-sm">
                {uploadStatus.error}
              </div>
            )}
            
            {uploadStatus.isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-main h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadStatus.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {uploadStatus.progress < 100 
                    ? `Uploading... ${uploadStatus.progress}%`
                    : 'Processing image...'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
          <button
            className="btn btn-outline py-2 px-4 text-sm"
            onClick={handleClearImage}
            disabled={!selectedFile || uploadStatus.isUploading}
          >
            Reset
          </button>
          <button
            className="btn btn-primary py-2 px-4 text-sm flex items-center"
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus.isUploading}
          >
            {uploadStatus.isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Generate Recipe
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-10 max-w-lg mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">How It Works</h2>
        </div>
        
        <div className="flex justify-between items-start">
          <div className="text-center w-1/3">
            <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mx-auto mb-2">
              <span className="font-semibold text-primary-main">1</span>
            </div>
            <p className="text-sm text-gray-600">Take or upload a food photo</p>
          </div>
          <div className="text-center w-1/3">
            <div className="w-12 h-12 rounded-full bg-secondary-light/20 flex items-center justify-center mx-auto mb-2">
              <span className="font-semibold text-secondary-main">2</span>
            </div>
            <p className="text-sm text-gray-600">AI analyzes the image</p>
          </div>
          <div className="text-center w-1/3">
            <div className="w-12 h-12 rounded-full bg-feedback-info/20 flex items-center justify-center mx-auto mb-2">
              <span className="font-semibold text-feedback-info">3</span>
            </div>
            <p className="text-sm text-gray-600">Get your custom recipe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera; 