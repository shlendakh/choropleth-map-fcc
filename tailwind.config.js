module.exports = {
    content: ['./**/*.html', './**/*.css'],
    theme: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      borderRadius: {
        'none': '0',
        'sm': '.125rem',
        DEFAULT: '.25rem',
        'lg': '.5rem',
        'full': '9999px',
      },
      fontFamily: {
        'sans': ['"Roboto"', 'sans-serif']
      }
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }