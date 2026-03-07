/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Amazon Ember"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        // Primary / brand (design-specs only)
        'brand-orange': '#FF9900',
        'brand-orange-hover': '#E47911',
        'brand-orange-border': '#C45500',
        'header-navy': '#131921',
        'nav-secondary': '#232F3E',
        'link-blue': '#007185',
        'link-blue-hover': '#C7511F',
        // Neutrals
        'page-bg': '#EAEDED',
        'card': '#FFFFFF',
        'bg-light': '#F3F3F3',
        'border-gray': '#DDDDDD',
        'border-input': '#CDBA96',
        'text-primary': '#0F1111',
        'text-secondary': '#565959',
        'text-muted': '#888C8C',
        // Feedback
        'error-red': '#CC0000',
        'success-green': '#007600',
        'prime-blue': '#00A8E0',
        'discount-badge': '#CC0C39',
        // Buttons
        'search-btn': '#FEBD69',
        'btn-yellow': '#FFD814',
        'btn-yellow-border': '#FCD200',
        'btn-gradient-from': '#F7DFA5',
        'btn-gradient-to': '#F0C14B',
        'input-focus': '#E77600',
        // Badges
        'new-badge-bg': '#E3F4FF',
        'new-badge-text': '#007185',
      },
      boxShadow: {
        card: '0 2px 5px 0 rgba(213, 217, 217, 0.5)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
        header: '0 2px 4px -1px rgba(0, 0, 0, 0.15)',
        modal: '0 1px 3px rgba(0, 0, 0, 0.35)',
        'input-focus': '0 0 0 3px rgba(228, 121, 17, 0.5)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(50px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease',
        'slide-up': 'slideUp 0.3s ease',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        '.focus-ring': {
          outline: 'none',
        },
        '.focus-ring:focus-visible': {
          outline: `2px solid ${theme('colors.input-focus')}`,
          outlineOffset: '2px',
        },
        '.product-detail-scroll::-webkit-scrollbar': {
          width: '8px',
        },
        '.product-detail-scroll::-webkit-scrollbar-track': {
          backgroundColor: theme('colors.bg-light'),
        },
        '.product-detail-scroll::-webkit-scrollbar-thumb': {
          backgroundColor: theme('colors.text-muted'),
          borderRadius: '4px',
        },
        '.product-detail-scroll::-webkit-scrollbar-thumb:hover': {
          backgroundColor: theme('colors.text-secondary'),
        },
      })
    },
  ],
}
