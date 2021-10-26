/**********************************
 *                                *
 *             OpenOS             *
 *                                *
 *    Copyright (c) Onofficiel    *
 *                                *
/*********************************/

//           kernel.js           //

(() => {})();

let oos = {
  main: () => {
    addEventListener("load", () => {
      let osDiv = document.querySelector(".os-container");

      osDiv.innerHTML = `
            <div class='loader'>
                <img src="system/ressources/img/OutlinedLogoWhite.png">
            </div>
            <div class='desktop'>Desktop</div>
            `;

      osDiv.querySelector(".desktop").innerHTML = `
            
            <div class="desk"></div>

            `;
      setTimeout(() => {
        osDiv.removeChild(osDiv.querySelector(".loader"));
      }, 2000);
    });
  },
  sys: {
    var: {
      winId: [],
    },
  },
  util: {
    dragHeader: (elmnt) => {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      if (elmnt.getElementsByClassName(elmnt.classList[0] + "-header")[0]) {
        // if present, the header is where you move the DIV from:
        elmnt.getElementsByClassName(
          elmnt.classList[0] + "-header"
        )[0].onmousedown = dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    },
    resizeByResizer: (elmnt) => {
      const resizers = elmnt.querySelectorAll(".resizer");
      let currentResizer;

      for (let resizer of resizers) {
        resizer.addEventListener("mousedown", mousedown);

        function mousedown(e) {
          currentResizer = e.target;
          isResizing = true;

          let prevX = e.clientX;
          let prevY = e.clientY;

          window.addEventListener("mousemove", mousemove);
          window.addEventListener("mouseup", mouseup);

          function mousemove(e) {
            const rect = elmnt.getBoundingClientRect();

            if (currentResizer.classList.contains("se")) {
              elmnt.style.width = rect.width - (prevX - e.clientX) + "px";
              elmnt.style.height = rect.height - (prevY - e.clientY) + "px";
            } else if (currentResizer.classList.contains("sw")) {
              elmnt.style.width = rect.width + (prevX - e.clientX) + "px";
              elmnt.style.height = rect.height - (prevY - e.clientY) + "px";
              elmnt.style.left = rect.left - (prevX - e.clientX) + "px";
            } else if (currentResizer.classList.contains("ne")) {
              elmnt.style.width = rect.width - (prevX - e.clientX) + "px";
              elmnt.style.height = rect.height + (prevY - e.clientY) + "px";
              elmnt.style.top = rect.top - (prevY - e.clientY) + "px";
            } else {
              elmnt.style.width = rect.width + (prevX - e.clientX) + "px";
              elmnt.style.height = rect.height + (prevY - e.clientY) + "px";
              elmnt.style.top = rect.top - (prevY - e.clientY) + "px";
              elmnt.style.left = rect.left - (prevX - e.clientX) + "px";
            }

            prevX = e.clientX;
            prevY = e.clientY;
          }

          function mouseup() {
            window.removeEventListener("mousemove", mousemove);
            window.removeEventListener("mouseup", mouseup);
            isResizing = false;
          }
        }
      }
    },
    generateId: () => {
      let id = "";
      for (let i = 0; i < 4; i++) {
        id += Math.floor(Math.random() * 10);
      }

      if (oos.sys.var.winId.length >= 9999)
        throw new Error("Cannot generate ID");
      for (const winId in oos.sys.var.winId) {
        if (winId === id) return browser.generateId();
      }
      return parseInt(id);
    },
  },
  shell: {
    send: () => {},
  },
  ui: {
    desk: {
      addApp: (wapp) => {
        let desk = document.querySelector(".desk");

        let app = document.createElement("img");
        app.classList.add("desk-icon");
        app.src = wapp.parms.icon;

        app.addEventListener("click", () => {
          wapp.show();
        });

        desk.appendChild(app);
      },
      removeApp: (wapp) => {
        let desk = document.querySelector(".desk");

        desk.removeChild(wapp);
      },
    },
  },
  Window: class {
    constructor(parms) {
      if (!parms) parms = {};
      if (!parms.title) parms.title = "Untitled Window";
      if (!parms.body) parms.body = "";
      if (!parms.headerColor) parms.headerColor = "#09F";
      if (!parms.icon)
        parms.icon = "https://onofficiel.github.io/w96/dist/border/16x16.png";

      this.parms = parms;
      this.winDiv = document.createElement("div");

      this.winDiv.classList.add("window");
      this.winDiv.dataset.id = oos.util.generateId();

      this.winDiv.style.height = this.parms.height ? this.parms.height + "px" : 300 + "px";
      this.winDiv.style.width = this.parms.width ? this.parms.width + "px" : 400 + "px";

      this.winDiv.style.minHeight = this.parms.minHeight
        ? this.parms.minHeight + "px"
        : 200 + "px";
      this.winDiv.style.minWidth = this.parms.minWidth
        ? this.parms.minWidth + "px"
        : 200 + "px";

      this.winDiv.innerHTML = `
          <div class="window-content">${this.parms.body}</div>
          <div class="window-header cs-move" style="background: ${this.parms.headerColor};">
            <img src="${this.parms.icon}" />
            <span class="title">${this.parms.title}</span>
            <span class="ctrl-btn">
            <span class="minimize-btn cs-pointer">🗕</span>
              <span class="maximize-btn cs-pointer">🗖</span>
              <span class="close-btn cs-pointer">🗙</span>
            </span>
          </div>

          <div class="resizer nw"></div>
          <div class="resizer ne"></div>
          <div class="resizer se"></div>
          <div class="resizer sw"></div>
      `;

      oos.util.dragHeader(this.winDiv);
      oos.util.resizeByResizer(this.winDiv);

      this.winDiv.querySelector(".close-btn").addEventListener("click", () => {
        this.close();
      });
      oos.ui.desk.addApp(this);

      return this.winDiv;
    }

    get id() {
      return this.winDiv.dataset.id;
    }

    close() {
      return document.querySelector(".desktop").removeChild(this.winDiv);
      oos.ui.desk.removeApp(this);
    }

    show() {
      return document.querySelector(".desktop").appendChild(this.winDiv);
    }
  },
};
oos.main();
