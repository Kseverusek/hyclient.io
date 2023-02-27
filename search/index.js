var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var baseopts = {
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
var ls = localStorage;
var lsName = "kefirgo:data";
var options = {};
var lang = {};
function init() {
    load();
    var site = "view-main";
    if (Object.keys(options).length == 0) {
        site = "view-welcome";
    }
    viewSite(site);
}
init();
function viewSite(site) {
    document.querySelectorAll(".view").forEach(function (e) {
        if (!e.className.includes(site))
            e.setAttribute("style", "display: none !important;");
    });
}
function up(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
}
function search() {
    console.log("a");
    window.location.href = getHost() + encodeURIComponent(document.querySelector(".search-field")["value"]);
}
function getHost() {
    switch (options["engine"]) {
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
    document.querySelector(".search-btn").addEventListener("click", function (e) {
        search();
    });
    document.querySelector(".search-field").addEventListener("keydown", function (e) {
        if (e.key == "Enter")
            search();
    });
    document.querySelector(".finish").addEventListener("click", function () {
        var lang = document.querySelector(".lang").selectedOptions[0].value.toLowerCase();
        var engine = document.querySelector(".engine").selectedOptions[0].value.toLowerCase();
        var name = document.querySelector(".name-input").value;
        if (name.replaceAll(" ", "") == "")
            return;
        var json = __assign({}, baseopts);
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
    var v = ls.getItem(lsName);
    if (v != null) {
        options = JSON.parse(v);
        fetch("lang/" + options["lang"] + ".json").then(function (e) { return e.json(); }).then(function (e) {
            lang = e;
            Object.keys(lang).forEach(function (el) {
                var h = document.documentElement.innerHTML;
                document.documentElement.innerHTML = h.replaceAll("$" + el + "$", lang[el]).replaceAll("%search-engine%", up(options["engine"]));
            });
            listeners();
        });
    }
    else {
        listeners();
    }
}
function save() {
    ls.setItem(lsName, JSON.stringify(options));
}
