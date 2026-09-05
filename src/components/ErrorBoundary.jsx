import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#330000', color: 'white', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#ff6b6b' }}>React Crashed! (Render Error)</h1>
          <p>Tire um print desta tela e mande para a IA:</p>
          <pre style={{ backgroundColor: 'black', padding: '1rem', overflow: 'auto', border: '1px solid #ff6b6b' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '1rem', backgroundColor: 'white', color: 'black', marginTop: '1rem' }}>
            Recarregar Página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
