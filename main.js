(() => {
  document.documentElement.classList.add("js");

  const languageButton = document.querySelector("#language");
  const menuButton = document.querySelector("#menu-toggle");
  const menu = document.querySelector("#site-menu");
  const siteHeader = document.querySelector(".site-header");
  const motto = document.querySelector(".motto");
  const mottoText = document.querySelector("#motto-text");
  let language = "en";

  function animateMotto() {
    if (!motto || !mottoText) return;

    const text = motto.getAttribute("aria-label") || mottoText.textContent;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      mottoText.textContent = text;
      return;
    }

    mottoText.textContent = "";
    let index = 0;

    const eraseNext = () => {
      index -= 1;
      mottoText.textContent = text.slice(0, index);
      if (index > 0) {
        window.setTimeout(eraseNext, 32);
      } else {
        window.setTimeout(typeNext, 450);
      }
    };

    const typeNext = () => {
      index += 1;
      mottoText.textContent = text.slice(0, index);

      if (index < text.length) {
        const delay = text[index - 1] === "." ? 180 : 55;
        window.setTimeout(typeNext, delay);
      } else {
        window.setTimeout(eraseNext, 1400);
      }
    };

    window.setTimeout(typeNext, 350);
  }

  function renderLanguage() {
    document.documentElement.lang = language === "en" ? "en" : "zh-Hant";
    document.querySelectorAll("[data-en][data-zh]").forEach((element) => {
      element.textContent = element.dataset[language];
    });
    document.querySelectorAll("[data-placeholder-en][data-placeholder-zh]").forEach((element) => {
      element.placeholder = element.dataset[`placeholder${language === "en" ? "En" : "Zh"}`];
    });
    languageButton.textContent = language === "en" ? "中文" : "English";
    languageButton.setAttribute("aria-label", language === "en" ? "切換至中文" : "Switch to English");
  }

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    const symbol = menuButton.querySelector("[aria-hidden]");
    if (symbol) symbol.textContent = open ? "−" : "＋";
  }

  renderLanguage();
  animateMotto();
  languageButton.hidden = false;

  languageButton.addEventListener("click", () => {
    language = language === "en" ? "zh" : "en";
    renderLanguage();
  });

  menuButton.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a[href^='#']").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const updateHeader = () => siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const sectionLinks = [...menu.querySelectorAll("a[href^='#']")];
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const updateActiveSection = () => {
    const readingLine = window.scrollY + window.innerHeight * .28;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.offsetTop <= readingLine) current = section;
    });
    sectionLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
    });
  };
  updateActiveSection();
  window.addEventListener("scroll", updateActiveSection, { passive: true });
})();
