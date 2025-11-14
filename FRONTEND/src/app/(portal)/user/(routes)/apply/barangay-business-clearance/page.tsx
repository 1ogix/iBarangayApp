"use client";

import Link from "next/link";
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
import { createClient } from "@/utils/supabase/client";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Page() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "success" | "error" | null
  >(null);
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [purpose, setPurpose] = useState("");
  const [businessName, setBusinessName] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not logged in");
      setSubmissionStatus("error");
      setIsSubmitting(false);
      return;
    }
    const { data, error } = await supabase.from("requests").insert([
      {
        firstName,
        middleInitial,
        lastName,
        age,
        address,
        purpose,
        business_name: businessName,
        type: "Barangay Business Clearance",
        status: "pending",
        user_id: user.id,
      },
    ]);
    if (error) {
      console.error("Error inserting data:", error);
      setSubmissionStatus("error");
      setIsSubmitting(false);
      return;
    }
    console.log("Form submitted!", data);
    setSubmissionStatus("success");
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Request Submitted"
          description="Your request for a Barangay Clearance has been received."
        />
        <AlertDialog open={isSubmitted}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Success!</AlertDialogTitle>
              <AlertDialogDescription>
                Your request has been submitted successfully. You can track its
                status on the{" "}
                <Link
                  href="/user/my-requests"
                  className="font-medium text-primary underline"
                >
                  My Requests
                </Link>{" "}
                page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <Link href="/user/my-requests">Go to My Requests</Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Barangay Business Clearance"
        description="Request a barangay business clearance online."
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
            {submissionStatus === "error" && (
              <AlertDialog>
                <AlertDialogTitle>Error</AlertDialogTitle>
                <AlertDialogDescription>
                  There was an error submitting your request. Please try again.
                </AlertDialogDescription>
              </AlertDialog>
            )}
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="e.g., Juan's Sari-Sari Store"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Juan"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleInitial">Middle Initial</Label>
                <Input
                  id="middleInitial"
                  placeholder="D"
                  maxLength={2}
                  value={middleInitial}
                  onChange={(e) => setMiddleInitial(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Dela Cruz"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="30"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  placeholder="Block 1, Lot 2, Sector 3"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                placeholder="e.g., For Local Employment"
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
