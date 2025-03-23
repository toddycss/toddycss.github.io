/* Script to remove trailing spaces inside the <pre> element. */
/* (Note: This will not affect spaces within the content, only at the end.) */
document.querySelectorAll("pre").forEach(pre => {
    pre.innerHTML = pre.innerHTML.replace(/\s+$/, ""); // Remove trailing spaces
});


/* Script to reposition Tooltips if/when they overflow. */
document.querySelectorAll("[data-tooltip]").forEach(parent => {

    function repositionTooltip() {
        // Exit if the parent element has the "css-only" class.
        if (parent.classList.contains("css-only")) return;

        // Create a reference to the pseudo-element using computed styles.
        const beforeStyles = window.getComputedStyle(this, "::before");

        // Ensure the tooltip is not empty (some browsers return `none` if empty).
        if (!beforeStyles || beforeStyles.content === "none") return;

        // Get the parent's width and position.
        const parentRect = this.getBoundingClientRect();

        // Get tooltip's width.
        const tooltipWidth = parseFloat(beforeStyles.width);

        // Calculate where the tooltip starts when centered over the parent.
        const tooltipLeft = parentRect.left + (parentRect.width / 2) - (tooltipWidth / 2);

        let shiftX = 0;

        // Check if the tooltip overflows the right edge.
        if (tooltipLeft + tooltipWidth > window.innerWidth) {
            shiftX = window.innerWidth - (tooltipLeft + tooltipWidth);
        }
        // Check if the tooltip overflows the left edge.
        else if (tooltipLeft < 0) {
            shiftX = -tooltipLeft;
        }
        // Apply the exact shift.
        this.style.setProperty("--tooltip-offset-x", `${shiftX}px`);
    }
    // Attach both `mouseenter` and `focus` events.
    parent.addEventListener("mouseenter", repositionTooltip);
    parent.addEventListener("focus", repositionTooltip);
});

/*
document.querySelectorAll("[data-tooltip]").forEach(parent => {
    parent.addEventListener("mouseenter", function () {
    // Exit if the parent element has the "css-only" class
    if (this.classList.contains("css-only")) return;

    // Create a reference to the pseudo-element using computed styles.
    const beforeStyles = window.getComputedStyle(this, "::before");

    // Ensure the tooltip is not empty (some browsers return `none` if empty).
    if (!beforeStyles || beforeStyles.content === "none") return;

    // Get the parent's width and position.
    // (parent = the word you hover over to trigger the tooltip).
    const parentRect = this.getBoundingClientRect();

    // Get tooltip's width.
    const tooltipWidth = parseFloat(beforeStyles.width);

    // Calculates where the tooltip starts when centered over the parent.
    const tooltipLeft = parentRect.left + (parentRect.width/2) - (tooltipWidth/2);

    let shiftX = 0;

    // Check if the tooltip overflows the right edge.
    if (tooltipLeft + tooltipWidth > window.innerWidth) {
        shiftX = window.innerWidth - (tooltipLeft + tooltipWidth);
    }
    // Check if the tooltip overflows the left edge.
    else if (tooltipLeft < 0) {
        shiftX = -tooltipLeft;
    }
    // Apply the exact shift
    this.style.setProperty("--tooltip-offset-x", `${shiftX}px`);
    });
});
*/



document.querySelectorAll(".tooltip-parent").forEach(parent => {
    /* In addition to the standard Hover-based and Focused-based behaviour, 
       this script enables:
	    1. Keyboard accessibility: 
            - Tooltips can be toggled using the Enter and Escape keys.
	    2. Click-based persistence: 
            - Clicking a tooltip keeps it visible even if the mouse leaves, allowing users to copy the contents.
            - Clicking again removes persistence, allowing normal hover behavior.
	    3. Click-outside detection: 
            - Clicking outside closes the tooltip.
        4. Clipping protection:
            - If/when a tooltip is cut off (clipped) on the edge of a page, it will be automatically shifted on the x-axis to fit the page.
    */
   
    // Exit if the parent element has the "css-only" class.
    if (parent.classList.contains("css-only")) return;

    const tooltip = parent.querySelector(".tooltip");
    if (!tooltip) return; // Exit if no tooltip found

    let isTooltipClicked = false; // Track if tooltip was clicked

    function updateTooltipPosition() {
        if (!tooltip) return;

        // Ensure tooltip is visible on focus (related to the "toggleHideShow" function).
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";

        // Update tooltip width every time (to avoid stale values).
        tooltip.dataset.tooltipWidth = tooltip.offsetWidth;
        let shiftX = 0;

        const parentRect = parent.getBoundingClientRect();
        const tooltipWidth = parseFloat(tooltip.dataset.tooltipWidth);
        const tooltipLeft = parentRect.left + (parentRect.width / 2) - (tooltipWidth / 2);

        // Check if the tooltip overflows the right edge
        if (tooltipLeft + tooltipWidth > window.innerWidth) {
            shiftX = window.innerWidth - (tooltipLeft + tooltipWidth);
        }
        // Check if the tooltip overflows the left edge
        else if (tooltipLeft < 0) {
            shiftX = -tooltipLeft;
        }
        // Apply the exact shift.
        tooltip.style.setProperty("--tooltip-offset-x", `${shiftX}px`);
    }

    function hideTooltip() {
        if (isTooltipClicked) return; // Prevent hiding if clicked
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    }

    function showTooltip() {
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
    }

    function toggleWithKey(event) {
        if (event.key === "Enter" || event.key === "Escape") {
            const isVisible = getComputedStyle(tooltip).visibility === "visible";
            if (isVisible) {
                isTooltipClicked = false; // Reset click state when hiding
                hideTooltip();
            } else {
                showTooltip();
            }
        }
    }

    function toggleWithMouse(event) {
        const isVisible = getComputedStyle(tooltip).visibility === "visible";
        if (isVisible) {
            isTooltipClicked = !isTooltipClicked; // Undo click state if clicked 2nd time.
        } else {
            isTooltipClicked = true; // Keep visible if clicked the first time.
            showTooltip();
        }
    }

    // Attach event listeners for both hover and focus.
    parent.addEventListener("mouseenter", updateTooltipPosition);
    parent.addEventListener("focus", updateTooltipPosition);

    // Hide tooltip on mouse leave, but NOT if it was clicked
    parent.addEventListener("mouseleave", hideTooltip);

    // Allow keyboard users to toggle tooltip using 'Enter' or close with 'Esc'
    parent.addEventListener("keydown", toggleWithKey);

    // Ensure tooltip is hidden when focus is lost
    parent.addEventListener("blur", () => {
        isTooltipClicked = false; // Reset click state on blur
        hideTooltip();
    });

    // Toggle click behavior
    parent.addEventListener("click", toggleWithMouse);

    // Allow clicking outside to close tooltip
    document.addEventListener("click", (event) => {
        if (!parent.contains(event.target)) {
            isTooltipClicked = false;
            hideTooltip();
        }
    });
});


