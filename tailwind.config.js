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
            },
            fontFamily: {
                'terminal': ['VT323', 'Courier New', 'monospace'],
                'code': ['Fira Code', 'Consolas', 'monospace'],
                'pixel': ['Press Start 2P', 'monospace'],
            }
        },
    },
    plugins: [],
}
