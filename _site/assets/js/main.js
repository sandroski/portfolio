window.addEventListener("load", () => {

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
  "#archive .project-images img, #archive .project-images video"
);

if (!media) return;

const gallery =
  media.closest("#archive .project-images");

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




  // -------------------
  // PRESENTATION MODE 
  //--------------------


  let currentPresentation = 0;


async function renderPresentation() {

  const container =
    document.querySelector("#presentation-mode");

  container.innerHTML = "";

  currentPresentation = 0;

  const projects =
  [...document.querySelectorAll(".project")]

    .filter(project => project.dataset.presentation)

    .sort((a, b) =>

      Number(a.dataset.presentation) -
      Number(b.dataset.presentation)

    );

      for (const project of projects) {

  const link =
    project.querySelector(".project-link");

  const res =
    await fetch(link.href);

  const html =
    await res.text();

  const doc =
    new DOMParser()
      .parseFromString(html, "text/html");

  const page =
    doc.querySelector(".project-page");

  const section =
    document.createElement("section");

  section.className =
    "presentation-project";

  section.appendChild(page);

  container.appendChild(section);

}

const slides =
  container.querySelectorAll(".presentation-project");

if (slides.length) {

  slides[0].classList.add("is-active");

}

container.onclick = () => {

  const slides =
    container.querySelectorAll(".presentation-project");

  slides[currentPresentation]
    .classList.remove("is-active");

  currentPresentation++;

if (currentPresentation >= slides.length) {

  clearPresentation();

  window.location.hash = "all";

  return;

}

slides[currentPresentation]
  .classList.add("is-active");

  slides[currentPresentation]
    .classList.add("is-active");

};

}



function clearPresentation() {

  const container =
    document.querySelector("#presentation-mode");

  container.innerHTML = "";

}

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

    const projectCategories =
  project.dataset.categories
    .split(",")
    .map(c => c.trim().toLowerCase());

    const show =
  !category ||
  category === "all" ||
  projectCategories.includes(category);

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

  if (!document.querySelector(".work")) return;

  const category =
    window.location.hash
      .replace("#", "")
      .toLowerCase();

  if (category === "selected") {

    renderPresentation();

  } else {

    clearPresentation();

    applyCategoryFilter(category);

  }

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




/*----------------------------
HOME / WORLD / CAMERA / NODES
------------------------------*/


let moved = false;
let activeNode = null;

let swipeStartX = 0;
let swipeStartY = 0;

let previousCamera = null;



const nodes = document.querySelectorAll(".project-node");

const isMobile =
  window.innerWidth < 768;

nodes.forEach(node => {

  const x = Number(
    isMobile
      ? node.dataset.mobileX
      : node.dataset.x
  );

  const y = Number(
    isMobile
      ? node.dataset.mobileY
      : node.dataset.y
  );

  node.style.left = `${x}px`;
  node.style.top = `${y}px`;

});

gsap.set(".project-node", {
  opacity: 0,
  scale: 0.9,
  y: 30
});

gsap.to(".project-node", {
  opacity: 1,
  scale: 1,
  y: 0,
  duration: 1,
  ease: "power2.out",
  stagger: {
    each: 0.1,
    from: "random"
  }
});

nodes.forEach(node => {

  node.addEventListener("click", focusNode);

});

function focusNode(e) {

  e.preventDefault();
  world.classList.add("world-focused");

  const node = e.currentTarget;

  if (activeNode === node) {

  cycleProject(node);


  return;



}

previousCamera = {

  x: cameraX,
  y: cameraY

};






  document
    .querySelectorAll(".project-node")
    .forEach(n => n.classList.remove("active"));

  node.classList.add("active");

  activeNode = node;

  const meta =
  document.querySelector(".project-meta");

  meta.querySelector(".meta-title").textContent =
  "Title:" + node.dataset.title || "";



  meta.querySelector(".meta-label").textContent =
  "Type: " + node.dataset.label || "";

  meta.querySelector(".meta-description").textContent =
  node.dataset.description || "";



  const totalImages =
  node.querySelectorAll(
    ".project-gallery img"
  ).length;

meta.querySelector(".meta-count").textContent =
  `1 / ${totalImages}`;

  meta.classList.add("visible");



  const rect = node.getBoundingClientRect();

  const nodeCenterX =
    rect.left + rect.width / 2;

  const nodeCenterY =
    rect.top + rect.height / 2;

  const viewportCenterX =
    window.innerWidth / 2;

  const viewportCenterY =
    window.innerHeight / 2;

  targetX += viewportCenterX - nodeCenterX;
  targetY += viewportCenterY - nodeCenterY;

  document
    .querySelector(".focus-close")
    .classList.add("visible");

}

const closeButton =
  document.querySelector(".focus-close");

closeButton.addEventListener("click", () => {

  if (!activeNode) return;

  world.classList.remove("world-focused");

  activeNode.classList.remove("active");

  activeNode = null;

  closeButton.classList.remove("visible");

  document
  .querySelector(".project-meta")
  .classList.remove("visible");

  setTimeout(() => {

  targetX = previousCamera.x;
  targetY = previousCamera.y;

}, 250);

});





const world = document.querySelector("#world");



let cameraX = -200;
let cameraY = -100;

let targetX = cameraX;
let targetY = cameraY;



if (window.innerWidth < 768) {

  cameraX =  -100;
  cameraY = -100;

  targetX = cameraX;
  targetY = cameraY;

}


function renderWorld() {

  if (!dragging) {

    targetX += velocityX;
    targetY += velocityY;

    velocityX *= 0.90;
    velocityY *= 0.90;

  }

  cameraX += (targetX - cameraX) * 0.08;
  cameraY += (targetY - cameraY) * 0.08;

  world.style.transform =
    `translate3d(${cameraX}px, ${cameraY}px, 0)`;

  requestAnimationFrame(renderWorld);

}



let dragging = false;

let startX = 0;
let startY = 0;

let velocityX = 0;
let velocityY = 0;

renderWorld();


const viewport = document.querySelector("#viewport");

viewport.addEventListener("mousedown", (e) => {


  dragging = true;
  //moved = false;


  startX = e.clientX;
  startY = e.clientY;

});


window.addEventListener("mousemove", (e) => {

  if (!dragging) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  targetX += dx;
  targetY += dy;

  velocityX = dx;
  velocityY = dy;

  startX = e.clientX;
  startY = e.clientY;

  if (
  Math.abs(dx) > 5 ||
  Math.abs(dy) > 5
) {
  moved = true;
}

});

window.addEventListener("mouseup", () => {

  dragging = false;

});



viewport.addEventListener("touchstart", (e) => {

  if (activeNode) return;

  dragging = true;

  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;

});

window.addEventListener("touchstart", (e) => {

  if (!activeNode) return;

  swipeStartX = e.touches[0].clientX;
  swipeStartY = e.touches[0].clientY;

}, { passive: true });



window.addEventListener("touchmove", (e) => {

  if (!dragging) return;

  if (activeNode) return;

  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;

  const dx = x - startX;
  const dy = y - startY;

  targetX += dx;
  targetY += dy;

  velocityX = dx;
  velocityY = dy;

  startX = x;
  startY = y;

}, { passive: true });

window.addEventListener("touchend", (e) => {

  dragging = false;

  if (!activeNode) return;



  const endX =
    e.changedTouches[0].clientX;

  const endY =
    e.changedTouches[0].clientY;

  const dx = endX - swipeStartX;
  const dy = endY - swipeStartY;

  if (Math.abs(dx) < 50) return;

  if (Math.abs(dx) < Math.abs(dy)) return;

if (dx < 0) {

  cycleProject(activeNode);

} else {

  cycleProjectReverse(activeNode);

}

});

function cycleProject(node) {

  const media =
    [...node.querySelectorAll("img, video")];

  if (media.length <= 1) return;

  let current =
    media.findIndex(el =>
      el.classList.contains("active")
    );

  const previous = current;

  media[previous]
    .classList.remove("active");

  if (media[previous].tagName === "VIDEO") {
    media[previous].pause();
  }

  current++;

  if (current >= media.length) {
    current = 0;
  }

  media[current]
    .classList.add("active");

  if (media[current].tagName === "VIDEO") {
    media[current].play();
  }

  document
    .querySelector(".meta-count")
    .textContent =
      `${current + 1} / ${media.length}`;

}

function cycleProjectReverse(node) {

  const media =
    [...node.querySelectorAll("img, video")];

  if (media.length <= 1) return;

  let current =
    media.findIndex(el =>
      el.classList.contains("active")
    );

  media[current]
    .classList.remove("active");

  if (media[current].tagName === "VIDEO") {
    media[current].pause();
  }

  current--;

  if (current < 0) {
    current = media.length - 1;
  }

  media[current]
    .classList.add("active");

  if (media[current].tagName === "VIDEO") {
    media[current].play();
  }

  document
    .querySelector(".meta-count")
    .textContent =
      `${current + 1} / ${media.length}`;

}






