"use client";

import { useState } from "react";

import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type NotificationPrefs = {
  emailApprovals: boolean;
  smsReminders: boolean;
  advisories: boolean;
  doNotDisturb: boolean;
  dndStart: string;
  dndEnd: string;
};

const defaultPrefs: NotificationPrefs = {
  emailApprovals: true,
  smsReminders: true,
  advisories: true,
  doNotDisturb: false,
  dndStart: "21:00",
  dndEnd: "07:00",
};

export default function Page() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);
  const [message, setMessage] = useState<string | null>(null);

  const handleToggle = (key: keyof NotificationPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] as boolean }));
    setMessage("Settings updated (local only).");
  };

  const handleTimeChange =
    (key: "dndStart" | "dndEnd") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPrefs((prev) => ({ ...prev, [key]: e.target.value }));
      setMessage("Settings updated (local only).");
    };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure notifications and account preferences."
      />

      {message && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          {message} Changes are not yet saved to the server.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Choose how you want to be notified about requests and
              appointments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-start justify-between gap-3 rounded-lg border bg-background/60 p-4">
              <div>
                <p className="font-medium">Email updates</p>
                <p className="text-sm text-muted-foreground">
                  Get emails when requests are approved or rejected.
                </p>
              </div>
              <Input
                type="checkbox"
                checked={prefs.emailApprovals}
                onChange={() => handleToggle("emailApprovals")}
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-start justify-between gap-3 rounded-lg border bg-background/60 p-4">
              <div>
                <p className="font-medium">SMS reminders</p>
                <p className="text-sm text-muted-foreground">
                  Receive SMS reminders for upcoming appointments.
                </p>
              </div>
              <Input
                type="checkbox"
                checked={prefs.smsReminders}
                onChange={() => handleToggle("smsReminders")}
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-start justify-between gap-3 rounded-lg border bg-background/60 p-4">
              <div>
                <p className="font-medium">Advisories & outages</p>
                <p className="text-sm text-muted-foreground">
                  Be alerted about maintenance windows and community advisories.
                </p>
              </div>
              <Input
                type="checkbox"
                checked={prefs.advisories}
                onChange={() => handleToggle("advisories")}
                className="h-5 w-5"
              />
            </label>

            <div className="rounded-lg border bg-background/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">Do not disturb</p>
                  <p className="text-sm text-muted-foreground">
                    Pause notifications during quiet hours.
                  </p>
                </div>
                <Input
                  type="checkbox"
                  checked={prefs.doNotDisturb}
                  onChange={() => handleToggle("doNotDisturb")}
                  className="h-5 w-5"
                />
              </div>
              {prefs.doNotDisturb && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dndStart">Start</Label>
                    <Input
                      id="dndStart"
                      type="time"
                      value={prefs.dndStart}
                      onChange={handleTimeChange("dndStart")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dndEnd">End</Label>
                    <Input
                      id="dndEnd"
                      type="time"
                      value={prefs.dndEnd}
                      onChange={handleTimeChange("dndEnd")}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage account access and quick links.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-background/60 p-4">
              <p className="font-medium">Account email</p>
              <p className="text-sm text-muted-foreground">
                Your login email is managed in the Profile page.
              </p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <a href="/user/profile">Manage profile</a>
              </Button>
            </div>

            <div className="rounded-lg border bg-background/60 p-4">
              <p className="font-medium">Security</p>
              <p className="text-sm text-muted-foreground">
                Change password or sign out of other devices from the login
                page.
              </p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <a href="/login">Go to login</a>
              </Button>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
              These settings are for UI preference only and are not stored in
              the database.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
