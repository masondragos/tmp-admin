import PortalHeader from "@/components/portal-header";
import { UserProvider } from "@/providers/user-provider";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div>
        <PortalHeader />
        {children}
      </div>
    </UserProvider>
  );
}