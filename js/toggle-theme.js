/* Theme Toggle for Mobile Mode (part 1/2) */
document.addEventListener("DOMContentLoaded", function () {
  // Specify which radio buttons we'll be reading:
  const radioButtons = document.querySelectorAll('input[name="theme"]');
  // Specify the location of the iframe:
  const container = document.querySelector("main.content");

  function applyTheme(theme) {
    // Save the selected theme to local storage:
    localStorage.setItem("theme", theme);

    // Build HTML code for a new iframe with the new theme:
    const iframeSrc = "demo-content.html?style=" + theme + ".css";
    const newIframe = document.createElement("iframe");
    newIframe.id = "themeFrame";
    newIframe.src = iframeSrc;
    newIframe.loading = "eager"; // Important for immediate loading.

    // Replace the previous iframe:
    const oldIframe = document.getElementById("themeFrame");
    if (oldIframe) container.replaceChild(newIframe, oldIframe);
    else container.appendChild(newIframe);
  }

  // Read the previously set theme (if applicable). Default to "toddy" if none specified.
  const savedTheme = localStorage.getItem("theme") || "toddy";

  // Set the radio button to match the set theme:
  const defaultInput = document.querySelector(`input[value="${savedTheme}"]`);
  if (defaultInput) defaultInput.checked = true;

  // Apple the set theme:
  applyTheme(savedTheme);

  // Listen for changes to radio buttons:
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      const selectedTheme = event.target.value;
      applyTheme(selectedTheme);
    });
  });
});
