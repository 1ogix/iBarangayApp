'use client'
import { useState } from 'react';
import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import { AnnouncementCard } from "@/components/announcement-card";
import { Announcement } from "@/components/announcement-card";
import { AnnouncementForm } from "@/components/announcement-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Page() {
  const [isAdding, setIsAdding] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      title: "Announcement Title 1",
      content: "This is a placeholder for the announcement content.",
      imageUrl: "",
      date: "October 26, 2025",
    },
    {
      title: "Announcement Title 2",
      content: "This is a placeholder for the announcement content.",
      imageUrl: "",
      date: "October 26, 2025",
    },
    {
      title: "Announcement Title 3",
      content: "This is a placeholder for the announcement content.",
      imageUrl: "",
      date: "October 26, 2025",
    },
  ]);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const handleSave = (announcement: Omit<Announcement, 'date'> | Announcement) => {
    if ('date' in announcement) {
      setAnnouncements(announcements.map(a => a.title === announcement.title ? { ...announcement } : a));
      setEditingAnnouncement(null);
    } else {
      const newAnnouncementWithDate = {
        ...announcement,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      };
      setAnnouncements([newAnnouncementWithDate, ...announcements]);
      setIsAdding(false);
    }
  };

  const handleDelete = (announcement: Announcement) => {
    setAnnouncements(announcements.filter(a => a.title !== announcement.title));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements & Broadcast" description="Publish advisories and multi-channel broadcasts." />
      
      <div className="flex justify-end">
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add New Announcement'}
        </Button>
      </div>

      {isAdding && (
        <AnnouncementForm 
          onSave={handleSave} 
          onCancel={() => setIsAdding(false)} 
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {announcements.map((announcement, i) => (
          <AnnouncementCard key={i} announcement={announcement} onEdit={setEditingAnnouncement} onDelete={handleDelete} />
        ))}
      </div>

      {/* Edit Dialog */}
      {editingAnnouncement && (
        <Dialog open={!!editingAnnouncement} onOpenChange={() => setEditingAnnouncement(null)}>
          <DialogContent>
            <AnnouncementForm 
              announcement={editingAnnouncement} 
              onSave={handleSave} 
              onCancel={() => setEditingAnnouncement(null)} 
              isEditing={true} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
