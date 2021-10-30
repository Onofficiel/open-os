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
      wId: 0,
    },
  },
  util: {
    escapeHtml: (unsafe) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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
        app.src = wapp.params.icon;
        app.dataset.dId = wapp.id;

        app.addEventListener("click", () => {
          wapp.toggleVisibility();
        });

        desk.appendChild(app);
      },

      removeApp: (wapp) => {
        let desk = document.querySelector(".desk");

        desk.removeChild(
          desk.querySelector("img[data-d-id='" + wapp.id + "']")
        );
      },
    },
  },
  WApplication: class {
    constructor() {
      this.windows = [];
    }

    createWindow(params) {
      let wnd = new oos.StandardWindow(params);

      this.windows.push(wnd);

      return wnd;
    }
  },
  WindowParams: class {
    constructor() {
      this.posX = 100;
      this.posY = 100;
      this.height = 300;
      this.width = 480;
      this.title = "Untitled Window";
      this.icon = "https://picsum.photos/200";
      this.content = "";
      this.headerColor = "#0099ff";
      this.resizable = true;
      this.draggable = true;
    }
  },
  StandardWindow: class {
    constructor(params) {
      null == params && (params = new oos.WindowParams());

      this.params = Object.assign(new oos.WindowParams(), params);
      this.winDiv = document.createElement("div");
      this.minimized = false;
      this.maximizeInfo = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      };

      this.winDiv.classList.add("window");
      this.winDiv.style.height = this.params.height + "px";
      this.winDiv.style.width = this.params.width + "px";
      this.winDiv.style.left = this.params.posX + "px";
      this.winDiv.style.top = this.params.posY + "px";
      this.winDiv.dataset.id = "wnd_" + oos.sys.var.wId++;

      this.id = this.winDiv.dataset.id;

      this.winDiv.innerHTML = `
          <div class="window-content">${this.params.content}</div>
          <div class="window-header cs-move" style="background: ${this.params.headerColor};">
            <img src="${this.params.icon}" height="20px" width="20px" />
            <span class="title">${this.params.title}</span>
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

      this.hide();

      if (this.params.resizable) this.makeResizable();
      if (this.params.draggable) this.makeDraggable();

      this.winDiv.addEventListener("mousedown", () => {
        this.setCurrent();
      });

      this.winDiv.querySelector(".close-btn").addEventListener("click", () => {
        this.close();
      });
      this.winDiv
        .querySelector(".minimize-btn")
        .addEventListener("click", () => {
          this.hide();
        });

      document.querySelector(".desktop").appendChild(this.winDiv);

      oos.ui.desk.addApp(this);

      return this;
    }

    center() {
      this.winDiv.style.left = window.innerWidth / 2 - parseInt(this.winDiv.style.left) / 2;
      this.winDiv.style.top = window.innerHeight / 2 - parseInt(this.winDiv.style.top) / 2;
    }

    makeDraggable() {
      (function (elmnt) {
        var pos1 = 0,
          pos2 = 0,
          pos3 = 0,
          pos4 = 0;

        elmnt.getElementsByClassName(
          elmnt.classList[0] + "-header"
        )[0].onmousedown = dragMouseDown;

        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          elmnt.style.top = elmnt.offsetTop - pos2 + "px";
          elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
          document.onmouseup = null;
          document.onmousemove = null;
        }
      })(this.winDiv);
    }

    makeResizable() {
      (function (elmnt) {
        const resizers = elmnt.querySelectorAll(".resizer");
        let currentResizer;

        for (let resizer of resizers) {
          resizer.addEventListener("mousedown", mousedown);

          function mousedown(e) {
            currentResizer = e.target;
            let isResizing = true;

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
      })(this.winDiv);
    }

    close() {
      try {
        oos.ui.desk.removeApp(this);
        document.querySelector(".desktop").removeChild(this.winDiv);
        return true;
      } catch {
        return false;
      }
    }

    hide() {
      this.winDiv.style.display = "none";
      this.minimized = true;
    }

    show() {
      this.winDiv.style.display = "flex";
      this.minimized = false;
    }

    toggleVisibility() {
      this.minimized ? this.show() : this.hide();
    }

    setCurrent() {
      try {
        for (
          let i = 0;
          i <
          document.querySelector(".desktop").querySelectorAll(".window").length;
          i++
        ) {
          document
            .querySelector(".desktop")
            .querySelectorAll(".window")
            [i].classList.remove("current");
        }
        document
          .querySelector('.window[data-id~="' + this.id + '"]')
          .classList.add("current");
      } catch {}
    }
  },
};
oos.main();
