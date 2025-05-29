const LoaderAnimation = lottie.loadAnimation({
  container: document.getElementById("loader-animation"),
  renderer: "svg",
  loop: true,
  autoplay: false,
  path: "../assets/loader.json",
});

async function GetVideos() {
  const container = document.getElementById("videos");
  const loader = document.getElementById("loader-animation");
  loader.style.display = "block";
  LoaderAnimation.play();

  try {
    const res = await fetch("https://mytubeserver-production.up.railway.app/api/videos");
    const videos = await res.json();
    container.innerHTML = "";

    if (videos.length === 0) {
      const warning = document.createElement("h1");
      warning.classList.add("warning");
      warning.textContent = "Нет видео";
      container.appendChild(warning);
    }

    const mediaLoadPromises = videos.map((video) => {
      return new Promise((resolve) => {
        const div = document.createElement("div");
        div.classList.add("video-card");

        const link = document.createElement("a");
        link.href = `video.html?id=${video.id}`;

        let mediaElement;
        if (video.thumbnail) {
          mediaElement = new Image();
          mediaElement.onload = resolve;
          mediaElement.onerror = resolve;
          mediaElement.src = `https://mytubeserver-production.up.railway.app${video.thumbnail}`;
          mediaElement.style.display = "block";
        } else {
          mediaElement = document.createElement("video");
          mediaElement.controls = false;
          mediaElement.style.display = "block";

          const source = document.createElement("source");
          source.src = `https://mytubeserver-production.up.railway.app${video.video_path}`;
          source.type = "video/mp4";
          mediaElement.appendChild(source);

          mediaElement.addEventListener("loadeddata", resolve);
          mediaElement.addEventListener("error", resolve);
        }

        const timer = document.createElement("div");
        timer.classList.add("timer");
        timer.textContent = formatDuration(video.duration);

        const infoCont = document.createElement("div");
        infoCont.classList.add("infoCont");

        const title = document.createElement("h3");
        const date = document.createElement("h3");
        mediaElement.classList.add("theMedia");
        title.textContent = video.title;
        date.textContent = getTimeAgo(video.uploaded_at);
        date.classList.add("dateOfVideo");

        infoCont.appendChild(title);
        infoCont.appendChild(date);

        link.appendChild(mediaElement);
        link.appendChild(timer);
        link.appendChild(infoCont);

        div.appendChild(link);

        video._domElement = div;
      });
    });

    await Promise.all(mediaLoadPromises);

    videos.forEach((video) => {
      container.appendChild(video._domElement);
    });

  } catch (error) {
    console.error("Ошибка загрузки видео:", error);
  } finally {
    loader.style.display = "none";
    LoaderAnimation.stop();
  }
}

function getTimeAgo(uploadedDate) {
  const now = new Date();
  const uploaded = new Date(uploadedDate);
  const diffMs = now - uploaded;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "1 день назад";
  if (diffDays <= 7) return `${diffDays} дней назад`;
  if (diffDays <= 14) return "2 недели назад";
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} недели назад`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} ${diffMonths === 1 ? "месяц" : "месяца"} назад`;
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

GetVideos();
