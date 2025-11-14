// src/components/pdf/barangay-clearance-doc.tsx
import path from "path";
import React from "react";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Construct absolute paths to assets
const publicDir = path.join(process.cwd(), "public");
const fontDir = path.join(publicDir, "fonts");

// Register custom fonts from local files to ensure they work on the server.
Font.register({
  family: "Poppins",
  fonts: [
    {
      src: path.join(fontDir, "Poppins-Regular.otf"),
    },
    {
      src: path.join(fontDir, "Poppins-Bold.otf"),
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
    zIndex: -1,
    position: "absolute",
    top: "35%",
    left: "10%",
    width: "80%",
    height: "30%",
    opacity: 0.1,
    // transform: "rotate(-30deg)",
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
  barangay = "Brgy Busay",
  municipality,
  province,
  city,
  dateIssued,
  punongBarangay,
  barangaySecretary,
  ctcNo = "__________",
  issuedAt = "__________",
  issuedOn = "__________",
  cityLogoUrl = "public/images/cebu-icon.png",
  philSealUrl = "public/images/phil_seal.png",
  signatureUrl, // TODO: Pass this from form submission/database
  qrCodeUrl, // TODO: Generate this and pass it
  refNo = "#############",
}: BarangayClearanceProps) => {
  // Using a standard function body with a return statement can help with TSX type inference issues.
  // The errors you saw are often related to this.
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark: Apply the watermark style to the Image component */}
        <Image
          style={styles.watermark}
          src={"public/images/watermark-logo.png"}
          fixed
        />
        {/* Header */}
        <View style={styles.headerLogos}>
          {/* {cityLogoUrl && <Image style={styles.logo} src={cityLogoUrl} />} */}
          <Image style={styles.logo} src={cityLogoUrl} fixed />
          <View style={styles.headerText}>
            <Text>Republic of the Philippines</Text>
            <Text>Province of {province}</Text>
            <Text>Municipality of {municipality}</Text>
            <Text>Barangay {barangay}</Text>
          </View>
          {/* {philSealUrl && <Image style={styles.logo} src={philSealUrl} />} */}
          <Image style={styles.logo} src={philSealUrl} fixed />
        </View>
        <View style={styles.header} fixed /> {/* Horizontal Line */}
        {/* Title */}
        <Text style={styles.title}>Barangay Clearancee</Text>
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
              <Image
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
            {qrCodeUrl && <Image style={styles.qrCode} src={qrCodeUrl} />}
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
