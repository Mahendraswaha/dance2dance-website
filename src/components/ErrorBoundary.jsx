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

  componentDidMount() {
    // If an error is caught, we wait 500ms before showing the UI
    // This allows automatic window.location.reload() to execute without flashing a DOS-like screen.
    if (this.state.hasError) {
      this.timeout = setTimeout(() => this.setState({ showUI: true }), 500);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hasError && !prevState.hasError) {
      this.timeout = setTimeout(() => this.setState({ showUI: true }), 500);
    }
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  render() {
    if (this.state.hasError) {
      if (!this.state.showUI) return null; // Wait for timeout
      return (
        <div style={{ padding: '2rem', backgroundColor: '#0A0A0E', color: 'white', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#ff6b6b' }}>Erro Inesperado</h1>
          <p>Tire um print desta tela e mande para o suporte:</p>
          <pre style={{ backgroundColor: 'black', padding: '1rem', overflow: 'auto', border: '1px solid #ff6b6b' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '1rem', backgroundColor: 'white', color: 'black', marginTop: '1rem' }}>
            Recarregar Pagina
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
