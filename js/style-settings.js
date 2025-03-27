/* 
   Part 1/2 of Theme & Framework handling.
  (Part 2/2 is in demo-content.html) 
*/
document.addEventListener("DOMContentLoaded", function () {
    const darkmodeButton = document.getElementById('theme-toggle');
    const frameworkButtons = document.querySelectorAll('input[name="framework"]');
    const container = document.querySelector("main.content");
  
    // Load theme from storage or system preference
    function getInitialTheme() {
      const saved = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return saved || (systemPrefersDark ? 'dark' : 'light');
    }
  
    // Load framework from storage or use default
    function getInitialFramework() {
      return localStorage.getItem("framework") || "toddy";
    }
  
    // Rebuild iframe with theme + framework
    function applySettings(theme, framework) {
      localStorage.setItem("theme", theme);
      localStorage.setItem("framework", framework);
  
      // Add "data-theme" to html root:
      document.documentElement.setAttribute("data-theme", theme);

      // Make sure the toggle button matches the saved theme:
      darkmodeButton.checked = ( theme === 'dark' );
  
      // Create iFrame:
      const src = `demo-content.html?theme=${theme}&framework=${framework}.css`;
      const newIframe = document.createElement("iframe");
      newIframe.id = "demoFrame";
      newIframe.src = src;
      newIframe.loading = "eager";
  
      // Replace the previous iframe:
      const oldIframe = document.getElementById("demoFrame");
      if (oldIframe) container.replaceChild(newIframe, oldIframe);
      else container.appendChild(newIframe);

      // ⬇️ Hide toggle when "No CSS" is selected
      const isNoCSS = ( framework === 'none' );
      document.querySelector('.theme-toggle-button').style.display = isNoCSS ? 'none' : '';
    }
  
    //------------------------------------------------------------------------
    // Read the initial saved values (if applicable)
    const initialTheme = getInitialTheme();
    const initialFramework = getInitialFramework();
  
    // Make sure the radio button matches the saved framework:
    const defaultInput = document.querySelector(`input[value="${initialFramework}"]`);
    if (defaultInput) defaultInput.checked = true;
  
    // Apply the theme & framework to iFrame:
    applySettings(initialTheme, initialFramework);
  
    // Listen for theme toggle:
    darkmodeButton.addEventListener('change', () => {
      const newTheme = darkmodeButton.checked ? 'dark' : 'light';
      const currentFramework = document.querySelector('input[name="framework"]:checked')?.value || "toddy";
      applySettings(newTheme, currentFramework);
    });
  
    // Listen for framework change:
    frameworkButtons.forEach((radio) => {
      radio.addEventListener("change", (event) => {
        const newFramework = event.target.value;
        const currentTheme = darkmodeButton.checked ? 'dark' : 'light';
        applySettings(currentTheme, newFramework);
      });
    });
  });