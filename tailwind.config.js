/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" 
  ],
  theme: {
    extend: {
      colors: {
        "mainBgColor" : '#0D1117',
        "columnBgColor" : '#161C22',
      },
      cursor: {
        help: 'help',
        zoomin: 'zoom-in',
        zoomout: 'zoom-out',
        paw: "url('/pawCursor.svg'), auto",
      },
      fontFamily:{
        jolly : ["Jolly Lodger", "seriff"]
      }
    },
  },
  plugins: [],
}
