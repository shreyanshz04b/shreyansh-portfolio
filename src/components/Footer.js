import React from "react";
import "./Footer.css";

function Footer() {
  const socialLinks = [
    {
      href: "https://github.com/shreyanshz04b",
      label: "GitHub",
    },
    {
      href: "https://linkedin.com/in/shreyanshagarwalceo",
      label: "LinkedIn",
    },
    {
      href: "mailto:shreyansh.agarwal.dev@gmail.com",
      label: "Email",
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-top">
          <div className="footer-brand">
            <h3>Shreyansh Agarwal</h3>
            <p>Full Stack Developer • AI Enthusiast • Cyber Security</p>
          </div>

          <div className="footer-links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Shreyansh Agarwal. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;
