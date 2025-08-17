import React, { useState, useCallback } from "react";
import { Upload, Image, AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const acceptedFormats = ['image/jpeg', 'image/png', 'image/tiff'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxImages = 50;

  const validateFile = (file: File): boolean => {
    if (!acceptedFormats.includes(file.type)) {
      toast({
        title: "Invalid Format",
        description: `${file.name} - Only JPEG, PNG, and TIFF formats are supported`,
        variant: "destructive",
      });
      return false;
    }
    
    if (file.size > maxFileSize) {
      toast({
        title: "File Too Large", 
        description: `${file.name} - Maximum file size is 10MB`,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxImages) {
      toast({
        title: "Too Many Images",
        description: `Maximum ${maxImages} images allowed. Current: ${images.length}`,
        variant: "destructive",
      });
      return;
    }

    const validFiles = fileArray.filter(validateFile);
    
    const newImages: UploadedImage[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesUploaded(updatedImages);

    if (newImages.length > 0) {
      toast({
        title: "Images Uploaded",
        description: `Successfully uploaded ${newImages.length} microscopy image${newImages.length > 1 ? 's' : ''}`,
      });
    }
  }, [images, onImagesUploaded, toast]);

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesUploaded(updatedImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={`border-2 border-dashed transition-colors duration-300 shadow-card-medical ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      }`}>
        <CardContent className="p-8">
          <div
            className="text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mx-auto w-12 h-12 mb-4 bg-gradient-medical rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary-foreground" />
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload Microscopy Images
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Drag and drop urine sediment microscopy images or click to browse. 
              Supports JPEG, PNG, and TIFF formats up to 10MB each.
            </p>
            
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.tiff"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            
            <Button 
              asChild 
              className="bg-gradient-medical hover:shadow-glow transition-all duration-300"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <Image className="mr-2 h-4 w-4" />
                Select Images
              </label>
            </Button>
            
            <div className="flex justify-center items-center mt-4 space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-success mr-1" />
                JPEG, PNG, TIFF
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-warning mr-1" />
                Max 10MB each
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-accent mr-1" />
                Up to {maxImages} images
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {images.length > 0 && (
        <Card className="shadow-card-medical">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center">
              <Image className="mr-2 h-4 w-4" />
              Uploaded Images ({images.length}/{maxImages})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.preview}
                    alt={image.file.name}
                    className="w-full h-24 object-cover rounded-lg border shadow-sm"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="bg-black/70 text-white text-xs px-1 py-0.5 rounded truncate">
                      {image.file.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUploader;