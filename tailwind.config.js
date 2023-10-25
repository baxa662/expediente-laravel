/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./welcome.blade", "./resources/js/**/*.{js,ts,jsx,tsx}"],
    plugins: [require("daisyui")],
    daisyui: {
        themes: ["light"],
    },
};
