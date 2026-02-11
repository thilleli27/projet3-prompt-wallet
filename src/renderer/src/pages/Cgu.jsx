import React from "react";

export default function TermsOfUse() {
  const sectionStyle = {
    marginBottom: "3rem",
  };

  const sectionTitleStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#9A48D0",
    marginBottom: "1rem",
  };

  const sectionNumberStyle = {
    display: "inline-block",
    backgroundColor: "#9A48D0",
    color: "#fff",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    textAlign: "center",
    lineHeight: "40px",
    fontWeight: 700,
    marginRight: "1rem",
    fontSize: "1.2rem",
  };

  const sectionContentStyle = {
    marginLeft: "3.5rem",
    color: "#666",
    fontSize: "1rem",
    lineHeight: 1.8,
  };

  const listItemStyle = {
    paddingLeft: "2rem",
    position: "relative",
    marginBottom: "0.75rem",
  };

  const listItemBefore = {
    content: '"✓"',
    position: "absolute",
    left: 0,
    color: "#7BC950",
    fontWeight: 700,
    fontSize: "1.2rem",
  };

  const infoBoxStyle = {
    backgroundColor: "#F0F9EC",
    border: "2px solid #7BC950",
    borderRadius: "12px",
    padding: "1.5rem",
    margin: "1.5rem 0",
  };

  const infoBoxTitleStyle = {
    fontWeight: 700,
    color: "#7BC950",
    marginBottom: "0.5rem",
    fontSize: "1.1rem",
  };

  const warningBoxStyle = {
    backgroundColor: "#FFF5F0",
    border: "2px solid #B288C0",
    borderRadius: "12px",
    padding: "1.5rem",
    margin: "1.5rem 0",
  };

  const warningBoxTitleStyle = {
    fontWeight: 700,
    color: "#9A48D0",
    marginBottom: "0.5rem",
    fontSize: "1.1rem",
  };

  const highlightBoxStyle = {
    backgroundColor: "#F0F0FF",
    borderLeft: "4px solid #9A48D0",
    padding: "1.5rem",
    borderRadius: "8px",
    margin: "1.5rem 0",
  };

  const contactSectionStyle = {
    backgroundColor: "#9A48D0",
    color: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    marginTop: "3rem",
    textAlign: "center",
  };

  const contactLinkStyle = {
    color: "#fff",
    textDecoration: "underline",
    fontWeight: 600,
  };

  const containerStyle = {
    maxWidth: "900px",
    margin: "2rem auto",
    padding: "2rem",
    fontFamily: "'Montserrat', sans-serif",
    lineHeight: 1.6,
    color: "#333",
    backgroundColor: "#F5F5F5",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    border: "2px solid #B288C0",
    borderRadius: "16px",
    padding: "2.5rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#9A48D0", marginBottom: "0.5rem" }}>
          Terms of Use
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>Prompt Wallet</p>
        <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Last updated: January 22, 2025
        </p>
      </div>

      {/* Card CGU */}
      <div style={cardStyle}>
        {/* Section 1 */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <span style={sectionNumberStyle}>1</span>Features
          </h2>
          <div style={sectionContentStyle}>
            <p>
              <strong>Prompt Wallet</strong> is a free tool allowing developers to organize
              and manage a personal library of prompts for language models (LLMs) such as ChatGPT, Claude.ai, Mistral Chat, and others.
            </p>
            <p>The application offers the following features:</p>
            <ul>
              {[
                "Create and save prompts: Create custom prompts and save them locally in your browser",
                "Edit and modify: Modify your existing prompts at any time",
                "Dynamic variables: Use the {{variable}} syntax to create reusable prompts",
                "Organize with tags: Classify your prompts with tags for better organization",
                "Search and filter: Quickly find your prompts with the search system",
                "Quick copy: Copy your customized prompts to clipboard with one click",
              ].map((text, idx) => (
                <li key={idx} style={{ ...listItemStyle, listStyleType: "none" }}>
                  <span style={{ color: "#7BC950", fontWeight: 700, marginRight: "0.5rem" }}>✓</span>
                  {text}
                </li>
              ))}
            </ul>

            <div style={infoBoxStyle}>
              <p style={infoBoxTitleStyle}>💡 Recommended use</p>
              <p>
                Prompt Wallet is designed to optimize your productivity with LLMs.
                Create reusable templates for your recurring tasks and save valuable time.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <span style={sectionNumberStyle}>2</span>Legal Framework for Data Management
          </h2>
          <div style={sectionContentStyle}>
            <p>
              Protecting your personal data is a priority for Prompt Wallet.
              We are committed to complying with the General Data Protection Regulation (GDPR)
              and all applicable data protection legislation.
            </p>

            <h3 style={{ color: "#9A48D0", fontSize: "1.2rem", marginTop: "2rem", marginBottom: "1rem" }}>
              2.1 Local Data Storage
            </h3>
            <p>
              <strong>Your prompts are stored locally</strong> in your browser using LocalStorage technology. This means:
            </p>
            <ul>
              {["Your data stays on your device", "We have no access to your personal prompts", "No cloud synchronization is performed without your explicit consent", "You maintain full control of your data"].map((item, idx) => (
                <li key={idx} style={{ ...listItemStyle, listStyleType: "none" }}>
                  <span style={{ color: "#7BC950", fontWeight: 700, marginRight: "0.5rem" }}>✓</span>{item}
                </li>
              ))}
            </ul>

            <div style={warningBoxStyle}>
              <p style={warningBoxTitleStyle}>⚠️ Important</p>
              <p>
                Local storage means your data is tied to your browser.
                If you clear browsing data or change browsers, your prompts will be lost.
                We recommend regularly exporting your important prompts.
              </p>
            </div>

            <h3 style={{ color: "#9A48D0", fontSize: "1.2rem", marginTop: "2rem", marginBottom: "1rem" }}>
              2.2 Collection of Anonymized Data
            </h3>
            <p>
              To improve our service and fund the application's development,
              we collect <strong>anonymized and aggregated usage data</strong>:
            </p>
            <ul>
              {["General usage statistics (number of prompts created, features used)", "Anonymous technical data (browser type, operating system)", "Aggregated usage trends (popular prompt categories)"].map((item, idx) => (
                <li key={idx} style={{ ...listItemStyle, listStyleType: "none" }}>
                  <span style={{ color: "#7BC950", fontWeight: 700, marginRight: "0.5rem" }}>✓</span>{item}
                </li>
              ))}
            </ul>

            <p>This data is <strong>completely anonymous</strong> and cannot be used to identify you personally. It helps us understand how to improve the application.</p>

            <h3 style={{ color: "#9A48D0", fontSize: "1.2rem", marginTop: "2rem", marginBottom: "1rem" }}>
              2.3 Business Model and Data Resale
            </h3>
            <p>
              Prompt Wallet's business model is based on the <strong>resale of qualified and anonymized data</strong> to IT sector companies. This data includes:
            </p>
            <ul>
              {["LLM usage trends", "Most used prompt types (without content)", "Feature adoption statistics", "Insights on developer needs"].map((item, idx) => (
                <li key={idx} style={{ ...listItemStyle, listStyleType: "none" }}>
                  <span style={{ color: "#7BC950", fontWeight: 700, marginRight: "0.5rem" }}>✓</span>{item}
                </li>
              ))}
            </ul>

            <div style={highlightBoxStyle}>
              <p>
                <strong>Privacy guarantee:</strong> The data we resell is strictly anonymized and aggregated. The content of your personal prompts is never shared, sold, or transmitted to third parties.
              </p>
            </div>

            {/* Sections 2.4 to 2.6 */}
            <h3 style={{ color: "#9A48D0", fontSize: "1.2rem", marginTop: "2rem", marginBottom: "1rem" }}>2.4 Your GDPR Rights</h3>
            <ul>
              {["Right of access: You can request what data we hold about you", "Right of rectification: You can request correction of inaccurate data", "Right to erasure: You can request deletion of your data", "Right to object: You can object to processing of your data", "Right to portability: You can request a copy of your data"].map((item, idx) => (
                <li key={idx} style={{ ...listItemStyle, listStyleType: "none" }}>
                  <span style={{ color: "#7BC950", fontWeight: 700, marginRight: "0.5rem" }}>✓</span>{item}
                </li>
              ))}
            </ul>
            <p>
              To exercise these rights, contact us at:{" "}
              <a href="mailto:gdpr@promptwallet.com" style={{ color: "#9A48D0", textDecoration: "underline" }}>gdpr@promptwallet.com</a>
            </p>

            <h3 style={{ color: "#9A48D0", fontSize: "1.2rem", marginTop: "2rem", marginBottom: "1rem" }}>2.5 Data Security</h3>
            <ul>
              {["Encrypted communications (HTTPS)", "Secure storage in your browser", "No unauthorized data transmission", "Regular security audits"].map((item, idx) => (
                <li key={idx} style={{ ...listItemStyle, listStyleType: "none" }}>
                  <span style={{ color: "#7BC950", fontWeight: 700, marginRight: "0.5rem" }}>✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <span style={sectionNumberStyle}>3</span>Responsibilities and Limitations
          </h2>
          <div style={sectionContentStyle}>
            <p><strong>User responsibility:</strong> You are responsible for the content of the prompts you create and store. Prompt Wallet cannot be held responsible for the use made of generated prompts.</p>
            <p><strong>Free service:</strong> Prompt Wallet is provided "as is" without warranty of any kind. We strive to maintain service availability but cannot guarantee 100% uptime.</p>
            <p><strong>Intellectual property:</strong> The prompts you create belong to you. You retain all rights to your content.</p>
          </div>
        </div>

        {/* Section 4 */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <span style={sectionNumberStyle}>4</span>Terms of Use Modifications
          </h2>
          <div style={sectionContentStyle}>
            <p>We reserve the right to modify these Terms of Use at any time. Users will be informed of significant changes through in-app notification or by email.</p>
            <p>Continued use of Prompt Wallet after Terms of Use modifications constitutes your acceptance of the new terms.</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div style={contactSectionStyle}>
        <h3>Questions about our Terms of Use?</h3>
        <p>Our team is available to answer all your questions regarding our terms of use and data management.</p>
        <p>
          <strong>Email:</strong> <a href="mailto:contact@promptwallet.com" style={contactLinkStyle}>contact@promptwallet.com</a><br/>
          <strong>GDPR:</strong> <a href="mailto:gdpr@promptwallet.com" style={contactLinkStyle}>gdpr@promptwallet.com</a>
        </p>
      </div>
    </div>
  );
}
