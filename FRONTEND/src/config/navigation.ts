export type NavSection = {
  title: string;
  href?: string;
  items?: NavSection[];
  badge?: string;
};

export const userNavigation: NavSection[] = [
  { title: "Dashboard", href: "/user/dashboard" },
  {
    title: "Apply",
    items: [
      { title: "Barangay Clearance", href: "/user/apply/barangay-clearance" },
      {
        title: "Certificate of Residency",
        href: "/user/apply/certificate-of-residency",
      },
      {
        title: "Certificate of Indigency",
        href: "/user/apply/certificate-of-indigency",
      },
      {
        title: "Good Moral Character",
        href: "/user/apply/good-moral-character",
      },
      {
        title: "Barangay Business Clearance",
        href: "/user/apply/barangay-business-clearance",
      },
    ],
  },
  { title: "My Requests", href: "/user/my-requests" },
  {
    title: "Appointments",
    items: [
      { title: "Health Center", href: "/user/appointments/health-center" },
      { title: "Barangay Office", href: "/user/appointments/barangay-office" },
    ],
  },
  { title: "Payments & Receipts", href: "/user/payments-receipts" },
  { title: "Announcements & Advisories", href: "/user/announcements" },
  { title: "Profile", href: "/user/profile" },
  { title: "Help & Support", href: "/user/help-support" },
  { title: "Settings", href: "/user/settings" },
  { title: "Sign Out", href: "/user/sign-out" },
];

export const adminNavigation: NavSection[] = [
  { title: "Overview", href: "/admin/overview" },
  {
    title: "Requests & Approvals",
    items: [
      { title: "Queue", href: "/admin/requests-approvals/queue" },
      {
        title: "Issued Documents",
        href: "/admin/requests-approvals/issued-documents",
      },
    ],
  },
  { title: "Payments & Cashiering", href: "/admin/payments-cashiering" },
  { title: "Residents & Households", href: "/admin/residents-households" },
  { title: "Business & Permits", href: "/admin/business-permits" },
  { title: "Blotter & Mediation", href: "/admin/blotter-mediation" },
  {
    title: "Health Center",
    items: [
      {
        title: "Appointments & Queue",
        href: "/admin/health-center/appointments",
      },
      { title: "Services", href: "/admin/health-center/services" },
      { title: "Basic Reports", href: "/admin/health-center/reports" },
    ],
  },
  { title: "Facilities & Inventory", href: "/admin/facilities-inventory" },
  { title: "Announcements & Broadcast", href: "/admin/announcements" },
  {
    title: "Settings",
    items: [
      { title: "Roles & Access", href: "/admin/settings/roles-access" },
      {
        title: "Document Templates",
        href: "/admin/settings/document-templates",
      },
    ],
  },
  { title: "Sign Out", href: "/user/sign-out" },
];
