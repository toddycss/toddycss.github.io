/* 
   Part 1/2 of Theme & Framework handling.
  (Part 2/2 is in demo-content.html) 
*/
document.addEventListener("DOMContentLoaded", function () {
  const darkmodeButton = document.getElementById('theme-toggle');
  const frameworkButtons = document.querySelectorAll('input[name="framework-c"]');

  const selectA = document.getElementById("framework-a");
  const selectB = document.getElementById("framework-b");
  const iframeA = document.getElementById("iframe-a");
  const iframeB = document.getElementById("iframe-b");
  const iframeC = document.getElementById("iframe-c");

  // Load theme from storage or system preference
  function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (systemPrefersDark ? 'dark' : 'light');
  }

  function getInitialFramework(key, fallback) {
    return localStorage.getItem(key) || fallback;
  }

  function applyTheme(theme) {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    darkmodeButton.checked = (theme === 'dark');
  }

  function updateIframe(iframe, framework) {
    const theme = darkmodeButton.checked ? "dark" : "light";
    const css = framework === "none" ? "none.css" : `${framework}.css`;
    iframe.src = `demo-content.html?theme=${theme}&framework=${css}`;
  }

  //------------------------------------------------------------------------
  // Read the initial saved values (if applicable)
  const initialTheme = getInitialTheme();
  const frameworkA = getInitialFramework("framework-a", "none");
  const frameworkB = getInitialFramework("framework-b", "toddy");
  const frameworkC = getInitialFramework("framework-c", "toddy"); // from radio buttons

  // Set initial theme and apply
  applyTheme(initialTheme);

  // Set dropdown defaults from saved values
  if (selectA) selectA.value = frameworkA;
  if (selectB) selectB.value = frameworkB;

  // Set radio default for mobile (iframeC)
  const radioToCheck = document.querySelector(`input[name="framework-c"][value="${frameworkC}"]`);
  if (radioToCheck) radioToCheck.checked = true;

  // Set iframes on load
  if (iframeA) updateIframe(iframeA, frameworkA);
  if (iframeB) updateIframe(iframeB, frameworkB);
  if (iframeC) updateIframe(iframeC, frameworkC);

  // Listen for changes to theme toggle
  darkmodeButton.addEventListener('change', () => {
    const newTheme = darkmodeButton.checked ? 'dark' : 'light';
    applyTheme(newTheme);
    if (iframeA && selectA) updateIframe(iframeA, selectA.value);
    if (iframeB && selectB) updateIframe(iframeB, selectB.value);

    const selectedRadio = document.querySelector('input[name="framework-c"]:checked');
    if (iframeC && selectedRadio) updateIframe(iframeC, selectedRadio.value);
  });

  // Listen for changes to framework radio buttons (mobile mode)
  frameworkButtons.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      const newFramework = event.target.value;
      const currentTheme = darkmodeButton.checked ? 'dark' : 'light';
      localStorage.setItem("framework-c", newFramework);

      if (iframeC) {
        updateIframe(iframeC, newFramework);
      }

      // Hide the theme toggle button if No CSS framework is selected
      const isNoCSS = (newFramework === 'none');
      document.querySelector('.theme-toggle-button').style.display = isNoCSS ? 'none' : '';
    });
  });

  // Listen for changes to framework dropdown menus (desktop mode)
  if (selectA && iframeA) {
    selectA.addEventListener("change", () => {
      localStorage.setItem("framework-a", selectA.value);
      updateIframe(iframeA, selectA.value);
    });
  }
  if (selectB && iframeB) {
    selectB.addEventListener("change", () => {
      localStorage.setItem("framework-b", selectB.value);
      updateIframe(iframeB, selectB.value);
    });
  }
});

// Listen for change to window size to re-enable theme toggle button
window.addEventListener('resize', () => {
  const isDesktopMode = document.querySelector('.desktop-mode')?.offsetParent !== null;
  if (isDesktopMode) {
    document.querySelector('.theme-toggle-button').style.display = '';
  }
});
