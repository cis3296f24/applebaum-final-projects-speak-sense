/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  './pages/**/*.{js,ts,jsx,tsx,mdx}',
	  './components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
	  extend: {
		colors: {
		  primary: '#10B981', // emerald-500
		  secondary: '#6366F1', // indigo-500
		  background: '#1F2937', // gray-800
		  surface: '#374151', // gray-700
		  text: '#F9FAFB', // gray-50
		},
		animation: {
		  'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
		}
	  },
	},
	plugins: [],
  }