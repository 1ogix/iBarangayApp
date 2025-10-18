"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generateBarangayClearancePdf } from "@/app/actions/generate-pdf"; // Adjust path
import { PageHeader } from "@/components/layouts/page-header";
import { BarangayClearanceDoc } from "@/components/pdf/barangay-clearance-doc";

// This is a mock of what you might fetch from Supabase for an approved request.
// In a real scenario, you would fetch this data in useEffect or via a server component.
const mockApprovedRequest = {
  id: "req-123",
  documentType: "Barangay Clearance",
  status: "Approved",
  // Data needed for the PDF
  firstName: "Juan",
  middleInitial: "D",
  lastName: "Dela Cruz",
  age: "30",
  address: "Block 1, Lot 2, Sector 3",
  // barangay: "", // Fetch dynamically
  municipality: "Tarlac", // Add this field
  province: "Tarlac", // Add this field
  city: "Tarlac City", // Fetch dynamically
  dateIssued: "April 20, 2024", // This should be the approval date from your DB
  punongBarangay: "MARIA SANTOS", // Fetch from barangay settings
  barangaySecretary: "JOSE RIZAL", // Fetch from barangay settings
  refNo: "BC-2024-04-12345",
  // IMPORTANT: Ensure this URL is publicly accessible or a signed URL if your bucket is private.
  // For this example, we'll leave it undefined to show the PDF still generates without it.
  signatureUrl: undefined,
};

export default function MyRequestsPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await generateBarangayClearancePdf(mockApprovedRequest);

      if (response.error) {
        alert(`Failed to generate PDF: ${response.error}`);
        return;
      }

      if (!response.base64) {
        alert("Failed to generate PDF: No data received.");
        return;
      }

      // Decode the Base64 string to binary data
      const binaryString = atob(response.base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create a Blob from the binary data
      const blob = new Blob([bytes], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `BarangayClearance-${mockApprovedRequest.lastName}.pdf`; // Set filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error("Download error:", error);
      alert("An error occurred during download.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Requests"
        description="Track statuses, pickup schedules, and required actions."
      />

      {/* This would be a list of requests. We're showing one for demonstration. */}
      <div className="rounded-lg border bg-background/60 p-6">
        <h3 className="font-semibold">Barangay Clearance Request</h3>
        <p className="text-sm text-muted-foreground">
          Status:{" "}
          <span className="text-green-600 font-medium">
            {mockApprovedRequest.status}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Reference #: {mockApprovedRequest.refNo}
        </p>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="mt-4"
        >
          {isDownloading ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
}
