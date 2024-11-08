/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  './PWASetUp/**/*.{js,ts,jsx,tsx,mdx}',
	  './pages/**/*.{js,ts,jsx,tsx,mdx}',
	  './components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
	  extend: {
		colors: {
		  primary: '#10B981',
		  secondary: '#6366F1',
		  background: '#1F2937',
		  surface: '#374151',
		  text: '#F9FAFB'
		}
	  },
	},
	plugins: [],
  }