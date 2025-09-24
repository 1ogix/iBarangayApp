import { PortalShell } from "@/components/layouts/portal-shell";
import { adminNavigation } from "@/config/navigation";

export default function AdminPortalLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <PortalShell sections={adminNavigation}>{children}</PortalShell>;
}
