'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import type { Announcement } from "@/components/announcement-card";

type AnnouncementFormData = Omit<Announcement, 'date' | 'id'> & { file?: File };

interface AnnouncementFormProps {
  announcement?: Announcement;
  onSave: (data: AnnouncementFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
  isSaving?: boolean;
}

export function AnnouncementForm({
  announcement,
  onSave,
  onCancel,
  isEditing = false,
  isSaving = false,
}: AnnouncementFormProps) {
  const [title, setTitle] = useState(announcement?.title || '');
  const [content, setContent] = useState(announcement?.content || '');
  const [imagePreview, setImagePreview] = useState(announcement?.imageUrl || '');
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clean up the blob URL when the component unmounts or the preview changes
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(undefined);
    setImagePreview('');
    // Reset the file input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData: AnnouncementFormData = {
      title,
      content,
      imageUrl: imagePreview, // Pass the current URL (could be old or empty)
    };
    // Only attach the file object if a new one has been selected
    if (imageFile) {
      formData.file = imageFile;
    }
    onSave(formData);
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{isEditing ? 'Edit Announcement' : 'New Announcement'}</h3>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        {imagePreview && (
          <div className="relative h-40 w-full">
            <Image src={imagePreview} alt="Announcement preview" fill style={{ objectFit: 'cover' }} className="rounded-md" />
          </div>
        )}
        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
        {imagePreview && (
          <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
            Remove Image
          </Button>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Announcement'}
        </Button>
      </div>
    </form>
  );
}
