document.addEventListener("DOMContentLoaded", function () {
  const darkmodeButton = document.getElementById('theme-toggle');

  const selectA = document.getElementById("framework-a"); // desktop & mobile
  const selectB = document.getElementById("framework-b"); // desktop-only
  const radioA = document.querySelectorAll('input[name="framework-c"]'); // mobile-only

  const iframeA = document.getElementById("iframe-a");    // desktop-only
  const iframeB = document.getElementById("iframe-b");    // desktop-only

  function getStoredFrameworkA() {
    return localStorage.getItem("framework-a") || "none";
  }
  function getStoredFrameworkB() {
    return localStorage.getItem("framework-b") || "toddy";
  }
  function getStoredTheme() {
    return localStorage.getItem('theme') || "light";
  }
  function getCurrentTheme() {
    return darkmodeButton.checked ? "dark" : "light";
  }

  function applyTheme(theme) {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    darkmodeButton.checked = (theme === 'dark');
  }

  function updateIframe(iframe, framework) {
    const theme = getCurrentTheme();
    const css = ( framework === "none" ) ? "none" : `${framework}.css`;
    const newSrc = `demo-content.html?theme=${theme}&framework=${css}`;
    if (iframe.src !== newSrc) {
      iframe.src = newSrc;
    }
    updateThemeToggleVisibility();
  }

  function syncFrameworkA(value) {
    // Use a single shared key for dropdown menu + radio buttons.
    localStorage.setItem("framework-a", value); 

    if (selectA) selectA.value = value;
    radioA.forEach(radio => {
      radio.checked = (radio.value === value);
    });

    if (iframeA) updateIframe(iframeA, value);
  }

  function updateThemeToggleVisibility() {
    const frameworkA = getStoredFrameworkA();
    const frameworkB = getStoredFrameworkB();
    const demoBisHidden = document.querySelector('.demo-B')?.offsetParent === null;

    const shouldHideToggle =
    (frameworkA === "none" && frameworkB === "none") ||
    (frameworkA === "none" && demoBisHidden);

    document.querySelector('.theme-toggle-button').style.display = shouldHideToggle ? 'none' : '';
  }

  //------------------------------------------------------------------------
  // Read the initial saved values (if applicable).
  const initialTheme = getStoredTheme();
  const initialFrameworkA = getStoredFrameworkA();
  const initialFrameworkB = getStoredFrameworkB();

  // Apply initial theme.
  applyTheme(initialTheme);

  // Apply initial framework to iFrameA & iFrameC.
  syncFrameworkA(initialFrameworkA); 

  // Apply initial framework to iFrameB (if visible).
  if (selectB && iframeB) {
    selectB.value = initialFrameworkB;
    updateIframe(iframeB, initialFrameworkB);
  }

  // Listen for changes to framework radio buttons (mobile).
  radioA.forEach(radio => {
    radio.addEventListener("change", (e) => {
      if (e.target.checked) {
        syncFrameworkA(e.target.value);
      }
    });
  });

  // Listen for changes to framework dropdown menus (desktop).
  if (selectA) {
    selectA.addEventListener("change", (e) => {
      syncFrameworkA(e.target.value);
    });
  }
  if (selectB) {
    selectB.addEventListener("change", () => {
      localStorage.setItem("framework-b", selectB.value);
      updateIframe(iframeB, selectB.value);
    });
  }

  // Listen for changes to theme toggle button.
  darkmodeButton.addEventListener('change', () => {
    const theme = getCurrentTheme();
    applyTheme(theme);

    const frameworkA = getStoredFrameworkA();
    const frameworkB = getStoredFrameworkB();
    updateIframe(iframeA, frameworkA);
    updateIframe(iframeB, frameworkB);
  });

  // Listen for window resize (to show/hide theme toggle button).
  window.addEventListener('resize', () => {
    updateThemeToggleVisibility();
  });

});