"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generateBarangayClearancePdf } from "@/app/actions/generate-pdf"; // Adjust path
import { PageHeader } from "@/components/layouts/page-header";
import { createClient } from "@/lib/supabase/client";

export default function MyRequestsPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchRequests = async () => {
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
        } else {
          setRequests(data);
        }
      }
      setIsLoading(false);
    };

    fetchRequests();
  }, []);

  const handleDownload = async (request: any) => {
    setIsDownloading(true);
    try {
      const clearanceData = {
        ...request,
        municipality: "Cebu",
        province: "Cebu",
        city: "Cebu City",
        dateIssued: new Date().toLocaleDateString(),
        punongBarangay: "ENGR LAURON",
        barangaySecretary: "MAM BUHAWE",
        refNo: `BC-${new Date().getFullYear()}-${request.id}`,
      };
      const response = await generateBarangayClearancePdf(clearanceData);

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
      a.download = `BarangayClearance-${request.lastName}.pdf`; // Set filename
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
