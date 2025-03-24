/* Start of Theme Toggle for Mobile Mode (part 1/2) */
/* Used in index.html */
document.addEventListener("DOMContentLoaded", function () {

    // Specify which iFrame and radio buttons we are working with:
    const iframe = document.getElementById("themeFrame");
    const radioButtons = document.querySelectorAll('input[name="theme"]');

    // Get stored theme preference or default to light:
    let savedTheme = localStorage.getItem("theme") || "light";

    // Ensure the correct radio button is checked:
    document.querySelector(`input[value="${savedTheme}"]`).checked = true;

    // Define function to send the theme preference to the iframe:
    function sendThemeToIframe(theme) {
        iframe.contentWindow.postMessage({ theme }, "*");
        // Note: the iFrame will need it's own JS code for handling the theme preference.
    }

    // Wait for iframe to load, then send theme:
    iframe.onload = () => {
        sendThemeToIframe(savedTheme);
    };

    // Listen for radio button changes:
    radioButtons.forEach(radio => {
        radio.addEventListener("change", (event) => {
            let selectedTheme = event.target.value;
            localStorage.setItem("theme", selectedTheme);
            sendThemeToIframe(selectedTheme);
        });
    });

});
/* End of Theme Toggle for Mobile Mode (part 1/2) */