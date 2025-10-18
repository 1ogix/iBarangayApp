// src/components/pdf/barangay-clearance-doc.tsx
"use client"; // Required if you might render this on the client for preview, but generation will be server-side

// import React from "react";
import React from "react";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image as PdfImage,
  Font,
} from "@react-pdf/renderer";

// Register custom fonts. This is crucial for bold/italic styles to work.
// We are using Poppins as the main font.
Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.ttf",
      fontWeight: "bold",
    },
  ],
});

// We can also register other fonts like Inter if needed for other sections.
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf",
      // Note: The regular and bold URLs for Inter can be the same for some CDNs;
      // @react-pdf/renderer will handle the weighting if the font file supports it.
      // For simplicity and reliability, we can point both to the main file.
      fontWeight: "bold",
    },
  ],
});

// Define styles using StyleSheet
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Poppins",
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 10,
  },
  headerLogos: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerText: {
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  body: {
    marginBottom: 20,
    textAlign: "justify",
  },
  bold: {
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "40%", // Adjust as needed
    alignItems: "center",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    width: "80%",
    marginTop: 40,
    marginBottom: 5,
  },
  qrCode: {
    width: 80,
    height: 80,
    alignSelf: "flex-end", // Position QR code
  },
  watermark: {
    position: "absolute",
    top: "40%",
    left: "25%",
    opacity: 0.1, // Make it faint
    fontSize: 60,
    transform: "rotate(-45deg)", // Rotate the watermark
  },
});

// Define the structure of your document
interface BarangayClearanceProps {
  firstName: string;
  middleInitial: string;
  lastName: string;
  age: string; // Or number
  address: string; // Combine Block, Lot, Sector here or pass separately
  barangay: string;
  municipality: string;
  province: string;
  city: string;
  dateIssued: string; // Format like "17th day of April 2021"
  punongBarangay: string;
  barangaySecretary: string;
  ctcNo?: string;
  issuedAt?: string;
  issuedOn?: string;
  cityLogoUrl?: string;
  philSealUrl?: string;
  signatureUrl?: string; // URL from Supabase Storage
  qrCodeUrl?: string; // URL or data URI for the QR code image
  refNo?: string;
}

export const BarangayClearanceDoc = ({
  firstName,
  middleInitial,
  lastName,
  age,
  address,
  barangay,
  municipality,
  province,
  city,
  dateIssued,
  punongBarangay,
  barangaySecretary,
  ctcNo = "__________",
  issuedAt = "__________",
  issuedOn = "__________",
  // Using static, publicly available URLs as placeholders.
  cityLogoUrl = "https://upload.wikimedia.org/wikipedia/en/e/e0/Tarlac_City_Seal.png",
  // Use a direct PNG link. SVGs are not reliably supported by @react-pdf/renderer.
  philSealUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Seal_of_the_Philippines.svg/1024px-Seal_of_the_Philippines.svg.png",
  signatureUrl, // TODO: Pass this from form submission/database
  qrCodeUrl, // TODO: Generate this and pass it
  refNo = "#############",
}: BarangayClearanceProps) => {
  // Using a standard function body with a return statement can help with TSX type inference issues.
  // The errors you saw are often related to this.
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>BrgyGo</Text>
        {/* Header */}
        <View style={styles.headerLogos}>
          {cityLogoUrl && <PdfImage style={styles.logo} src={cityLogoUrl} />}
          <View style={styles.headerText}>
            <Text>Republic of the Philippines</Text>
            <Text>Province of {province}</Text>
            <Text>Municipality of {municipality}</Text>
            <Text>Barangay {barangay}</Text>
          </View>
          {philSealUrl && <PdfImage style={styles.logo} src={philSealUrl} />}
        </View>
        <View style={styles.header} fixed /> {/* Horizontal Line */}
        {/* Title */}
        <Text style={styles.title}>Barangay Clearance</Text>
        {/* Body */}
        <Text style={styles.body}>To Whom It May Concern:</Text>
        <Text style={styles.body}>
          This is to Certify that{" "}
          <Text style={styles.bold}>
            {`${firstName} ${middleInitial}. ${lastName}`}
          </Text>
          , <Text style={styles.bold}>{age}</Text> years old, whose postal
          address is at <Text style={styles.bold}>{address}</Text>, is presently
          residing at Barangay {barangay}, {city}.
        </Text>
        <Text style={styles.body}>
          Further Certifies that herein grantee has no derogatory record and has
          a good moral character as per our Barangay Record is Concerned.
        </Text>
        <Text style={styles.body}>
          This <Text style={styles.bold}>BARANGAY CERTIFICATION</Text> has been
          issued upon request of the above mentioned person, for whatever legal
          purposes it may serve.
        </Text>
        <Text style={styles.body}>Given this {dateIssued}.</Text>
        {/* Signature Area */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            {signatureUrl && (
              <PdfImage
                src={signatureUrl}
                style={{
                  position: "absolute",
                  bottom: 15,
                  width: 100,
                  height: 50,
                }}
              />
            )}
            <View style={styles.signatureLine} />
            <Text>Bearer Signature</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.bold}>Hon. {punongBarangay}</Text>
            <Text>Punong Barangay</Text>
          </View>
        </View>
        {/* Footer Details */}
        <View
          style={{
            marginTop: 40,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View>
            <Text>CTCT No.: {ctcNo}</Text>
            <Text>ISSUED at: {issuedAt}</Text>
            <Text>ISSUED on: {issuedOn}</Text>
            {/* Add Thumbprint boxes if needed */}
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>Issued By:</Text>
            <Text style={[styles.bold, { marginTop: 20 }]}>
              Sec. {barangaySecretary}
            </Text>
            <Text>Barangay Secretary</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            {qrCodeUrl && <PdfImage style={styles.qrCode} src={qrCodeUrl} />}
            <Text style={{ fontSize: 8 }}>REF#: {refNo}</Text>
          </View>
        </View>
        {/* Footer can be added if needed, e.g., for page numbers */}
        {/* <View style={styles.footer} fixed>
           <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
         </View> */}
      </Page>
    </Document>
  );
};
