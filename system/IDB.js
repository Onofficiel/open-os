let db = ""
let openReq = indexedDB.open("fs", 1);

openReq.onupgradeneeded = () => {
    db = openReq.result;

    if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", {keyPath: "id"});
    }
}

openReq.onerror = () => {
    console.error("Error while accessing FileSystem")
}

openReq.onsuccess = () => {
    db = openReq.result;


}