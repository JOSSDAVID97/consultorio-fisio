export const metadata = {
  title: "Fisio-TRQ Admin",
  manifest: "/manifest-admin.json",
  themeColor: "#047857",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fisio Admin",
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}