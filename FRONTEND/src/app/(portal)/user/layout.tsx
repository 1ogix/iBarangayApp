import { PortalShell } from "@/components/layouts/portal-shell";
import { userNavigation } from "@/config/navigation";

export default function UserPortalLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <PortalShell sections={userNavigation}>{children}</PortalShell>;
}
