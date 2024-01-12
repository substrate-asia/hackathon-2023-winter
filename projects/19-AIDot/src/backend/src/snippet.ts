import { config } from "../aidot.config.js";

export function getCode(botId: string) {
    return `document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.createElement('iframe');

    iframe.style.border = 'none';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.src = '${config.webUrl}/widget/${botId}';
    iframe.style.zIndex = '9999';
    iframe.setAttribute("id", "aidot");

    // Function to update iframe dimensions based on screen size
    function updateIframeSize() {
        if (window.innerWidth < 450) {
            iframe.style.width = window.innerWidth + 'px'; // Full width on small screens
            iframe.style.height = '682px'; // Full height on small screens
        } else if (window.innerHeight > 682){
            iframe.style.width = '460px';
            iframe.style.height = window.innerHeight + 'px';
        } 
        else {
            iframe.style.width = '460px'; // Default width
            iframe.style.height = '682px'; // Default height
        }
    }

    // Call updateIframeSize initially and on window resize
    updateIframeSize();
    window.addEventListener('resize', updateIframeSize);

    document.body.appendChild(iframe);

    window.addEventListener('message', function(event) {
        if (event.data === "aidot-hide") {
            iframe.style.width = '150px';
            iframe.style.height = '150px';
        }
        if (event.data === "aidot-show") {
            updateIframeSize(); // Adjust size based on current screen width
        }
    });
});`
}
