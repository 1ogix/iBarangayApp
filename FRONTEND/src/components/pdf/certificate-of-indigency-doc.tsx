/* eslint-disable jsx-a11y/alt-text */
import path from "path";
import React from "react";

import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const publicDir = path.join(process.cwd(), "public");
const fontDir = path.join(publicDir, "fonts");

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
  signatureSection: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "40%",
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
    alignSelf: "flex-end",
  },
  watermark: {
    zIndex: -1,
    position: "absolute",
    top: "35%",
    left: "10%",
    width: "80%",
    height: "30%",
    opacity: 0.1,
  },
});

interface CertificateOfIndigencyProps {
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
  purpose: string;
  punongBarangay: string;
  barangaySecretary: string;
  ctcNo?: string;
  issuedAt?: string;
  issuedOn?: string;
  cityLogoUrl?: string;
  philSealUrl?: string;
  signatureUrl?: string;
  qrCodeUrl?: string;
  refNo?: string;
}

export const CertificateOfIndigencyDoc = ({
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
  purpose,
  punongBarangay,
  barangaySecretary,
  ctcNo = "__________",
  issuedAt = "__________",
  issuedOn = "__________",
  cityLogoUrl = "public/images/cebu-icon.png",
  philSealUrl = "public/images/phil_seal.png",
  signatureUrl,
  qrCodeUrl,
  refNo = "#############",
}: CertificateOfIndigencyProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image
        style={styles.watermark}
        src={"public/images/watermark-logo.png"}
        fixed
      />
      <View style={styles.headerLogos}>
        <Image style={styles.logo} src={cityLogoUrl} fixed />
        <View style={styles.headerText}>
          <Text>Republic of the Philippines</Text>
          <Text>Province of {province}</Text>
          <Text>Municipality of {municipality}</Text>
          <Text>Barangay {barangay}</Text>
        </View>
        <Image style={styles.logo} src={philSealUrl} fixed />
      </View>
      <View style={styles.header} fixed />
      <Text style={styles.title}>Certificate of Indigency</Text>
      <Text style={styles.body}>To Whom It May Concern:</Text>
      <Text style={styles.body}>
        This is to certify that{" "}
        <Text style={styles.bold}>
          {`${firstName} ${middleInitial}. ${lastName}`}
        </Text>
        , {age} years old and a bonafide resident of{" "}
        <Text style={styles.bold}>{address}</Text>, Barangay {barangay},{" "}
        {city}, is a member of an indigent family in our community.
      </Text>
      <Text style={styles.body}>
        Based on the records and verification conducted by this barangay, the
        above-named resident has limited financial capability to support
        essential needs and is currently requesting assistance for{" "}
        <Text style={styles.bold}>{purpose}</Text>.
      </Text>
      <Text style={styles.body}>
        This certificate is issued upon request of the interested party for
        whatever legal purpose it may serve. Given this {dateIssued}.
      </Text>
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
    </Page>
  </Document>
);