/*



document.querySelectorAll(".tooltip-parent").forEach(parent => {
    const tooltip = parent.querySelector(".tooltip");
    if (!tooltip) return; // Exit if no tooltip found

    // Function to update tooltip position
    function updateTooltipPosition() {
        if (!tooltip) return;

        // Ensure tooltip is visible on focus (related to the "toggleHideShow" function).
        //tooltip.style.visibility = "visible";
        //tooltip.style.opacity = "1";

        // Update tooltip width every time (to avoid stale values).
        // (This was done to fix a bug in which every 2nd mouseenter would not properly shiftX.)
        tooltip.dataset.tooltipWidth = tooltip.offsetWidth;
        let shiftX = 0;

        const parentRect = parent.getBoundingClientRect();
        const tooltipWidth = parseFloat(tooltip.dataset.tooltipWidth);

        const tooltipLeft = parentRect.left + (parentRect.width / 2) - (tooltipWidth / 2);

        // Check if the tooltip overflows the right edge
        if (tooltipLeft + tooltipWidth > window.innerWidth) {
            shiftX = window.innerWidth - (tooltipLeft + tooltipWidth);
        }
        // Check if the tooltip overflows the left edge
        else if (tooltipLeft < 0) {
            shiftX = -tooltipLeft;
        }
        // Apply the exact shift.
        tooltip.style.setProperty("--tooltip-offset-x", `${shiftX}px`);
    }

    function hideTooltip() {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    }

    function showTooltip() {
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
    }

    function toggleHideShow(event) {
        if (event.key === "Enter") {
            const isVisible = getComputedStyle(tooltip).visibility === "visible";

            // Toggle visibility
            if (isVisible) {
                hideTooltip();
            } else {
                showTooltip();
            }
        }
    }

    // Attach event listeners for both hover and focus.
    parent.addEventListener("mouseenter", updateTooltipPosition);
    parent.addEventListener("focus", updateTooltipPosition);

    // Hide tooltip on mouse leave (bug fix).
    //parent.addEventListener("mouseleave", hideTooltip);

    // Allow keyboard users to toggle tooltip using 'Enter' key...
    parent.addEventListener("keydown", toggleHideShow);

    // ...and ensure tooltip is hidden when focus is lost.
    parent.addEventListener("blur", hideTooltip);
});

*/


/*

document.querySelectorAll(".tooltip-parent").forEach(parent => {
    const tooltip = parent.querySelector(".tooltip");
    if (!tooltip) return;

    // Precalculate tooltip width and store it in a custom attribute.
    // (This was done to fix a bug in which every 2nd mouseenter would not properly shiftX.)
    tooltip.dataset.tooltipWidth = tooltip.offsetWidth;

    parent.addEventListener("mouseenter", function () {
        let shiftX = 0;
        const parentRect = this.getBoundingClientRect();
        const tooltipWidth = parseFloat(tooltip.dataset.tooltipWidth); // Use precalculated width

        const tooltipLeft = parentRect.left + (parentRect.width / 2) - (tooltipWidth / 2);

        // Check if the tooltip overflows the right edge
        if (tooltipLeft + tooltipWidth > window.innerWidth) {
            shiftX = window.innerWidth - (tooltipLeft + tooltipWidth);
        }
        // Check if the tooltip overflows the left edge
        else if (tooltipLeft < 0) {
            shiftX = -tooltipLeft;
        }
        tooltip.style.setProperty("--tooltip-offset-x", `${shiftX}px`);
    });
});
*/

/*
document.querySelectorAll(".tooltip-parent").forEach(parent => {
    parent.addEventListener("mouseover", function () {
        const tooltip = this.querySelector(".tooltip");
        if (!tooltip) return; // Exit if no tooltip found.

        // Get parent and tooltip dimensions.
        const parentRect = this.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let shiftX = 0;

        // Check if the tooltip overflows the right edge.
        if (tooltipRect.right > window.innerWidth) {
            shiftX = window.innerWidth - tooltipRect.right;
        }
        // Check if the tooltip overflows the left edge.
        else if (tooltipRect.left < 0) {
            shiftX = -tooltipRect.left;
        }
        // Apply the exact shift using CSS variable.
        tooltip.style.setProperty("--tooltip-offset-x", `${shiftX}px`);

        // BUG: 
    });
});
*/