//////////////// Version and News ////////////////

const version = "0.0.1z";
const lnk = "https://open-os.netlify.app";

list =
[
"Modification du noyeau",
"Nouveau systeme de fenetre",
];

//////////////////////////////////////////////////


const loader = document.querySelector("#loader")
window.addEventListener("load", () => {
  loader.classList.add("loader-out");
  setTimeout(() => {
    loader.remove()
  }, 400);
});




function isMobile() {
  if( (navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i))
    ) return true;
  else return false;
}

const dlBtn = document.querySelector(".dl-btn");

if (dlBtn.className.search(/disabled/g) !== -1){
  dlBtn.innerHTML = "INDISPONIBLE";
}

const menuBar = document.querySelector("#changelog>div.text-container");

let news;
for (let i = 0; i !== list.length; i++) {
  if (news === undefined) news = "<li>" + list[i] + "</li>\n";
  else news += "<li>" + list[i] + "</li>\n";
}

menuBar.innerHTML = `
    <h1>Journal des modifications.</h1>
    <ul>
      ` +
  news
  + `
    </ul>
    `

let clicked = false;

const verP = document.querySelector(".ver");

function dl() {
  if (dlBtn.className.search(/disabled/g) !== -1) return;
  else if( isMobile() === true ){
    dlBtn.remove();
    verP.innerHTML = `
    <h1>Attention !</h1>
    <br>
    <p>OPEN OS ne fonction pas sur mobile.
    Voulez vous quand même y accéder ?</p>
    <p>Si oui cliquez sur "ACCÉDER" ci-dessous.</p>
    <br>
    <a class="dlLink" href="${lnk}">ACCÉDER</a>
    <style>
      .dlLink {
        background: #333;
        padding: 10px;
        border-radius: 25px;
        color: #fff;
        text-decoration: none;
      }
      div.ver {
        background: #fff5;
        border-radius: 25px;
        color: #333;
        padding: 20px;
      }
    </style>
    `;
  }
  else {
    dlBtn.href = lnk;
  }
}

verP.innerHTML = "Version " + version;

let navBar = document.querySelector("nav");
let dmBtn = document.querySelector(".dark-mode-btn");
let items = document.querySelector("items");
let link = document.querySelector("tablink");

window.addEventListener("scroll", () => {
  if (window.innerWidth > 1000) {
    if (document.documentElement.scrollTop >= (window.innerHeight / 4)) {
      navBar.style.background = "#1A6699";
      navBar.style.width = "50px";
      navBar.style.height = "400px";
      navBar.style.top = "50%";
      navBar.style.transform = "translateY(-50%)";
      navBar.style.borderRadius = "25px";
      navBar.style.left = "10px";
    } else {
      navBar.style.background = "linear-gradient(to right,#fff5, #0000)";
      navBar.style.width = "100px";
      navBar.style.height = "100vh";
      navBar.style.borderRadius = null;
      navBar.style.left = "0";
    }
  } else {
    navBar.style.background = null;
    navBar.style.width = null;
    navBar.style.height = null;
    navBar.style.top = null;
    navBar.style.transform = null;
    navBar.style.borderRadius = null;
    navBar.style.left = null;
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1000) {
    if (document.documentElement.scrollTop >= (window.innerHeight / 4)) {
      navBar.style.background = "#1A6699";
      navBar.style.width = "50px";
      navBar.style.height = "400px";
      navBar.style.top = "50%";
      navBar.style.transform = "translateY(-50%)";
      navBar.style.borderRadius = "25px";
      navBar.style.left = "10px";
    } else {
      navBar.style.background = "linear-gradient(to right,#fff5, #0000)";
      navBar.style.width = "100px";
      navBar.style.height = "100vh";
      navBar.style.borderRadius = null;
      navBar.style.left = "0";
    }
  } else {
    navBar.style.background = null;
    navBar.style.width = null;
    navBar.style.height = null;
    navBar.style.top = null;
    navBar.style.transform = null;
    navBar.style.borderRadius = null;
  }
});

function toggleDarkMode() {
  dmBtn.classList.toggle("dm-btn-on");
  document.querySelector("#main").classList.toggle("dark-mode-2");
  for (var i = 0; i < document.querySelectorAll("#section2>div.container").length; i++) {
    document.querySelectorAll("#section2>div.container")[i].classList.toggle("dark-mode-2");
  }
  for (var i = 0; i < document.querySelectorAll("#section2>div.container:nth-child(2n+1)").length; i++) {
    document.querySelectorAll("#section2>div.container:nth-child(2n+1)")[i].classList.toggle("dark-mode");
  }
  for (var i = 0; i < document.querySelectorAll("#section2>div.container:nth-child(2n+1)>.desc-img").length; i++) {
    document.querySelectorAll("#section2>div.container:nth-child(2n+1)>.desc-img")[i].classList.toggle("dark-mode-4");
  }
  document.querySelector("nav").classList.toggle("dark-mode-3");
}
