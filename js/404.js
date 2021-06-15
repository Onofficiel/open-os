const os =
{
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

          creatingWin.style.top = Math.floor(Math.random() * window.innerHeight) + "px";
          creatingWin.style.left = Math.floor(Math.random() * window.innerWidth) + "px";

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
          } catch (e) {};
        }
        os.system.config.selected = elem;
        os.system.config.selected.classList.add("current");
        document.querySelector(`.window#${os.system.config.selected.id}`).style.zIndex = "1";
      },
      "config":
  		{
  			"currentWin": null,
  			"selected": null,
  			"currentId": [],
  			"windowMinSize": 200,
  			"idMaker": 0
  		}
    }
  }


/////////////////////////////////////
os.system.window.create({
  "content": `
  <div style="background-color: #ff6868;
  width: 100%;
  height: 100%;">
  <span style="font-size:100px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-150%, -50%);
  color: #fff;">;)</span>
  <h2 style="font-size:30px;
  color: #fff;
  position: absolute;
  left: 70%;
  top: 50%;
  transform: translate(-50%, -50%);">Si tu lis ça,<br/>Bravo ! Tu as perdu 10 minutes<br/>de ta vie !</h2>
  </div>
  `,
  "isResizable": false,
  "width": 550,
  "height": 250
});

let interval1 = setInterval(() => {
  os.system.window.create({
    "content": `
    <div style="background-color: #ff6868;
    width: 100%;
    height: 100%;">
    <span style="font-size:100px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-150%, -50%);
    color: #fff;">&#9888;</span>
    <h2 style="font-size:50px;
    color: #fff;
    position: absolute;
    left: 60%;
    top: 50%;
    transform: translate(-50%, -50%);">404 !</h2>
    </div>
    `,
    "isResizable": false,
    "width": 550,
    "height": 250
  });
  if (os.system.config.currentId.length > 250) {
    os.system.window.close(os.system.config.currentId[Math.floor(Math.random() * os.system.config.currentId.length)]);
  }
}, 0);
