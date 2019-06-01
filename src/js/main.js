window.addEventListener("DOMContentLoaded", event => {
  const body = document.querySelector("body");

  (localStorage.getItem("mode") || "dark") === "night"
    ? body.classList.add("night")
    : body.classList.remove("night");

  const themeSwitcher = document.getElementById("theme-switcher");

  if (themeSwitcher) {
    themeSwitcher.addEventListener("click", () => {
      body.classList.toggle("night");
    });
  }

  console.log(
    "%c Hi👋🏼 Looking for something or someone ? 👀 ",
    "font-size: 1.5rem; font-weight: bold;"
  );
});
