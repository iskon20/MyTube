const form = document.getElementById("uploadForm");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const backLink = document.querySelector(".back-link");
const containerLoader = document.getElementById("loader-animation");

const loaderAnimation = lottie.loadAnimation({
  container: containerLoader,
  renderer: "svg",
  loop: true,
  autoplay: false,
  path: "../loader.json",
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://mytubeserver-production.up.railway.app/api/upload", true);
  xhr.timeout = 10 * 60 * 1000;

  containerLoader.style.display = "block";
  loaderAnimation.play();

  backLink.style.pointerEvents = "none";
  backLink.style.opacity = "0.4";

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percentComplete = Math.round((e.loaded / e.total) * 100);
      progressBar.style.display = "block";
      progressBar.value = percentComplete;
      progressText.textContent = `Загружено: ${percentComplete}%`;
    }
  };

  xhr.onload = () => {
    loaderAnimation.stop();
    containerLoader.style.display = "none";

    backLink.style.pointerEvents = "auto";
    backLink.style.opacity = "1";

    if (xhr.status === 200) {
      const result = JSON.parse(xhr.responseText);
      if (result.success) {
        alert("Видео загружено!");
        window.location.href = "index.html";
      } else {
        alert("Ошибка загрузки");
      }
    } else {
      alert("Ошибка соединения");
    }
  };

  xhr.onerror = () => {
    loaderAnimation.stop();
    containerLoader.style.display = "none";

    backLink.style.pointerEvents = "auto";
    backLink.style.opacity = "1";
    alert("Ошибка сети");
  };

  xhr.send(formData);
});
