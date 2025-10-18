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
  // barangay: string;
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

// Helper function to convert a stream to a buffer on the server
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export async function generateBarangayClearancePdf(
  data: ClearanceData
): Promise<{
  base64?: string;
  error?: string;
}> {
  try {
    // 1. Generate QR Code from the reference number
    const qrCodeUrl = await qrcode.toDataURL(data.refNo, {
      errorCorrectionLevel: "H", // High error correction
      margin: 2,
      width: 80,
    });

    // 2. Prepare props for the document component
    const docProps = {
      ...data,
      dateIssued: data.dateIssued,
      qrCodeUrl: qrCodeUrl,
    };

    // 3. Render the React component to a stream
    const stream = await renderToStream(
      React.createElement(
        BarangayClearanceDoc as React.ComponentType<any>,
        docProps
      )
    );

    // 4. Convert the stream to a buffer on the server
    const buffer = await streamToBuffer(stream);

    // 5. Convert the buffer to a Base64 string and return it
    return { base64: buffer.toString("base64") };
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred." };
  }
}
