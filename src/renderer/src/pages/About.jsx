import React from 'react';

const AboutPage = () => {
  const styles = {
    container: {
      fontFamily: "'Montserrat', sans-serif",
      backgroundColor: '#F5F5F5',
      minHeight: '100vh',
      padding: '2rem',
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    hero: {
      background: 'linear-gradient(135deg, #9A48D0, #B288C0)',
      color: '#FFFFFF',
      padding: '3rem 2rem',
      borderRadius: '16px',
      textAlign: 'center',
      marginBottom: '3rem',
      boxShadow: '0 4px 12px rgba(154, 72, 208, 0.3)',
    },
    heroTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '1rem',
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      opacity: '0.95',
    },
    sectionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
    },
    card: {
      backgroundColor: '#FFFFFF',
      border: '2px solid #B288C0',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s, box-shadow 0.3s',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#9A48D0',
      marginBottom: '1rem',
      borderBottom: '2px solid #B288C0',
      paddingBottom: '0.5rem',
    },
    cardContent: {
      color: '#666',
      fontSize: '1rem',
      lineHeight: '1.8',
    },
    paragraph: {
      marginBottom: '1rem',
    },
    missionSection: {
      marginBottom: '3rem',
    },
    sectionTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#9A48D0',
      textAlign: 'center',
      marginBottom: '2rem',
    },
    missionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
    },
    missionCard: {
      backgroundColor: '#FFFFFF',
      border: '2px solid #B288C0',
      borderRadius: '16px',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s',
    },
    missionIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    missionTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#9A48D0',
      marginBottom: '1rem',
    },
    missionText: {
      color: '#666',
      lineHeight: '1.8',
    },
    teamSection: {
      marginBottom: '3rem',
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
    },
    teamCard: {
      backgroundColor: '#FFFFFF',
      border: '2px solid #B288C0',
      borderRadius: '16px',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s',
    },
    teamAvatar: {
      width: '120px',
      height: '120px',
      margin: '0 auto 1.5rem',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #9A48D0, #B288C0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      color: '#FFFFFF',
      fontWeight: '700',
    },
    teamName: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#9A48D0',
      marginBottom: '0.5rem',
    },
    teamRole: {
      color: '#7BC950',
      fontWeight: '600',
      marginBottom: '1rem',
      fontSize: '1rem',
    },
    teamDesc: {
      color: '#666',
      lineHeight: '1.8',
    },
    contactSection: {
      backgroundColor: '#9A48D0',
      color: '#FFFFFF',
      borderRadius: '16px',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(154, 72, 208, 0.3)',
    },
    contactTitle: {
      fontSize: '1.5rem',
      marginBottom: '1rem',
    },
    contactText: {
      marginBottom: '1rem',
      opacity: '0.95',
    },
    contactLink: {
      color: '#FFFFFF',
      textDecoration: 'underline',
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.container}>
      <link 
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" 
        rel="stylesheet"
      />
      
      <div style={styles.wrapper}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>About Prompt Wallet</h1>
          <p style={styles.heroSubtitle}>The free tool to organize and manage your AI prompt library</p>
        </div>

        {/* Vision and Context Grid */}
        <div style={styles.sectionGrid}>
          {/* Vision Card */}
          <div 
            style={styles.card}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={styles.cardTitle}>Our Vision</h2>
            <div style={styles.cardContent}>
              <p style={styles.paragraph}>
                Prompt Wallet aims to be a free tool for developers to organize a prompt library 
                and facilitate the use of LLMs such as ChatGPT, Claude.ai, Mistral Chat, and many others.
              </p>
              <p style={styles.paragraph}>
                Our tool makes it easy to configure and save prompts locally. 
                You can edit, copy and paste prompts in Prompt Wallet, or from 
                Prompt Wallet, with complete simplicity.
              </p>
            </div>
          </div>

          {/* Development Context Card */}
          <div 
            style={styles.card}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={styles.cardTitle}>Development Context</h2>
            <div style={styles.cardContent}>
              <p style={styles.paragraph}>
                Prompt Wallet was born from the desire to create a simple and effective solution to 
                manage prompts used with language models. Faced with the proliferation 
                of AI tools and the need to maintain consistent and reusable prompts, 
                we developed this application to meet the concrete needs of developers.
              </p>
              <p style={styles.paragraph}>
                As an innovative startup, we believe in a transparent business model based 
                on the resale of qualified and anonymized data to companies working 
                in the IT sector, while offering a free and powerful tool to our community.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div style={styles.missionSection}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          
          <div style={styles.missionGrid}>
            {/* Mission Card 1 */}
            <div 
              style={styles.missionCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={styles.missionIcon}>🎯</div>
              <h3 style={styles.missionTitle}>Simplify</h3>
              <p style={styles.missionText}>
                Make LLM usage more accessible and efficient for all developers.
              </p>
            </div>

            {/* Mission Card 2 */}
            <div 
              style={styles.missionCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={styles.missionIcon}>💾</div>
              <h3 style={styles.missionTitle}>Organize</h3>
              <p style={styles.missionText}>
                Enable local and structured management of your personalized prompts.
              </p>
            </div>

            {/* Mission Card 3 */}
            <div 
              style={styles.missionCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={styles.missionIcon}>🚀</div>
              <h3 style={styles.missionTitle}>Accelerate</h3>
              <p style={styles.missionText}>
                Save time by reusing and adapting your best prompts.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div style={styles.teamSection}>
          <h2 style={styles.sectionTitle}>The Team</h2>
          
          <div style={styles.teamGrid}>
            {/* Team Member 1 */}
            <div 
              style={styles.teamCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={styles.teamAvatar}>A</div>
              <h3 style={styles.teamName}>Albertine</h3>
              <p style={styles.teamRole}>Director</p>
              <p style={styles.teamDesc}>
                Visionary and leader, she drives the strategy and development of Prompt Wallet.
              </p>
            </div>

            {/* Team Member 2 */}
            <div 
              style={styles.teamCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={styles.teamAvatar}>J</div>
              <h3 style={styles.teamName}>Joanne</h3>
              <p style={styles.teamRole}>Sales Manager</p>
              <p style={styles.teamDesc}>
                Expert in customer relations and business development in the IT sector.
              </p>
            </div>

            {/* Team Member 3 */}
            <div 
              style={styles.teamCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={styles.teamAvatar}>P</div>
              <h3 style={styles.teamName}>Prince and Lilli</h3>
              <p style={styles.teamRole}>Developers</p>
              <p style={styles.teamDesc}>
                Passionate about AI and developing innovative tools for developers.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div style={styles.contactSection}>
          <h2 style={styles.contactTitle}>Have a question? Contact us!</h2>
          <p style={styles.contactText}>
            Our team is available to answer all your questions 
            and discuss your needs.
          </p>
          <p>
            <strong>Email:</strong>{' '}
            <a 
              href="mailto:princemdiomande@gmail.com" 
              style={styles.contactLink}
            >
              princemdiomande@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;