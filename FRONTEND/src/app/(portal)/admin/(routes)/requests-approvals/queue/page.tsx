"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { DataTable } from "@/components/ui/data-table";
import { columns, Request } from "@/components/requests-table";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
  const [requests, setRequests] = useState<Request[]>([]);
  const supabase = createClient();

  const fetchRequests = useCallback(async () => {
    const { data, error } = await supabase.from("requests").select("*");
    if (error) {
      console.error("Error fetching requests:", error);
      return;
    }

    if (data) {
      const formattedRequests = data.map((req: any) => ({
        id: req.id,
        name: `${req.firstName} ${req.lastName}`,
        type: req.type,
        status: req.status,
      }));
      setRequests(formattedRequests);
    }
  }, [supabase]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("requests")
      .update({ status: "approved" })
      .eq("id", id);
    if (error) {
      console.error("Error approving request:", error);
    } else {
      fetchRequests();
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("requests")
      .update({ status: "rejected" })
      .eq("id", id);
    if (error) {
      console.error("Error rejecting request:", error);
    } else {
      fetchRequests();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Requests Queue"
        description="Monitor documents awaiting review, approval, or release."
      />
      <DataTable
        columns={columns(handleApprove, handleReject)}
        data={requests}
      />
    </div>
  );
}
