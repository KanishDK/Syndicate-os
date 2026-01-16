/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'terminal-black': '#0a0a0a',
                'terminal-green': '#00ff41',
                'terminal-amber': '#ffb000',
                'terminal-red': '#ff0040',
                'terminal-cyan': '#00d9ff',
                'terminal-purple': '#b026ff',

                // Dynamic Theme Colors (Mapped to CSS Variables)
                theme: {
                    primary: 'var(--colors-primary)',
                    secondary: 'var(--colors-secondary)',
                    accent: 'var(--colors-accent)',
                    danger: 'var(--colors-danger)',
                    warning: 'var(--colors-warning)',
                    success: 'var(--colors-success)',
                    info: 'var(--colors-info)',
                    cyan: 'var(--colors-cyan)',

                    bg: {
                        primary: 'var(--colors-surface-base)',
                        secondary: 'var(--colors-surface-elevated)',
                    },
                    text: {
                        primary: 'var(--colors-text-primary)',
                        secondary: 'var(--colors-text-secondary)',
                        muted: 'var(--colors-text-muted)',
                    },
                    border: {
                        default: 'var(--colors-border-default)',
                        subtle: 'var(--colors-border-subtle)',
                    }
                }
            },
            fontFamily: {
                'terminal': ['VT323', 'Courier New', 'monospace'],
                'code': ['Fira Code', 'Consolas', 'monospace'],
                'pixel': ['Press Start 2P', 'monospace'],
            },
            fontSize: {
                'display-lg': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
                'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
                'code-xs': ['0.75rem', { lineHeight: '1.5', fontFamily: 'Fira Code' }],
                'code-sm': ['0.875rem', { lineHeight: '1.5', fontFamily: 'Fira Code' }],
            }
        },
    },
    plugins: [],
}
