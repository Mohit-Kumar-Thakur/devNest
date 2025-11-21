import React from 'react';
import { FileText, X } from 'lucide-react';

interface MediaAttachmentsProps {
  uploadedImages: string[];
  uploadedVideos: string[];
  uploadedPdfs: { name: string; url: string }[];
  onImagesChange: (images: string[]) => void;
  onVideosChange: (videos: string[]) => void;
  onPdfsChange: (pdfs: { name: string; url: string }[]) => void;
}

export const MediaAttachments: React.FC<MediaAttachmentsProps> = ({
  uploadedImages,
  uploadedVideos,
  uploadedPdfs,
  onImagesChange,
  onVideosChange,
  onPdfsChange
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {uploadedImages.map((img, i) => (
        <div key={i} className="relative group">
          <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
          <button
            onClick={() => onImagesChange(uploadedImages.filter((_, idx) => idx !== i))}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      {uploadedVideos.map((vid, i) => (
        <div key={i} className="relative group">
          <video src={vid} className="w-20 h-20 object-cover rounded-lg" />
          <button
            onClick={() => onVideosChange(uploadedVideos.filter((_, idx) => idx !== i))}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      {uploadedPdfs.map((pdf, i) => (
        <div key={i} className="relative group flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
          <FileText className="w-4 h-4" />
          <span className="text-xs">{pdf.name}</span>
          <button
            onClick={() => onPdfsChange(uploadedPdfs.filter((_, idx) => idx !== i))}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};