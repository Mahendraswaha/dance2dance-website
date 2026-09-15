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
    
    // Automatically reload the page if it's a chunk loading error (Vite deploy issue)
    const errString = error?.message?.toLowerCase() || '';
    if (errString.includes('chunk') || errString.includes('dynamically imported module') || errString.includes('fetch')) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      // Se for erro de chunk, a pagina sera recarregada automaticamente. 
      // Se for outro erro, exibe a tela.
      const errString = this.state.error?.message?.toLowerCase() || '';
      if (errString.includes('chunk') || errString.includes('dynamically imported module') || errString.includes('fetch')) {
        return (
          <div style={{ minHeight: '100vh', backgroundColor: '#0D0D12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(204, 88, 51, 0.2)', borderTopColor: '#CC5833', animation: 'spin 1s linear infinite' }}></div>
          </div>
        );
      }

      return (
        <div style={{ padding: '2rem', backgroundColor: '#330000', color: 'white', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#ff6b6b' }}>React Crashed! (Render Error)</h1>
          <p>Tire um print desta tela e mande para o desenvolvedor:</p>
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
