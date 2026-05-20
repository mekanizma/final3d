export const metadata = {
  title: "Admin | Final3d",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0618] text-[#faf5ff] antialiased">
      {children}
    </div>
  );
}
