"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  generateBarangayClearancePdf,
  generateBusinessClearancePdf,
  generateCertificateOfIndigencyPdf,
  generateCertificateOfResidencyPdf,
  generateGoodMoralCharacterPdf,
} from "@/app/actions/generate-pdf";
import { PageHeader } from "@/components/layouts/page-header";
import { createClient } from "@/utils/supabase/client";

export default function MyRequestsPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const supabase = createClient();

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", user.id);
      if (error) {
        console.error("Error fetching requests:", error);
      } else if (data) {
        setRequests(data);
      }
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleDownload = async (request: any) => {
    setIsDownloading(true);
    try {
      const refPrefix =
        request.type === "Certificate of Indigency"
          ? "COI"
          : request.type === "Barangay Business Clearance"
          ? "BIZ"
          : request.type === "Certificate of Residency"
          ? "COR"
          : request.type === "Certificate of Good Moral Character"
          ? "COM"
          : "BC";

      const baseData = {
        firstName: request.firstName,
        middleInitial: request.middleInitial,
        lastName: request.lastName,
        age: request.age,
        address: request.address,
        municipality: "Cebu",
        province: "Cebu",
        city: "Cebu City",
        barangay: request.barangay ?? "Busay",
        dateIssued: new Date().toLocaleDateString(),
        punongBarangay: "ENGR LAURON",
        barangaySecretary: "MAM BUHAWE",
        refNo: `${refPrefix}-${new Date().getFullYear()}-${request.id}`,
        characterReference: request.character_reference,
        purpose: request.purpose,
      };

      let response;
      let filename = `BarangayClearance-${request.lastName}.pdf`;

      if (request.type === "Barangay Business Clearance") {
        response = await generateBusinessClearancePdf({
          ...baseData,
          businessName: request.business_name ?? request.businessName ?? "N/A",
        });
        filename = `BusinessClearance-${
          request.business_name || request.lastName
        }.pdf`;
      } else if (request.type === "Certificate of Indigency") {
        response = await generateCertificateOfIndigencyPdf({
          ...baseData,
          purpose: request.purpose ?? "N/A",
        });
        filename = `CertificateOfIndigency-${request.lastName}.pdf`;
      } else if (request.type === "Certificate of Residency") {
        response = await generateCertificateOfResidencyPdf({
          ...baseData,
          residencyDuration:
            request.residency_duration ?? request.residencyDuration ?? "N/A",
        });
        filename = `CertificateOfResidency-${request.lastName}.pdf`;
      } else if (request.type === "Certificate of Good Moral Character") {
        response = await generateGoodMoralCharacterPdf({
          ...baseData,
          characterReference:
            request.character_reference ?? request.characterReference ?? "N/A",
        });
        filename = `GoodMoralCharacter-${request.lastName}.pdf`;
      } else {
        response = await generateBarangayClearancePdf(baseData);
      }

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
      a.download = filename;
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

  const handleDelete = async (requestId: string) => {
    // Optional: Add a confirmation dialog to prevent accidental deletion
    if (
      !window.confirm("Are you sure you want to delete this rejected request?")
    ) {
      return;
    }

    setIsDeleting(requestId);
    try {
      const { error } = await supabase
        .from("requests")
        .delete()
        .eq("id", requestId);

      if (error) {
        console.error("Error deleting request:", error);
        alert("Failed to delete the request. Please try again.");
      } else {
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req.id !== requestId)
        );
      }
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Requests"
        description="Track statuses, pickup schedules, and required actions."
      />

      {isLoading ? (
        <p>Loading requests...</p>
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-lg border bg-background/60 p-6"
            >
              <h3 className="font-semibold">{request.type}</h3>
              <p className="text-sm text-muted-foreground">
                Status:{" "}
                <span
                  className={`${
                    request.status === "approved"
                      ? "text-green-600"
                      : request.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  } font-medium`}
                >
                  {request.status}
                </span>
              </p>
              {request.status === "approved" && (
                <Button
                  onClick={() => handleDownload(request)}
                  disabled={isDownloading}
                  className="mt-4"
                >
                  {isDownloading ? "Generating..." : "Download PDF"}
                </Button>
              )}
              {request.status === "rejected" && (
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(request.id)}
                  disabled={isDeleting === request.id}
                  className="mt-4"
                >
                  {isDeleting === request.id ? "Deleting..." : "Delete Request"}
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>You have no requests.</p>
      )}
    </div>
  );
}
