export function getCode(botId: string) {
    return `document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.createElement('iframe');

    iframe.style.border = 'none';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.src = 'http://localhost:5173/widget/${botId}';
    iframe.style.zIndex = '9999';
    iframe.setAttribute("id", "aidot");

    document.body.appendChild(iframe);

    window.addEventListener('message', function(event) {
        if (event.data === "aidot-hide") {
            iframe.style.width = '150px';
            iframe.style.height = '150px';
        }
        if (event.data === "aidot-show") {
            iframe.style.width = '460px';
            iframe.style.height = '682px';
        }
    });
});`
}
