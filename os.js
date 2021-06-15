const os =
{
	"user":
	{
		"app": "test"
	},
	"system":
	{
		"window":
		{
			"create":
				(win) => {
					if (os.system.config.currentId.indexOf(win.Id) !== -1) {
						console.error("Une fenêtre avec le même ID existe déjà.");
						os.system.window.error("Une fenêtre avec le même ID existe déjà.");
						return;
					}
					if (!win.content) {
						console.error("Veillez spécifier un contenu.");
						os.system.window.error("Veillez spécifier un contenu.");
						return;
					}
					if (typeof (win.content) !== "string") {
						console.error("Veuillez spécifier le contenu entre guillemets");
						os.system.window.error("Veuillez spécifier le contenu entre guillemets");
						return;
					}
					if (win.width < os.system.config.windowMinSize || win.width > window.innerWidth) {
						console.error("Veuiller donner une valeur de largeur plus grande que 149 et plus petite que " + window.innerWidth + ".");
						os.system.window.error("Veuiller donner une valeur de largeur plus grande que 149 et plus petite que " + window.innerWidth + ".");
						return;
					}
					if (win.height < os.system.config.windowMinSize || win.height > window.innerHeight) {
						console.error("Veuiller donner une valeur de hauteur plus grande que 149 et plus petite que " + window.innerHeight + ".");
						os.system.window.error("Veuiller donner une valeur de hauteur plus grande que 149 et plus petite que " + window.innerHeight + ".");
						return;
					}
					if (!win.id) {
						win.id = "id" + os.system.config.idMaker;
					}
					if (win.id.search(/^[a-z]+([0-9]|[a-z])*/i) === -1) {
						console.error("Veuillez spécifier un ID composé de lettres et de lettres seulement (et commencant par une lettre).");
						os.system.window.error("Veuillez spécifier un ID composé de lettres et de lettres seulement (et commencant par une lettre).");
						return;
					}
					if (win.content.search(/<\/?(style|script)(\s+.*)?>/gi) !== -1) {
            console.error("Pour des raisons de sécurité veuillez ajouter le script et le style dirrectement au balises voulu.");
						os.system.window.error("Pour des raisons de sécurité veuillez ajouter le script et le style dirrectement au balises voulu.");
						return;
					}
					if (typeof (win.id) !== "string") {
						console.error("Veillez spécifier l'ID entre guillemets.");
						os.system.window.error("Veillez spécifier l'ID entre guillemets.");
						return;
					}

					os.system.config.currentId.push(win.id);
					os.system.config.currentWin = win.id;
					os.system.config.idMaker++;

					var creatingWin = document.createElement("div");

					creatingWin.style.width = win.width + "px";
					creatingWin.style.height = win.height + "px";

					creatingWin.innerHTML = win.content;

					creatingWin.classList.add("window");
					creatingWin.id = win.id;

					document.body.append(creatingWin);

					let createdWin = document.querySelector(`.window#${win.id}`);

					var creatingSideBar = document.createElement("div");

					creatingSideBar.classList.add("sideBar");
					creatingSideBar.id = win.id;
					creatingSideBar.onmousedown = function () { os.system.select(this); };

					createdWin.appendChild(creatingSideBar);

					let createdSideBar = document.querySelector(`.sideBar#${win.id}`);

					var creatingCloseBtn = document.createElement("div");

					creatingCloseBtn.classList.add("closeBtn");
					creatingCloseBtn.id = win.id;

					creatingCloseBtn.innerHTML = "&#10005";

					creatingCloseBtn.addEventListener("click", () => {
						os.system.window.close(win.id);
					});

					createdSideBar.appendChild(creatingCloseBtn);

					if (win.isResizable === false) {
  					os.system.dragBar(document.querySelector(`.sideBar#${win.id}`), document.querySelector(`.window#${win.id}`));

  					return console.log("Executé avec succès.");
					} else {
						var creatingResizer = document.createElement("div");

						creatingResizer.classList.add("resizer");
						creatingResizer.id = win.id;

						createdWin.appendChild(creatingResizer);

  					os.system.dragBar(document.querySelector(`.sideBar#${win.id}`), document.querySelector(`.window#${win.id}`));

  					return console.log("Executé avec succès.");
					}

				},
			"close":
				(winId) => {
					if (typeof (winId) !== "string") {
						return console.error("Veillez spécifier l'ID entre guillemets.");
					}
					let closingWin = document.querySelector(`.window#${winId}`);
					if (os.system.config.currentId.indexOf(winId) !== -1) {
						closingWin.remove();
						const index = os.system.config.currentId.indexOf(winId);

						if (index > -1) {
							os.system.config.currentId.splice(index, 1);
						}
						console.log("Executé avec succès.");
					}
					else {
						console.error("Cette ID n'existe pas.");
						return;
					}
				},
			"list":
				() => {
					console.log(os.system.config.currentId);
				},
			"error":
			  (errType) => {
						os.system.window.create({
						  "content": `
						  <div style="background-color: #ff6868;
                      width: 100%;
                      height: 100%;">
          <span style="font-size:100px;
                      position: absolute;
                      left: 50%;
                      top: 30%;
                      transform: translate(-150%, -50%);
                      color: #fff;">&#9888;</span>
          <h2 style="color: #fff;
                     position: absolute;
                     left: 60%;
                     top: 30%;
                     transform: translate(-50%, -50%);">Une erreur<br>est survenue.</h2>
          <p style="color: #fff;
                     position: absolute;
                     left: 50%;
                     top: 60%;
                     transform: translateX(-50%);
                     padding: 5px:">${errType}</p>
          </div>
						  `,
						  "isResizable": false,
						  "width": 550,
						  "height": 250
						});
			  }
		},
		"dragBar":
			(elem, elem2) => {
				elem.addEventListener("mousedown", mousedown);

				function mousedown(e) {
					let prevX = e.clientX;
					let prevY = e.clientY;

					window.addEventListener("mousemove", mousemove);
					window.addEventListener("mouseup", mouseup);


					function mousemove(e) {
						let newX = prevX - e.clientX;
						let newY = prevY - e.clientY;

						const rect = elem.getBoundingClientRect();

						elem2.style.left = rect.left - newX + "px";
						elem2.style.top = rect.top - newY + "px";

						prevX = e.clientX;
						prevY = e.clientY;
					}

					function mouseup() {
						window.removeEventListener("mouseup", mouseup);
						window.removeEventListener("mousemove", mousemove);
					}
				}

				const resizers = document.querySelectorAll(".resizer");
				let cResizer;

				for (let resizer of resizers) {
					resizer.addEventListener("mousedown", mousedown);

					function mousedown(e) {
						cResizer = e.target;

						prevX = e.clientX;
						prevY = e.clientY;

						window.addEventListener("mousemove", mousemove);
						window.addEventListener("mouseup", mouseup);

						function mousemove(e) {
							const rect = elem2.getBoundingClientRect();

							elem2.style.width = rect.width - (prevX - e.clientX) + "px";
							elem2.style.height = rect.height - (prevY - e.clientY) + "px";

							prevX = e.clientX;
							prevY = e.clientY;
						}
						function mouseup() {
							window.removeEventListener("mousemove", mousemove);
							window.removeEventListener("mouseup", mouseup);
						}
					}
				}
			},
		"select":
			(elem) => {
				if (os.system.config.selected !== null) {
					os.system.config.selected.classList.remove("current");
					try {
						document.querySelector(`.window#${os.system.config.selected.id}`).style.zIndex = null;
					} catch { };
				}
				os.system.config.selected = elem;
				os.system.config.selected.classList.add("current");
				document.querySelector(`.window#${os.system.config.selected.id}`).style.zIndex = "1";
				document.title = "Open OS - " + os.system.config.currentWin;
			},
		"cursorMove":
		  () => {
		    const cursor = document.querySelector("#cursor");
		    window.addEventListener("mousemove", (e) => {
		      cursor.style.top = e.clientY + "px";
		      cursor.style.left = e.clientX + "px";
		    });
		  },
		"config":
		{
			"currentWin": null,
			"selected": null,
			"currentId": [],
			"windowMinSize": 200,
			"idMaker": 0
		},
		"bootloader":
			() => {
				if (!localStorage.getItem("AlreadyConnected")) {
					localStorage.setItem("AlreadyConnected", true);
					os.system.window.create({
					"content": `
            <div class="win" style="
                  background-color: #333;
                  width: 100%;
                  height: 100%;
                  color: #fff;
                  text-align: center;">
              <h1>Bienvenue !</h1>
              <hr style="
                  width: 30%;
                  display: inline-block;">
              <p>Il parait que c'est la première fois que vous utiliser ce système.<br><br>Je vous présente ?</p>
              <br><br>
              <button style="width: 80px;
                             height: 30px;
                             color: #333;
                             font-weight: 900;">Oui</button>
              <button style="width: 80px;
                             height: 30px;
                             color: #333;
                             font-weight: 900;">Non</button>
            <div>
          `,
			    "height": 300,
			    "width": 400,
			    "isResizable": false
					});
				};
				if (!localStorage.getItem("userStorage")) {
					localStorage.setItem("userStorage", os.user);
					console.log(localStorage.getItem("userStorage"));
				}

				var creatingDock = document.createElement("div");

				creatingDock.classList.add("dock");

				document.body.append(creatingDock);

				var creatingStyle = document.createElement("style");

				creatingStyle.innerHTML = `
/* Windows config */

.window, .sideBar, .closeBtn{
  position:         absolute;
  top:              0;
  left:             0;
}

.window {
  background:       rgba(210, 228, 224, 0.5);

  display:          block;
  height:           50%;
  width:            50%;
  border-radius:    25px;
  padding-left:     50px;

  word-wrap:        break-word;
  overflow:         hidden;

  min-height:       200px;
  min-width:        200px;
}

.sideBar {
  background:       rgb(210, 228, 224);

  display:          block;
  height:           100%;
  width:            50px;
  border-radius:    25px 0 0 25px;
}

.resizer {
  position:         absolute;
  width:            20px;
  height:           20px;
  background-color: none;
  right:            0;
  bottom:           0;
  border-radius:    25px;
  transition:       all .2s ease-in;
}.resizer:hover {
  width:            25px;
  height:           25px;
  background-color: rgb(210, 228, 225);
}

.closeBtn {
  width:            50px;
  height:           50px;
  background-color: #ff6868;
  color:            #fff;
  border-radius:    50% 0 50% 50%;
  text-align:       center;
  line-height:      50px;
}

/* Desktop config */

*, ::before, ::after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body {
  font-family: "Poppins", Sans-Serif;
}

html {
  max-height:       100vh;
  max-width:        100vw;
  background-size:  cover;
  cursor: none;
}

.dock {
  position:         fixed;
  right:            15px;
  top:              50%;
  transform:        translateY(-50%);
  background:       rgba(210, 228, 224, 0.5);
  border-radius:    50px;
  height:           75%;
  width:            50px;
}

#loadingLogo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  heght: auto;
}

#loadingLogo #big {
  animation: load-big 2s ease 0s infinite normal none;
  transform-origin: bottom right;
}

#loadingLogo #small {
  animation: load-small 2s ease 0s infinite normal none;
  transform-origin: top left;
}

@keyframes load-big {
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(.5);
  }
}
@keyframes load-small {
  50% {
    transform: scale(1) translate(-50%, -50%);
  }
  100% {
    transform: scale(2) translate(-50%, -50%);
  }
}
#loader {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: #333;
}
.loader-out {
  opacity: 0;
  transition: opacity 0.4s ease-out;
}
#cursor {
  position: absolute;
  pointer-events: none;
  z-index: 3;
  left: -25px;
}
iframe:hover {
  cursor: "../src/img/cursor/cursor.png"
}

/* Other */

@font-face {
  font-family: "Poppins";
  src: url("../src/fonts/Poppins-Regular.ttf") format("ttf");
}
button {
  border: none;
  border-radius: 100px;
}`;

				document.body.append(creatingStyle);

				var creatingLoader = document.createElement("div");

				creatingLoader.id = "loader";

				creatingLoader.innerHTML = `
<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" id="loadingLogo">
<circle cx="200" cy="200" r="200" fill="#C4C4C4" fill-opacity="0.2" id="big"/>
<circle cx="300" cy="300" r="100" fill="#C4C4C4" fill-opacity="0.2" id="small"/>
</svg>
`

				document.body.append(creatingLoader);

				const loader = document.querySelector("#loader")
				window.addEventListener("load", () => {
				  loader.classList.add("loader-out");
				  setTimeout(() => loader.remove(), 400);
				});

				var creatingCursor = document.createElement("div");

				creatingCursor.id = "cursor";

				creatingCursor.innerHTML = `
<svg width="25" height="25" viewBox="0 0 100 100" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M50 0H0V50C0 77.6142 22.3858 100 50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0Z" fill="#333333"/>
</svg>
`

				document.body.append(creatingCursor);

				os.system.cursorMove();
			}
	}
};