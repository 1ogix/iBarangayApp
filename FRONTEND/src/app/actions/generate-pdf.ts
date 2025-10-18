"use server";

import qrcode from "qrcode";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { BarangayClearanceDoc } from "@/components/pdf/barangay-clearance-doc"; // Adjust path if needed

// Define the type for the data needed by the PDF document
// This should match or extend the props of your PDF component
interface ClearanceData {
  firstName: string;
  middleInitial: string;
  lastName: string;
  age: string;
  address: string;
  barangay: string;
  municipality: string;
  province: string;
  city: string;
  dateIssued: string;
  punongBarangay: string;
  barangaySecretary: string;
  refNo: string;
  signatureUrl?: string;
  // ... add other fields like ctcNo etc.
}

export async function generateBarangayClearancePdf(
  data: ClearanceData
): Promise<ReadableStream<Uint8Array> | null> {
  try {
    // 1. Generate QR Code from the reference number
    // We generate a Data URL which can be directly used as an image source in @react-pdf/renderer
    const qrCodeUrl = await qrcode.toDataURL(data.refNo, {
      errorCorrectionLevel: "H", // High error correction
      margin: 2,
      width: 80,
    });

    // 2. Prepare props for the document component
    const docProps = {
      ...data,
      // Use the dateIssued from the data. The client should format this.
      // If you need to format it here, ensure the input is a consistent format (e.g., ISO string).
      dateIssued: data.dateIssued,
      qrCodeUrl: qrCodeUrl,
    };

    // 3. Render the React component to a stream
    const stream = await renderToStream(
      React.createElement(BarangayClearanceDoc, docProps)
    );

    // The stream from @react-pdf/renderer is a NodeJS.ReadableStream.
    // Next.js Server Actions can return web ReadableStreams. The framework handles the conversion.
    return stream as ReadableStream<Uint8Array>;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null; // Handle error appropriately
  }
}
