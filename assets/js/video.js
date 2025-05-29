const params = new URLSearchParams(window.location.search);
const videoId = params.get("id");

fetch(`https://mytubeserver-production.up.railway.app/api/video/${videoId}`)
  .then((res) => res.json())
  .then((video) => {
    document.getElementById("video-title").textContent = video.title;
    if (video.description) {
      document.getElementById("video-description").textContent =
        "Описание: " + video.description;
    }
    document.getElementById("likes").textContent = video.likes;

    const source = document.getElementById("video-source");
    source.src = `https://mytubeserver-production.up.railway.app${video.video_path}`;
    document.getElementById("video-player").load();
  })
  .catch(() => {
    document.getElementById("video-title").textContent = "Видео не найдено.";
  });

document.getElementById("likesCont").addEventListener("click", () => {
  fetch(`https://mytubeserver-production.up.railway.app/api/videos/${videoId}/like`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const likeSpan = document.getElementById("likes");
        likeSpan.textContent = parseInt(likeSpan.textContent) + 1;
      }
    });
});
