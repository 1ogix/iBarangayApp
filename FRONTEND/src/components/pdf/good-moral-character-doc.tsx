/* eslint-disable jsx-a11y/alt-text */
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

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

Font.register({
  family: "Poppins",
  fonts: [
    {
      src: `${baseUrl}/fonts/Poppins-Regular.otf`,
    },
    {
      src: `${baseUrl}/fonts/Poppins-Bold.otf`,
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

interface GoodMoralCharacterProps {
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
  characterReference?: string;
  ctcNo?: string;
  issuedAt?: string;
  issuedOn?: string;
  cityLogoUrl?: string;
  philSealUrl?: string;
  signatureUrl?: string;
  qrCodeUrl?: string;
  refNo?: string;
}

export const GoodMoralCharacterDoc = ({
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
  characterReference,
  ctcNo = "__________",
  issuedAt = "__________",
  issuedOn = "__________",
  cityLogoUrl = "public/images/cebu-icon.png",
  philSealUrl = "public/images/phil_seal.png",
  signatureUrl,
  qrCodeUrl,
  refNo = "#############",
}: GoodMoralCharacterProps) => (
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
      <Text style={styles.title}>Certificate of Good Moral Character</Text>
      <Text style={styles.body}>To Whom It May Concern:</Text>
      <Text style={styles.body}>
        This is to certify that{" "}
        <Text style={styles.bold}>
          {`${firstName} ${middleInitial}. ${lastName}`}
        </Text>
        , {age} years old and a resident of{" "}
        <Text style={styles.bold}>{address}</Text>, Barangay {barangay},{" "}
        {city}, has been known to this barangay as a person of good moral
        standing and exemplary conduct.
      </Text>
      <Text style={styles.body}>
        Based on our records and the statements of the community, the
        aforementioned individual has consistently displayed honesty, integrity,
        and civic responsibility. This certificate is issued upon the request of
        the interested party for <Text style={styles.bold}>{purpose}</Text>.
        {characterReference && (
          <Text>
            {" "}
            Community members including{" "}
            <Text style={styles.bold}>{characterReference}</Text> attest to the
            applicant&apos;s good moral standing.
          </Text>
        )}
      </Text>
      <Text style={styles.body}>Issued this {dateIssued}.</Text>
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
