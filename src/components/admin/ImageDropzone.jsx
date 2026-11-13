import React, { useState, useRef } from 'react';
import { Upload, X, Trash2, CheckCircle2, RefreshCw, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { uploadService } from '../../services/uploadService';

export default function ImageDropzone({
  value,
  onChange,
  label = 'Upload Image',
  hint = 'Drag & drop image here or browse from device (PNG, JPG, WebP up to 10MB)',
  aspectRatio = 'aspect-video', // 'aspect-video', 'aspect-square', 'aspect-[4/3]', 'h-36'
  required = false
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP, etc.).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const res = await uploadService.uploadSingle(file);
      if (res && res.url) {
        onChange(res.url);
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err) {
      setError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-gray-300">
            {label} {required && <span className="text-amber-400">*</span>}
          </label>
          {value && (
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Uploaded to Server
            </span>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative w-full rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 scale-[0.99]'
            : value
            ? 'border-[#2a303e] bg-[#141820] hover:border-amber-400/50'
            : 'border-dashed border-[#2a303e] bg-[#141820] hover:border-amber-400/60 hover:bg-[#181d26]'
        }`}
      >
        {/* Uploading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4">
            <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mb-2" />
            <span className="text-xs font-bold text-white tracking-wide">
              Uploading Image to Server...
            </span>
            <span className="text-[10px] text-gray-400 mt-1">Please wait a moment</span>
          </div>
        )}

        {/* Existing Image Preview */}
        {value ? (
          <div className={`relative w-full ${aspectRatio} bg-black flex items-center justify-center overflow-hidden`}>
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-lg bg-red-500/90 hover:bg-red-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>

            {/* Quick delete badge in top right */}
            <button
              type="button"
              onClick={handleRemove}
              title="Remove image"
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-gray-300 hover:text-white transition z-10"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Empty Dropzone State */
          <div className="p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-amber-400 transition-colors">
                Click to browse or drag & drop image
              </span>
              <span className="text-[11px] text-gray-400 block mt-0.5 max-w-xs mx-auto leading-tight">
                {hint}
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1 font-mono">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

