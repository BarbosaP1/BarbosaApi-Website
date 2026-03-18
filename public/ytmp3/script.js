document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".input-url");
    const button = document.querySelector(".btn-primary");

    button.addEventListener("click", () => {
        const url = input.value.trim();

        if (!url) {
            alert("Cole a URL primeiro.");
            return;
        }

        console.log("Iniciando download para URL:", url);
        downloadMP3(url);
    });
});

function downloadMP3(url) {
    const api = "http://localhost:3000/download?url=" + encodeURIComponent(url);

    const a = document.createElement("a");
    a.href = api;
    a.download = "video.mp3";
    a.click();
}
