import React from 'react';
import Button from './Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    padding: '40px',
                    background: '#050505',
                    color: '#ef4444',
                    height: '100vh',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    zIndex: 99999
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', borderBottom: '1px solid #333' }}>CRITICAL SYSTEM FAILURE</h1>
                    <div style={{ marginBottom: '2rem', color: '#fff' }}>
                        The game engine encountered a fatal error and had to stop.
                    </div>

                    <div style={{ background: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                        <h3 style={{ color: '#888', marginBottom: '10px' }}>ERROR LOG:</h3>
                        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#ef4444' }}>
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        <br />
                        <details style={{ whiteSpace: 'pre-wrap', color: '#666' }}>
                            <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>View Stack Trace</summary>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    </div>

                    <Button
                        onClick={() => window.location.reload()}
                        variant="danger"
                        style={{
                            marginTop: '20px',
                            fontWeight: 'bold'
                        }}
                    >
                        REBOOT SYSTEM
                    </Button>

                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(`${this.state.error}\n${this.state.errorInfo?.componentStack}`);
                            alert('Error copied to clipboard');
                        }}
                        variant="neutral"
                        style={{
                            marginTop: '20px',
                            marginLeft: '10px',
                            fontWeight: 'bold'
                        }}
                    >
                        COPY REPORT
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
