// Root admin layout — intentionally minimal.
// The login page lives directly under /admin/login and must render
// WITHOUT the sidebar or any auth check.
// All protected pages live under /admin/(protected)/ and have their own layout.

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
