window.addEventListener("load", () => {






  // =========================================================
  // GALLERY INIT
  // =========================================================

  const items =
    Array.from(document.querySelectorAll(".cards li"));

  if (items.length) {
    initGallery(items);
  }

  // =========================================================
  // PROJECT ROWS INIT
  // =========================================================

  const projectLinks =
    document.querySelectorAll(".project-link");

  if (projectLinks.length) {
    initProjectRows(projectLinks);
  }

});


// =========================================================
// GALLERY
// =========================================================

function initGallery(items) {

    const GAP =
   window.innerWidth < 768
    ? 40
    : 100;  

    const ease = 0.14;

  let widths = [];
  let positions = [];
  let totalWidth = 0;

  let progress = 0;
  let target = 0;

  window.featuredProjectOpen = false;

  // -------------------------
  // MEASURE
  // -------------------------

  function measure() {

    widths =
      items.map(el => el.getBoundingClientRect().width);

    positions = [];
    totalWidth = 0;

    for (let i = 0; i < items.length; i++) {

      positions[i] = totalWidth;

      totalWidth += widths[i] + GAP;

    }

  }

  measure();

console.log("WIDTHS", widths);
console.log("TOTAL", totalWidth);

  window.addEventListener("resize", measure);

  // -------------------------
  // RENDER
  // -------------------------

  function render() {

    progress += (target - progress) * ease;

    let x = progress % totalWidth;

    if (x > 0) x -= totalWidth;

    const buffer = window.innerWidth * 0.5;

    const leftEdge = -buffer;
    const rightEdge = window.innerWidth + buffer;

    for (let i = 0; i < items.length; i++) {

      let xPos = positions[i] + x;

      while (xPos < leftEdge) {
        xPos += totalWidth;
      }

      while (xPos > rightEdge) {
        xPos -= totalWidth;
      }

      items[i].style.transform =
        `translate3d(${xPos}px, -50%, 0)`;

    }

    requestAnimationFrame(render);

  }

  render();

  // -------------------------
  // SCROLL
  // -------------------------

  window.addEventListener(
    "wheel",
    (e) => {

      if (window.featuredProjectOpen) return;

      target += e.deltaY + e.deltaX;

      clearTimeout(window.snapTimeout);

      window.snapTimeout =
        setTimeout(snapToNearest, 120);

    },
    { passive: true }
  );

  let touchX = 0;

window.addEventListener("touchstart", (e) => {
  touchX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener("touchmove", (e) => {

  if (window.featuredProjectOpen) return;

  const currentX = e.touches[0].clientX;

  target += (touchX - currentX);

  touchX = currentX;

}, { passive: true });

  // -------------------------
  // SNAP
  // -------------------------

  function snapToNearest() {

    let closest = null;
    let closestDistance = Infinity;

    items.forEach((el) => {

      const rect = el.getBoundingClientRect();

      const center =
        rect.left + rect.width / 2;

      const distance =
        Math.abs(center - window.innerWidth / 2);

      if (distance < closestDistance) {

        closestDistance = distance;
        closest = el;

      }

    });

    if (!closest) return;

    const rect = closest.getBoundingClientRect();

    const delta =
      rect.left +
      rect.width / 2 -
      window.innerWidth / 2;

    target = progress + delta * 0.35;

  }




  //=========
  // HOME
  //=======

  let activeCard = null;

  document.addEventListener("click", (e) => {

  const card = e.target.closest(".card");

  if (!card) return;

  // activate new card

  if (activeCard !== card) {

    document
      .querySelectorAll(".card")
      .forEach(el => el.classList.remove("active"));

    card.classList.add("active");

    activeCard = card;

    return;
  }

  // already active

  cycleCard(card);

});

  function cycleCard(card) {

  const images =
    [...card.querySelectorAll(".card-media img")];

  if (images.length <= 1) return;

  let current =
    images.findIndex(img =>
      img.classList.contains("active")
    );

  images[current]
    .classList.remove("active");

  current++;

  if (current >= images.length) {
    current = 0;
  }

  images[current]
    .classList.add("active");
}

}




// =========================================================
// PROJECT ROW EXPANSION
// =========================================================

function initProjectRows(projectLinks) {

  projectLinks.forEach((link) => {

    link.addEventListener("click", async (e) => {

      e.preventDefault();

      const project =
        link.closest(".project");

      if (!project) return;

      const expand =
        project.querySelector(".project-expand");

      if (!expand) return;

      // CLOSE OTHERS

      document.querySelectorAll(".project")
        .forEach((item) => {

          if (item !== project) {

            item.classList.remove("active");

            const other =
              item.querySelector(".project-expand");

            if (!other) return;

            gsap.to(other, {
              height: 0,
              duration: 0.5,
              ease: "power2.inOut",
              onComplete: () => {
                other.innerHTML = "";
              }
            });

          }

        });

      // TOGGLE CLOSE

      if (project.classList.contains("active")) {

        project.classList.remove("active");

        gsap.to(expand, {
          height: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            expand.innerHTML = "";
          }
        });

        return;

      }

      project.classList.add("active");

      // FETCH PAGE

      const res = await fetch(link.href);

      const html = await res.text();

      const doc =
        new DOMParser().parseFromString(html, "text/html");

      const content =
        doc.querySelector(".project-page");

      if (!content) return;

      expand.innerHTML = content.innerHTML;

      gsap.set(expand, {
        height: "auto"
      });

      const height =
        expand.offsetHeight;

      gsap.set(expand, {
        height: 0
      });

      gsap.to(expand, {
        height,
        duration: 0.7,
        ease: "power2.inOut"
      });

    });

  });

}


let lightboxImages = [];
let lightboxIndex = 0;

const lightbox =
  document.querySelector("#lightbox");

const lightboxImage =
  document.querySelector(".lightbox-image");

const lightboxCounter =
  document.querySelector(".lightbox-counter");

  document.addEventListener("click", (e) => {

const media = e.target.closest(
  ".project-images img, .project-images video"
);

if (!media) return;

const gallery =
  media.closest(".project-images");

if (!gallery) return;

lightboxImages =
  [...gallery.querySelectorAll("img, video")];

lightboxIndex =
  lightboxImages.indexOf(media);

openLightbox();

});

  function openLightbox() {

  updateLightbox();

  lightbox.classList.add("open");

}

function updateLightbox() {

  const current =
    lightboxImages[lightboxIndex];

  if (!current) return;

  if (current.tagName === "VIDEO") {

    lightboxImage.innerHTML = `
      <video
        autoplay
        muted
        loop
        playsinline
        controls
      >
        <source src="${current.currentSrc || current.src}">
      </video>
    `;

  } else {

    lightboxImage.innerHTML = `
      <img src="${current.src}" alt="">
    `;

  }

  lightboxCounter.textContent =
    `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

document.querySelector(".lightbox-next")
  ?.addEventListener("click", () => {

    lightboxIndex++;

    if (lightboxIndex >= lightboxImages.length) {
      lightboxIndex = 0;
    }

    updateLightbox();

  });

  document.querySelector(".lightbox-prev")
  ?.addEventListener("click", () => {

    lightboxIndex--;

    if (lightboxIndex < 0) {
      lightboxIndex =
        lightboxImages.length - 1;
    }

    updateLightbox();

  });

  function closeLightbox() {

  lightbox.classList.remove("open");

}

document.querySelector(".lightbox-close")
  ?.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {

  if (e.key === "Escape") {
    closeLightbox();
  }

});

  document.addEventListener("keydown", (e) => {

  if (!lightbox.classList.contains("open")) return;

  if (e.key === "ArrowRight") {
    document
      .querySelector(".lightbox-next")
      ?.click();
  }

  if (e.key === "ArrowLeft") {
    document
      .querySelector(".lightbox-prev")
      ?.click();
  }

});


  // -------------------------
// ABOUT PANEL
// -------------------------

const aboutButton = document.querySelector('[data-panel="about"]')
const aboutClose = document.querySelector('.about-close')

function openAbout(){
  document.body.classList.add("about-open")
  //pauseGallery()
}

function closeAbout(){

  const panel = document.querySelector(".panel-about")

  document.body.classList.add("about-closing")
  document.body.classList.remove("about-open")

  // allow browser to render solid state first
  requestAnimationFrame(() => {
    panel.classList.add("panel-fade-out")
  })

  setTimeout(()=>{
    document.body.classList.remove("about-closing")
    panel.classList.remove("panel-fade-out")
  },350)

  //resumeGallery()

}


aboutButton?.addEventListener("click", () => {

  if(document.body.classList.contains("about-open")){
    closeAbout()
  } else {
    openAbout()
  }

})

aboutClose?.addEventListener("click", closeAbout)

document.addEventListener("keydown",(e)=>{

  if(e.key === "Escape"){
    closeAbout()
  }

})

aboutClose?.addEventListener("click", (e) => {
  console.log("CLOSE CLICKED");
  closeAbout();
});


// -------------------------
// CATEGORY FILTERS
// -------------------------

const filterButtons =
  document.querySelectorAll("[data-filter]");


function applyCategoryFilter(category) {

  document.querySelectorAll(".project").forEach(project => {

    const projectCategory = project.dataset.category;

    const show =
      !category ||
      category === "all" ||
      projectCategory === category;

    if (show) {

      project.style.display = "";

      requestAnimationFrame(() => {
        project.classList.remove("is-hidden");
      });

    } else {

      project.classList.add("is-hidden");

      setTimeout(() => {
        if (project.classList.contains("is-hidden")) {
          project.style.display = "none";
        }
      }, 250);

    }

  });

}

function syncActiveFilterButton(category) {

  document.querySelectorAll("[data-filter]").forEach(btn => {

    const isActive =
      btn.dataset.filter === (category || "all");

    btn.classList.toggle("active", isActive);

  });

}

function runHashFilter() {

  const category =
    window.location.hash
      .replace("#", "")
      .toLowerCase();

  applyCategoryFilter(category);
  syncActiveFilterButton(category);

}

runHashFilter();

window.addEventListener("hashchange", runHashFilter);



filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    const filter = button.dataset.filter;

    if (filter === "all") {
      window.location.hash = "";
    } else {
      window.location.hash = filter;
    }

  });

});


