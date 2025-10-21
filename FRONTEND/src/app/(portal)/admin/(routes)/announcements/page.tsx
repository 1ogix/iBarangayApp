"use client";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import { AnnouncementCard } from "@/components/announcement-card";
import type { Announcement } from "@/components/announcement-card";
import { AnnouncementForm } from "@/components/announcement-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { createClient } from './client';
import { createClient } from "@/utils/supabase/client";

// Define a more specific type for use in this component
// that includes the properties from the Supabase table.
type SupabaseAnnouncement = Announcement & {
  id: number;
};

export default function Page() {
  const supabase = createClient();
  const [isAdding, setIsAdding] = useState(false);
  const [announcements, setAnnouncements] = useState<SupabaseAnnouncement[]>(
    []
  );
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<SupabaseAnnouncement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Function to format date from Supabase
  const formatSupabaseDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching announcements:", error);
      // Handle error display to the user
    } else if (data) {
      const formattedData = data.map((item) => ({
        ...item,
        imageUrl: item.image_url ?? "",
        date: formatSupabaseDate(item.created_at),
      }));
      setAnnouncements(formattedData);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleSave = async (
    formData: Omit<SupabaseAnnouncement, "date" | "id"> & { file?: File }
  ) => {
    setIsSaving(true);
    try {
      // If the imageUrl is a blob, it's a preview, so we treat it as empty.
      let imageUrl =
        formData.imageUrl && !formData.imageUrl.startsWith("blob:")
          ? formData.imageUrl
          : "";

      // 1. Check if a new file was uploaded
      if (formData.file) {
        const file = formData.file;
        const fileName = `${Date.now()}-${file.name}`;
        const bucket = "announcement-images";

        // 2. Upload the new file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          // Optionally, show an error to the user
          return;
        }

        // 3. Get the public URL of the uploaded file
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      const announcementData = {
        title: formData.title,
        content: formData.content,
        image_url: imageUrl,
      };

      // 4. Save the announcement (create or update) with the correct image URL
      if ("id" in formData && formData.id) {
        // Update existing announcement
        const { error } = await supabase
          .from("announcements")
          .update(announcementData)
          .eq("id", formData.id);

        if (error) console.error("Error updating announcement:", error);
        setEditingAnnouncement(null);
      } else {
        // Create new announcement
        const { error } = await supabase
          .from("announcements")
          .insert([announcementData]);

        if (error) console.error("Error creating announcement:", error);
        setIsAdding(false);
      }

      // 5. Refresh the list to show the changes
      await fetchAnnouncements();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (announcement: SupabaseAnnouncement) => {
    if (!announcement.id) return;

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", announcement.id);

    if (error) {
      console.error("Error deleting announcement:", error);
    } else {
      // Refresh the list to remove the deleted item
      await fetchAnnouncements();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements & Broadcast"
        description="Publish advisories and multi-channel broadcasts."
      />

      <div className="flex justify-end">
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "Cancel" : "Add New Announcement"}
        </Button>
      </div>

      {isAdding && (
        <AnnouncementForm
          onSave={handleSave}
          onCancel={() => setIsAdding(false)}
          isSaving={isSaving}
        />
      )}

      {isLoading ? (
        <p>Loading announcements...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onEdit={(ann) =>
                setEditingAnnouncement(ann as SupabaseAnnouncement)
              }
              onDelete={() => handleDelete(announcement)}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingAnnouncement && (
        <Dialog
          open={!!editingAnnouncement}
          onOpenChange={() => setEditingAnnouncement(null)}
        >
          <DialogContent>
            <AnnouncementForm
              announcement={editingAnnouncement}
              onSave={handleSave}
              onCancel={() => setEditingAnnouncement(null)}
              isEditing={true}
              isSaving={isSaving}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
