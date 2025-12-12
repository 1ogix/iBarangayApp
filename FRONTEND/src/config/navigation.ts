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
  { title: "Appointments", href: "/user/appointments" },
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
    ],
  },
  { title: "Residents & Households", href: "/admin/residents-households" },
  { title: "Blotter & Mediation", href: "/admin/blotter-mediation" },
  {
    title: "Health Center",
    items: [
      {
        title: "Appointments & Queue",
        href: "/admin/health-center/appointments",
      },
      { title: "Audit Trails", href: "/admin/health-center/audit-trails" },
    ],
  },
  { title: "Announcements & Broadcast", href: "/admin/announcements" },
  {
    title: "Settings",
    items: [
      { title: "Roles & Access", href: "/admin/settings/roles-access" },
    ],
  },
  { title: "Sign Out", href: "/user/sign-out" },
];
