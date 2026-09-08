export default function MedicalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Marker only — flips the shared --accent token to the medical
          palette site-wide via the `body:has()` rule in globals.css. */}
      <div className="contents" data-division="medical" />
      {children}
    </>
  );
}
