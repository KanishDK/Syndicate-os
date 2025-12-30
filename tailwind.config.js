/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ghost-black': '#050505',
                'ghost-dark': '#0a0a0a',
                'ghost-green': '#39ff14',
                'ghost-red': '#ff0033',
                'ghost-dim': '#444444',
            },
            fontFamily: {
                mono: ['Courier New', 'monospace'],
            }
        },
    },
    plugins: [],
}
