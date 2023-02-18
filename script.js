const p = document.querySelector(".projects");
const th = document.querySelector(".theme");
var repos = {};
// 0 - white, 1 - black
var theme = 1;

async function init() {
    loadTheme();

    await loadRepos();
    loadClicks();
    // fetch("https://www.instagram.com/graphql/query?query_id=17888483320059182&variables={\"id\":\"58352552612\",\"first\":1,\"after\":null}", {
    //     "Content-Type": "application/json",
    //     method: 'GET',
    //     mode: 'no-cors',
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Access-Control-Allow-Origin": "*"
    //     }
    // }).then(e => e.json()).then(e => console.log(e));
}
init();

async function loadRepos() {
    let reposJson;

    await fetch("https://api.github.com/users/kefir2115/repos").then(e => e.json()).then(e => reposJson = e);
    
    repos.repos = [];
    reposJson.forEach(e => {
        let d = new Date(e.updated_at);
        repos.repos.push({
            name: e.name,
            desc: e.description,
            url: e.html_url,
            update: d
        });
    });
    repos.repos.sort((a, b) => a.update.getTime() > b.update.getTime() ? -1:1);
    await fetch("https://api.github.com/users/kefir2115/followers").then(e => e.json()).then(e => repos.followers = e.length);
    loadToHTML();
}

function loadToHTML() {
    p.innerHTML = "";
    let title = document.createElement("div");
    title.className = "title";
    title.innerHTML = "Projects&nbsp;("+repos.repos.length+")";
    p.appendChild(title);
    let list = document.createElement("div");
    list.className = "list";
    repos.repos.forEach(e => {
        let c = document.createElement("div");
        c.className = "project";
        c.setAttribute("update", e.update);
        c.setAttribute("link", e.url);
            let name = document.createElement("div");
            name.className = "name";
            name.innerHTML = e.name;
            c.appendChild(name);

            let desc = document.createElement("div");
            desc.className = "desc";
            desc.innerHTML = e.desc;
            c.appendChild(desc);
        list.appendChild(c);
    });
    p.appendChild(list);
}
function loadClicks() {
    let el = document.querySelectorAll("[link]");
    el.forEach(e => {
        e.addEventListener("click", (ev) => {
            window.open(e.getAttribute("link"), ev.ctrlKey?"_blank":"")
        });
    });
}
function loadTheme() {
    let l = localStorage;
    let t = "kefir-portfolio:";
    let i = l.getItem(t+"theme");
    if(i!=null) {
        theme = i;
    } else {
        theme = 1;
        l.setItem(t+"theme", theme);
    }
    th.querySelector("i").setAttribute("style", "animation: rotate .5s linear infinite;");
    document.body.setAttribute("style", "--bg: rgb("+(theme==1?"50,50,50":"255,255,255")+"); --f: rgb("+(theme==0?"0,0,0":"225,225,225")+");");
    setTimeout(() => {
        th.innerHTML = theme==1?'<i class="fa-regular fa-sun"></i>Light':'<i class="fa-solid fa-moon"></i>Dark';
    }, 500);
}
function changeTheme() {
    theme++;
    if(theme==2) theme = 0;

    let l = localStorage;
    let t = "kefir-portfolio:";
    l.setItem(t+"theme", theme);

    loadTheme();
}
// EAAiJSlhZA5BwBAJw6moNn5S5XtsJ8MAGkmabsGAbt4voysp2uRNYXj4Vz1y22FtZAkwZAubstxJIw0ZBjGKuERLsE68WZAIKBqus3cygMvR6NxwZCD7rtUYrkl2aOoCw7kwWeIumkmhRGqjdPxprBu2GjzOztDgLyFD1t9sTjahWJchcFdjXHlWSb5t6ZBKCKhdteaD1vTNvSPRnP0UCLHgeZB3I1AMBwAj9bfejHXWTjEA00fY3zftw