document.addEventListener("DOMContentLoaded", function () {
  const darkmodeButton = document.getElementById('theme-toggle');

  const selectA = document.getElementById("framework-a"); // desktop & mobile
  const selectB = document.getElementById("framework-b"); // desktop-only
  const selectC = document.querySelectorAll('input[name="framework-c"]'); // mobile-only
  const iframeA = document.getElementById("iframe-a");    // desktop-only
  const iframeB = document.getElementById("iframe-b");    // desktop-only
  const iframeC = document.getElementById("iframe-c");    // mobile-only

  function applyTheme(theme) {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    darkmodeButton.checked = (theme === 'dark');
  }

  function updateIframe(iframe, framework) {
    const theme = darkmodeButton.checked ? "dark" : "light";
    const css = ( framework === "none" ) ? "none" : `${framework}.css`;
    iframe.src = `demo-content.html?theme=${theme}&framework=${css}`;
  }

  function syncFrameworkAC(value) {
    localStorage.setItem("framework-a", value); // Use a single shared key
    localStorage.setItem("framework-c", value);

    if (selectA) selectA.value = value;
    selectC.forEach(radio => {
      radio.checked = ( radio.value === value );
    });

    if (iframeA) updateIframe(iframeA, value);
    if (iframeC) updateIframe(iframeC, value);

    updateThemeToggleVisibility(value);
  }

  function updateThemeToggleVisibility(framework) {
    const isNoCSS = ( framework === "none" );
    const isMobile = document.querySelector('.mobile-mode')?.offsetParent !== null;
    document.querySelector('.theme-toggle-button').style.display = (isNoCSS && isMobile) ? 'none' : '';

    // Note: this code is missing an edge case:
    // In desktop mode, if both frameworks are set to "none", then the Theme Toggle should disappear.
  }

  //------------------------------------------------------------------------
  // Read the initial saved values (if applicable).
  const initialTheme = localStorage.getItem('theme') || "light";
  const initialFrameworkAC = localStorage.getItem("framework-a") || "none";
  const initialFrameworkB = localStorage.getItem("framework-b") || "toddy";

  // Apply initial theme.
  applyTheme(initialTheme);

  // Apply initial framework to iFrameA & iFrameC.
  syncFrameworkAC(initialFrameworkAC); 

  // Apply initial framework to iFrameB (if visible).
  if (selectB && iframeB) {
    selectB.value = initialFrameworkB;
    updateIframe(iframeB, initialFrameworkB);
  }

  // Listen for changes to framework radio buttons (mobile).
  selectC.forEach(radio => {
    radio.addEventListener("change", (e) => {
      if (e.target.checked) {
        syncFrameworkAC(e.target.value);
      }
    });
  });

  // Listen for changes to framework dropdown menus (desktop).
  if (selectA) {
    selectA.addEventListener("change", (e) => {
      syncFrameworkAC(e.target.value);
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
    const theme = darkmodeButton.checked ? "dark" : "light";
    applyTheme(theme);

    const frameworkAC = localStorage.getItem("framework-a") || "toddy";
    const frameworkB = localStorage.getItem("framework-b") || "toddy";

    updateIframe(iframeA, frameworkAC);
    updateIframe(iframeC, frameworkAC);
    updateIframe(iframeB, frameworkB);
  });

  // Listen for window resize (to show/hide theme toggle button).
  window.addEventListener('resize', () => {
    const currentFramework = localStorage.getItem("framework-a") || "none";
    updateThemeToggleVisibility(currentFramework);
  });

});