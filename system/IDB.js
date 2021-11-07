let db = "";
let openReq = indexedDB.open("fs", 1);

openReq.onupgradeneeded = () => {
  db = openReq.result;

  const store = db.createObjectStore("users", { keyPath: "path" });

  console.log(store);
  store.add({
    path: "/test/hello.js",
    content: "Hello, World!",
  });
};

openReq.onerror = () => {
  console.error("Error while accessing FileSystem");
};

openReq.onblocked = function (event) {
  alert("Please close all other tabs with Open OS open!");
};

openReq.onsuccess = () => {
  db = openReq.result;
};
