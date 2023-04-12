import "./Footer.scss";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer">
      Made with care, just like grandmothers prepare food 🥗 for their
      grandchildren
      <br />
      <strong> Adriano Interaminense © {currentYear}</strong>
    </div>
  );
}
