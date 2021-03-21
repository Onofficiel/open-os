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

const version = "0.0.1z";

list =
[
"Création du systeme.",
"Ajout du systeme de fenêtre.",
"Ajout du systeme d'identifiant de fenêtre.",
"Création du logo de chargement du site."
];

const dlBtn = document.querySelector(".dl-btn");

if (dlBtn.className.search(/disabled/g) !== -1){
  dlBtn.innerHTML = "INDISPONIBLE";
} else {
  dlBtn.href = "#section2";
}

let wasToggled = false;
window.addEventListener("resize", () => {
  if (window.innerWidth <= 1440) {
    document.querySelector("nav").classList.remove("toggled");
  }
  else if (wasToggled === true) {
    document.querySelector("nav").classList.add("toggled");
  }
})

const menuBar = document.querySelector("#section2");

let clicked = false;

function show() {
    menuBar.classList.toggle("toggled");
    document.querySelector("#section1").classList.toggle("toggled");
    document.querySelector("nav").classList.toggle("toggled");
    if (wasToggled === false) {
      wasToggled = true;
    } else {
      wasToggled = false;
    }
}


function menu(menuName) {
  if (menuBar.className.search(/toggled/g) !== -1) return;

  if (menuName === "changelog") {
    let news;
    for (let i = 0; i !== list.length; i++) {
      if (news === undefined) news = "<li>" + list[i] + "</li>\n";
      else news += "<li>" + list[i] + "</li>\n";
    }

    menuBar.innerHTML = `
    <h1>Journal des modifications.</h1>
    <hr>
    <ul>
      ` +
      news
      + `
    </ul>
    `;
  }
  if (menuName === "about") {
    menuBar.innerHTML = `
    <h1>A propos d'Open OS...</h1>
    <hr>
    <p>Open OS est un systeme d'exploitation (en cours de creation) disponible sur le web ! Il vous suffit d'un navigateur pour le faire fonctionner.</p>
    `;
  }
  if (menuName === "use") {
    let arrow = "←";
    if (isMobile() === true) arrow = "↑";
    menuBar.innerHTML = `
    <h1>Comment l'utiliser ?</h1>
    <hr>
    <p>Pour utiliser Open OS, c'est un petit peu plus complexe que de simplement cliquer sur une icone !</p>
    <h2>1.</h2>
    <p>Télécharger le fichier zip.<br>(` + arrow + ` C'est juste ici !)</p>
    <h2>2.</h2>
    <p>Allez retrouver le fichier Téléchargé sur votre ordinateur et décompressez le.</p>
    <h2>3.</h2>
    <p>Ouvrer le dossier "OpenOS" et cliquer sur "OpenOS.html"</p>
    `;
  }
  if (menuName === "contact") {
    menuBar.innerHTML = `
    <h1>Nous contacter.</h1>
    <hr>
    <p>Vous pouvez nous contacter :</p>
    <br>
    <a href="https://discord.gg/TaSbZGf9CB" style="color: #5C5C5C;">Par Discord</a>
    <a href="mailto:contact.openos@gmail.com" style="color: #5C5C5C;">Ou par Mail</a>
    `;
  }
  if (menuName === "download") {
    if (dlBtn.className.search(/disabled/g) !== -1) return;
    else if( isMobile() === true
    && clicked === false
    ){
      menuBar.innerHTML = `
      <h1>Attention !</h1>
      <hr>
      <p>OPEN OS ne fonction pas sur mobile.</p>
      <br>
      <p>Voulez vous quand même le télécharger ?</p>
      <br>
      <p>Si oui recliquez sur "télécharger".</p>
      `;
      clicked = true;
    }
    else {
      menu("changelog");
      dlBtn.href = `os-dl/OpenOS-${version}.zip`;
    }

  }

}
menu("changelog");

const verP = document.querySelector(".ver");
verP.innerHTML = "Version " + version;
