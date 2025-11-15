"use server";

import qrcode from "qrcode";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { BarangayClearanceDoc } from "@/components/pdf/barangay-clearance-doc";
import { BusinessClearanceDoc } from "@/components/pdf/business-clearance-doc";
import { CertificateOfIndigencyDoc } from "@/components/pdf/certificate-of-indigency-doc";
import { CertificateOfResidencyDoc } from "@/components/pdf/certificate-of-residency-doc";
import { GoodMoralCharacterDoc } from "@/components/pdf/good-moral-character-doc";

interface BaseClearanceData {
  firstName: string;
  middleInitial: string;
  lastName: string;
  age: string;
  address: string;
  municipality: string;
  province: string;
  city: string;
  dateIssued: string;
  punongBarangay: string;
  barangaySecretary: string;
  refNo: string;
  barangay?: string;
  signatureUrl?: string;
}

interface BusinessClearanceData extends BaseClearanceData {
  businessName: string;
}

interface CertificateOfIndigencyData extends BaseClearanceData {
  purpose: string;
}

interface CertificateOfResidencyData extends BaseClearanceData {
  residencyDuration: string;
}

interface GoodMoralCharacterData extends BaseClearanceData {
  purpose: string;
  characterReference: string;
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

async function generatePdf(
  component: React.ComponentType<any>,
  data:
    | BaseClearanceData
    | BusinessClearanceData
    | CertificateOfIndigencyData
    | CertificateOfResidencyData
    | GoodMoralCharacterData
) {
  try {
    const qrCodeUrl = await qrcode.toDataURL(data.refNo, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 80,
    });

    const stream = await renderToStream(
      React.createElement(component, {
        ...data,
        qrCodeUrl,
      })
    );

    const buffer = await streamToBuffer(stream);
    return { base64: buffer.toString("base64") };
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred." };
  }
}

export async function generateBarangayClearancePdf(data: BaseClearanceData) {
  return generatePdf(BarangayClearanceDoc, data);
}

export async function generateBusinessClearancePdf(
  data: BusinessClearanceData
) {
  return generatePdf(BusinessClearanceDoc, data);
}

export async function generateCertificateOfIndigencyPdf(
  data: CertificateOfIndigencyData
) {
  return generatePdf(CertificateOfIndigencyDoc, data);
}

export async function generateCertificateOfResidencyPdf(
  data: CertificateOfResidencyData
) {
  return generatePdf(CertificateOfResidencyDoc, data);
}

export async function generateGoodMoralCharacterPdf(
  data: GoodMoralCharacterData
) {
  return generatePdf(GoodMoralCharacterDoc, data);
}
