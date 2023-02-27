const baseopts = {
    lang: "english",
    engine: "google",
    clock: true,
    date: true,
    recentSites: true,
    sites: [],
    background: {
        r: 20,
        g: 20,
        b: 20
    }
};
const ls = localStorage;
const lsName = "kefirgo:data";
let options:object = {};
let lang:object = {};

function init() {
    load();
    let site = "view-main";
    if(Object.keys(options).length==0) {
        site = "view-welcome";
    }
    
    viewSite(site);
}
init();

function viewSite(site: string) {
    document.querySelectorAll(".view").forEach(e => {
        if(!e.className.includes(site)) e.setAttribute("style", "display: none !important;");
    });
}

function up(str: string) {
    return str.charAt(0).toUpperCase() + str.substring(1);
}

function search() {
    console.log("a");
    
    window.location.href = getHost()+encodeURIComponent(document.querySelector(".search-field")["value"]);
}

function getHost() {
    switch(options["engine"]) {
        case "google": {
            return "https://google.com/search?q=";
        }
        case "duckduckgo": {
            return "https://duckduckgo.com/?q=";
        }
        case "yahoo": {
            return "https://search.yahoo.com/search?p=";
        }
        case "you.com": {
            return "https://you.com/search?q=";
        }
        case "brave search": {
            return "https://search.brave.com/search?q=";
        }
    }
}

function listeners() {
    document.querySelector(".search-btn").addEventListener("click", (e) => {
        search();
    });
    document.querySelector(".search-field").addEventListener("keydown", (e) => {
        if((e as any).key=="Enter") search();
    });
    document.querySelector(".finish").addEventListener("click", () => {
        let lang = (document.querySelector(".lang") as any).selectedOptions[0].value.toLowerCase();
        let engine = (document.querySelector(".engine") as any).selectedOptions[0].value.toLowerCase();
        let name = (document.querySelector(".name-input") as any).value;

        if(name.replaceAll(" ", "")=="") return;

        let json:object = {...baseopts};

        json["lang"] = lang;
        json["engine"] = engine;
        json["name"] = name;

        options = json;
        save();
        window.location.reload();
    });
}

function reset() {
    ls.removeItem(lsName);
    window.location.reload();
}

// LOCALSTORAGE
function load() {
    let v = ls.getItem(lsName);
    if(v!=null) {
        options = JSON.parse(v);
        fetch("lang/"+options["lang"]+".json").then(e => e.json()).then(e => {
            lang = e;
            
            Object.keys(lang).forEach(el => {
                let h = document.documentElement.innerHTML as any;
                document.documentElement.innerHTML = h.replaceAll("$"+el+"$", lang[el]).replaceAll("%search-engine%", up(options["engine"]));
            });
            listeners();
        });
    } else {
        listeners();
    }
}

function save() {
    ls.setItem(lsName, JSON.stringify(options));
}