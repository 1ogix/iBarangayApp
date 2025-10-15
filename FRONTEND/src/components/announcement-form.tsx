import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Announcement } from "./announcement-card";

interface AnnouncementFormProps {
  announcement?: Omit<Announcement, 'date'> | Announcement;
  onSave: (announcement: Omit<Announcement, 'date'> | Announcement) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function AnnouncementForm({ announcement, onSave, onCancel, isEditing = false }: AnnouncementFormProps) {
  const [formData, setFormData] = useState(announcement || { title: '', content: '', imageUrl: '' });
  const isDirty = JSON.stringify(formData) !== JSON.stringify(announcement || { title: '', content: '', imageUrl: '' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Announcement" : "New Announcement"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Heading
          </label>
          <Input id="title" placeholder="Enter the announcement heading" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <Textarea id="content" placeholder="Enter the announcement content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Featured Image
          </label>
          <Input id="image" type="file" onChange={(e) => setFormData({ ...formData, imageUrl: e.target.files ? URL.createObjectURL(e.target.files[0]) : '' })} />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!isDirty}>{isEditing ? "Save Changes" : "Save Announcement"}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to save this {isEditing ? "changes" : "announcement"}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will save the {isEditing ? "changes and make it visible to the public" : "announcement and make it visible to the public"}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button onClick={() => onSave(formData)}>{isEditing ? "Save Changes" : "Save Announcement"}</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
