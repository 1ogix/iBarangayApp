"use client";

import { useState, FormEvent } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, you would collect form data and send it to a server action.
    // For now, we'll just simulate a successful submission.
    console.log("Form submitted!");
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Request Submitted"
          description="Your request for a Barangay Clearance has been received."
        />
        <div className="rounded-lg border border-dashed bg-background/60 p-10 text-center">
          <h2 className="text-lg font-semibold">Thank You!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your request is now pending for admin approval. You can track its
            status on the &quot;My Requests&quot; page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Barangay Clearance"
        description="Request a barangay clearance online."
      />
      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
          <CardDescription>
            Please fill out the form with your correct details.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Juan" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleInitial">Middle Initial</Label>
                <Input id="middleInitial" placeholder="D" maxLength={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Dela Cruz" required />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="30" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  placeholder="Block 1, Lot 2, Sector 3"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                placeholder="e.g., For Local Employment"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit Request</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
