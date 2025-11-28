"use client";

import { useEffect, useMemo, useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";

type Profile = {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  address?: string | null;
  barangay?: string | null;
  purok?: string | null;
  household_size?: number | null;
  emergency_contact_name?: string | null;
  emergency_contact_number?: string | null;
  updated_at?: string | null;
};

type FormState = {
  full_name: string;
  phone: string;
  address: string;
  barangay: string;
  purok: string;
  household_size: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
};

const emptyForm: FormState = {
  full_name: "",
  phone: "",
  address: "",
  barangay: "",
  purok: "",
  household_size: "",
  emergency_contact_name: "",
  emergency_contact_number: "",
};

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Page() {
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [email, setEmail] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Please sign in to view your profile.");
          setIsLoading(false);
          return;
        }

        setEmail(user.email ?? null);

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError || !data) {
          setError("Unable to load your profile. Please refresh.");
          setIsLoading(false);
          return;
        }

        const profile = data as Profile;
        setForm({
          full_name: profile.full_name ?? "",
          phone: profile.phone ?? "",
          address: profile.address ?? "",
          barangay: profile.barangay ?? "",
          purok: profile.purok ?? "",
          household_size:
            profile.household_size === null || profile.household_size === undefined
              ? ""
              : String(profile.household_size),
          emergency_contact_name: profile.emergency_contact_name ?? "",
          emergency_contact_number: profile.emergency_contact_number ?? "",
        });
        setLastUpdated(formatDate(profile.updated_at));
      } catch (err) {
        setError("Unable to load your profile right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [supabase]);

  const handleChange =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("You need to be signed in to save changes.");
        setIsSaving(false);
        return;
      }

      const payload: Partial<Profile> = {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        barangay: form.barangay.trim(),
        purok: form.purok.trim(),
        emergency_contact_name: form.emergency_contact_name.trim(),
        emergency_contact_number: form.emergency_contact_number.trim(),
        updated_at: new Date().toISOString(),
      };

      const householdSize = form.household_size.trim();
      payload.household_size = householdSize === "" ? null : Number(householdSize);

      const { error: updateError } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", user.id);

      if (updateError) {
        setError("Could not save changes. Please try again.");
        setIsSaving(false);
        return;
      }

      setMessage("Profile updated.");
      setLastUpdated(formatDate(payload.updated_at));
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal details and household information."
      />

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Personal details</CardTitle>
              <CardDescription>
                Keep your contact information current so we can reach you for updates.
              </CardDescription>
            </div>
            {message && (
              <p className="text-sm font-medium text-green-700">{message}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={handleChange("full_name")}
                placeholder="Juan Dela Cruz"
                disabled={isLoading || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email ?? ""} disabled readOnly />
              <p className="text-xs text-muted-foreground">
                Email comes from your account and cannot be edited here.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile number</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="+63 9XX XXX XXXX"
                disabled={isLoading || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                rows={2}
                value={form.address}
                onChange={handleChange("address")}
                placeholder="House no., street, subdivision"
                disabled={isLoading || isSaving}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="barangay">Barangay</Label>
                <Input
                  id="barangay"
                  value={form.barangay}
                  onChange={handleChange("barangay")}
                  placeholder="e.g., Busay"
                  disabled={isLoading || isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purok">Purok / Zone</Label>
                <Input
                  id="purok"
                  value={form.purok}
                  onChange={handleChange("purok")}
                  placeholder="e.g., Purok 5"
                  disabled={isLoading || isSaving}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Household & emergency</CardTitle>
              <CardDescription>
                Helps prioritize assistance and verify pickup details.
              </CardDescription>
            </div>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground">Updated {lastUpdated}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="household_size">Household size</Label>
              <Input
                id="household_size"
                type="number"
                min={0}
                value={form.household_size}
                onChange={handleChange("household_size")}
                placeholder="e.g., 4"
                disabled={isLoading || isSaving}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Emergency contact name</Label>
                <Input
                  id="emergency_contact_name"
                  value={form.emergency_contact_name}
                  onChange={handleChange("emergency_contact_name")}
                  placeholder="Parent, spouse, or guardian"
                  disabled={isLoading || isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_number">Emergency contact number</Label>
                <Input
                  id="emergency_contact_number"
                  value={form.emergency_contact_number}
                  onChange={handleChange("emergency_contact_number")}
                  placeholder="+63 9XX XXX XXXX"
                  disabled={isLoading || isSaving}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setForm(emptyForm)}
                disabled={isLoading || isSaving}
              >
                Clear
              </Button>
              <Button type="submit" disabled={isLoading || isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
