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
    window.addEventListener("load", () => {
      let osDiv = document.querySelector(".os-container");

      /*/ import CSS /*/
      fetch("https://open-os.netlify.app").then(() => {
        oos.util.import.css(
          "https://open-os.netlify.app/system/stylesheets/normaliser.css"
        );
        oos.util.import.css(
          "https://open-os.netlify.app/system/stylesheets/master.css"
        );
      });

      osDiv.innerHTML = `
            <div class='loader'>
                <img src="https://open-os.netlify.app/system/ressources/img/OutlinedLogoWhite.png">
            </div>
            <div class='desktop'>Desktop</div>
            `;

      osDiv.querySelector(".desktop").innerHTML = `
            
            <div class="notification-container"></div>
            <div class="desk"></div>

            `;
      setTimeout(() => {
        osDiv.removeChild(osDiv.querySelector(".loader"));
      }, 2000);

      window.console.error = (error) => {
        let wnd = new oos.StandardWindow({
          content: `
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
                 transform: translate(-50%, -50%);">An error occured.</h2>
        <p style="color: #fff;
                 position: absolute;
                 left: 50%;
                 top: 60%;
                 transform: translateX(-50%);
                 padding: 5px:">${error.toString()}</p>
        </div>
          `,
          resizable: false,
          minimizable: false,
          maximizable: false,
          title: "Error",
          headerColor: "#ff6868",
          width: 450,
          height: 200,
        });

        wnd.show();
        wnd.setCurrent();
      };
      window.alert = (msg) => {
        let wnd = new oos.StandardWindow({
          content: `
          <div style="
      
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
      
          width: 100%;
          height: 100%;
      
          color: #333333;
      
          ">
              <h1 style="
      
              font-size: 80px;
      
              ">⚠</h1>
              <div>${msg.toString()}</div>
          </div>
          `,
          resizable: false,
          minimizable: false,
          maximizable: false,
          headerColor: "#333333",
          width: 430,
          height: 200,
          title: "Alert",
        });

        wnd.show();
        wnd.setCurrent();
      };
    });
  },
  sys: {
    var: {
      winId: [],
      wId: 0,
      nId: 0,
    },
  },
  util: {
    import: {
      css: (href) => {
        let osDiv = document.querySelector(".os-container");
        let link = document.createElement("link");

        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = href;

        osDiv.appendChild(link);
      },
    },
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

      this.minimizable = true;
      this.maximizable = true;
      this.closable = true;
    }
  },
  StandardWindow: class {
    constructor(params) {
      if (params == null) params = new oos.WindowParams();

      this.params = Object.assign(new oos.WindowParams(), params);
      this.winDiv = document.createElement("div");
      this.minimized = false;
      this.maximized = false;
      this.maximizeInfo = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        borderRadius: 0,
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
          <div class="window-header cs-move" style="background: ${
            this.params.headerColor
          };">
            <img src="${this.params.icon}" height="20px" width="20px" />
            <span class="title">${this.params.title}</span>
            <span class="ctrl-btn">
              ${
                this.params.minimizable
                  ? `<span class="minimize-btn cs-pointer">🗕</span>`
                  : ""
              }
              ${
                this.params.maximizable
                  ? `<span class="maximize-btn cs-pointer">🗖</span>`
                  : ""
              }
              ${
                this.params.closable
                  ? `<span class="close-btn cs-pointer">🗙</span>`
                  : ""
              }
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

      if (this.params.closable) {
        this.winDiv
          .querySelector(".close-btn")
          .addEventListener("click", () => {
            this.close();
          });
      }

      if (this.params.minimizable) {
        this.winDiv
          .querySelector(".minimize-btn")
          .addEventListener("click", () => {
            this.hide();
          });
        oos.ui.desk.addApp(this);
      }
      if (this.params.maximizable) {
        this.winDiv
          .querySelector(".maximize-btn")
          .addEventListener("click", () => {
            this.toggleMaximize();
          });
      }

      // Window Events //

      this.winDiv.addEventListener("mousedown", () => {
        this.setCurrent();
      });

      this.winDiv.addEventListener("dblclick", () => {
        this.toggleMaximize();
      });

      document.querySelector(".desktop").appendChild(this.winDiv);

      return this;
    }

    center() {
      this.winDiv.style.left =
        document.body.offsetWidth / 2 -
        parseInt(this.winDiv.style.width) / 2 +
        "px";
      this.winDiv.style.top =
        document.body.offsetHeight / 2 -
        parseInt(this.winDiv.style.height) / 2 +
        "px";
    }

    toggleMaximize() {
      if (this.maximized) {
        this.winDiv.style.left = this.maximizeInfo.left;
        this.winDiv.style.top = this.maximizeInfo.top;
        this.winDiv.style.height = this.maximizeInfo.height;
        this.winDiv.style.width = this.maximizeInfo.width;
        this.winDiv.style.borderRadius = this.maximizeInfo.borderRadius;

        return (this.maximized = false);
      } else {
        this.maximizeInfo.left = this.winDiv.style.left;
        this.maximizeInfo.top = this.winDiv.style.top;
        this.maximizeInfo.height = this.winDiv.style.height;
        this.maximizeInfo.width = this.winDiv.style.width;
        this.maximizeInfo.borderRadius = this.winDiv.style.borderRadius;

        this.winDiv.style.left = 0;
        this.winDiv.style.top = 0;
        this.winDiv.style.height = "100%";
        this.winDiv.style.width = "100%";
        this.winDiv.style.borderRadius = 0;

        return (this.maximized = true);
      }
    }

    makeDraggable() {
      (function (ctx) {
        let wnd = ctx.winDiv;

        wnd
          .querySelector("." + wnd.classList[0] + "-header")
          .addEventListener("mousedown", mousedown);

        function mousedown(e) {
          let prevX = e.clientX;
          let prevY = e.clientY;

          window.addEventListener("mousemove", mousemove);
          window.addEventListener("mouseup", mouseup);

          function mousemove(e) {
            if (ctx.maximized) {
              ctx.toggleMaximize();
            }

            let newX = prevX - e.clientX;
            let newY = prevY - e.clientY;

            const rect = wnd.getBoundingClientRect();

            wnd.style.left = rect.left - newX + "px";
            wnd.style.top = rect.top - newY + "px";

            prevX = e.clientX;
            prevY = e.clientY;
          }

          function mouseup() {
            window.removeEventListener("mouseup", mouseup);
            window.removeEventListener("mousemove", mousemove);
          }
        }
      })(this);
    }

    makeResizable() {
      (function (ctx) {
        let wnd = ctx.winDiv;

        const resizers = wnd.querySelectorAll(".resizer");
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
              if (ctx.maximized) {
                ctx.toggleMaximize();
              }

              const rect = wnd.getBoundingClientRect();

              if (currentResizer.classList.contains("se")) {
                wnd.style.width = rect.width - (prevX - e.clientX) + "px";
                wnd.style.height = rect.height - (prevY - e.clientY) + "px";
              } else if (currentResizer.classList.contains("sw")) {
                wnd.style.width = rect.width + (prevX - e.clientX) + "px";
                wnd.style.height = rect.height - (prevY - e.clientY) + "px";
                wnd.style.left = rect.left - (prevX - e.clientX) + "px";
              } else if (currentResizer.classList.contains("ne")) {
                wnd.style.width = rect.width - (prevX - e.clientX) + "px";
                wnd.style.height = rect.height + (prevY - e.clientY) + "px";
                wnd.style.top = rect.top - (prevY - e.clientY) + "px";
              } else {
                wnd.style.width = rect.width + (prevX - e.clientX) + "px";
                wnd.style.height = rect.height + (prevY - e.clientY) + "px";
                wnd.style.top = rect.top - (prevY - e.clientY) + "px";
                wnd.style.left = rect.left - (prevX - e.clientX) + "px";
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
      })(this);
    }

    close() {
      try {
        if (this.params.minimizable) oos.ui.desk.removeApp(this);

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
  NotificationParams: class {
    constructor() {
      this.title = "Untitled Notification";
      this.icon = "https://picsum.photos/200";
      this.content = "";

      this.headerColor = "#0099ff";

      this.closable = true;
    }
  },
  StandardNotification: class {
    constructor(params) {
      if (params == null) params = new oos.NotificationParams();

      this.params = Object.assign(new oos.NotificationParams(), params);
      this.notifDiv = document.createElement("div");

      this.notifDiv.classList.add("notification");
      this.notifDiv.dataset.id = "ntf_" + oos.sys.var.nId++;

      this.id = this.notifDiv.dataset.id;

      this.notifDiv.innerHTML = `
      
      <img src="${this.params.icon}"
           style="width: 50px;
                  height: 50px;
      ">

      <div style="display: flex;
                  flex-direction: column;
      ">

        <b>${this.params.title}</b>
        <p>${this.params.content}</p>
        
      </div>

      <span>
        ${
          this.params.closable
            ? `<span class="close-btn cs-pointer"
                     style="position: relative;
                            top: 10px;
                            right: 15px;
            ">🗙</span>`
            : ""
        }
      </span>

      `;

      if (this.params.closable) {
        this.notifDiv
          .querySelector(".close-btn")
          .addEventListener("click", () => {
            this.close();
          });
      }

      document
        .querySelector(".notification-container")
        .appendChild(this.notifDiv);

      return this;
    }

    close() {
      document
        .querySelector(".notification-container")
        .removeChild(this.notifDiv);
    }
  },
};
oos.main();
