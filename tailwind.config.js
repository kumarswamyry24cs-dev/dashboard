export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0f1e',
        'cyber-card': '#0d1b2a',
        'cyber-cyan': '#00f5ff',
        'cyber-green': '#39ff14',
        'cyber-orange': '#ff6b35',
        'cyber-text': '#e0f7fa'
      },
      fontFamily: {
        'tech-mono': ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        'orbitron': ['"Orbitron"', 'sans-serif']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.5)',
        'glow-cyan-lg': '0 0 40px rgba(0, 245, 255, 0.7)',
        'glow-green': '0 0 20px rgba(57, 255, 20, 0.5)',
        'glow-green-lg': '0 0 40px rgba(57, 255, 20, 0.7)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.5)'
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-lines': 'scan-lines 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'radar-sweep': 'radar-sweep 3s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-up': 'slide-in-up 0.5s ease-out',
        'pulse-glow-animation': 'pulse-glow-animation 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 0.3s infinite',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'text-glitch': 'text-glitch 4s infinite',
        'scanline-sweep': 'scanline-sweep 0.8s ease-out forwards',
        'wipe-right': 'wipe-right 0.8s ease-out forwards',
        'typewriter': 'typewriter 2s steps(50, end) forwards',
        'flash-green': 'flash-green 0.6s ease-out forwards'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(0, 245, 255, 0.5)' },
          '50%': { 'box-shadow': '0 0 40px rgba(0, 245, 255, 0.8)' }
        },
        'scan-lines': {
          '0%': { 'transform': 'translateY(-100%)' },
          '100%': { 'transform': 'translateY(100%)' }
        },
        'flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            'opacity': '1'
          },
          '20%, 24%, 55%': {
            'opacity': '0.95'
          }
        },
        'radar-sweep': {
          '0%': { 'transform': 'rotate(0deg)' },
          '100%': { 'transform': 'rotate(360deg)' }
        },
        'fade-in': {
          'from': { 'opacity': '0' },
          'to': { 'opacity': '1' }
        },
        'slide-in-up': {
          'from': { 'opacity': '0', 'transform': 'translateY(20px)' },
          'to': { 'opacity': '1', 'transform': 'translateY(0)' }
        },
        'pulse-glow-animation': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3)' },
          '50%': { 'box-shadow': '0 0 40px rgba(0, 245, 255, 0.8), 0 0 60px rgba(0, 245, 255, 0.5)' }
        },
        'glitch': {
          '0%': { 'transform': 'translate(0)' },
          '20%': { 'transform': 'translate(-2px, 2px)' },
          '40%': { 'transform': 'translate(-2px, -2px)' },
          '60%': { 'transform': 'translate(2px, 2px)' },
          '80%': { 'transform': 'translate(2px, -2px)' },
          '100%': { 'transform': 'translate(0)' }
        },
        'bounce-in': {
          '0%': { 'opacity': '0', 'transform': 'translateY(30px) scale(0.8)' },
          '50%': { 'opacity': '1', 'transform': 'translateY(-5px) scale(1.05)' },
          '100%': { 'opacity': '1', 'transform': 'translateY(0) scale(1)' }
        },
        'text-glitch': {
          '0%': { 'text-shadow': 'none' },
          '20%': { 'text-shadow': '-2px 0 #00f5ff, 2px 0 #ff6b35' },
          '40%': { 'text-shadow': '2px 0 #00f5ff, -2px 0 #ff6b35' },
          '60%': { 'text-shadow': 'none' },
          '80%': { 'text-shadow': '-2px 0 #39ff14, 2px 0 #ff6b35' },
          '100%': { 'text-shadow': 'none' }
        },
        'scanline-sweep': {
          '0%': { 'top': '0%', 'opacity': '1' },
          '100%': { 'top': '100%', 'opacity': '0' }
        },
        'wipe-right': {
          '0%': { 'clip-path': 'inset(0 100% 0 0)' },
          '100%': { 'clip-path': 'inset(0 0 0 0)' }
        },
        'typewriter': {
          '0%': { 'width': '0', 'visibility': 'hidden' },
          '100%': { 'width': '100%', 'visibility': 'visible' }
        },
        'flash-green': {
          '0%': { 'background-color': 'rgba(57, 255, 20, 0.7)', 'opacity': '1' },
          '50%': { 'background-color': 'rgba(57, 255, 20, 0.5)', 'opacity': '0.8' },
          '100%': { 'background-color': 'rgba(57, 255, 20, 0)', 'opacity': '0' }
        }
      }
    }
  },
  plugins: []
}
