import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = localStorage.getItem('token') ? '/feed' : '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050508',
            color: '#f8fafc',
            padding: '24px',
            textAlign: 'center',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <div
            style={{
              maxWidth: '460px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '36px 28px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                fontSize: '24px'
              }}
            >
              ✦
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>
              Oops! Something went wrong
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
              A temporary display error occurred while rendering the page. Click below to refresh your feed.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '13px 24px',
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
              }}
            >
              Reload LuminaVibe
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

