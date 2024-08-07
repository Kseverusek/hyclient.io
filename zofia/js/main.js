import * as Colors from "./colors.js";

const body = document.body;
const inp = document.querySelector("input");
const block = document.querySelector(".block");

const segments = [];

inp.addEventListener("keyup", async (ev) => {
    if (btoa(inp.value) == "em9zaWExNw==") {
        block.requestFullscreen();
        await wait(1000);
        init();
    }
});
block.addEventListener("scroll", (ev) => {
    setHTMLColor();
});

async function init() {
    body.toggleAttribute("hide");

    await wait(300);
    inp.remove();

    addSegment(
        "👋 Dzień dobry!",
        "#000",
        "Zrobiłem prostą ale mam nadzieje że i ładną stronkę na twoje urodziny uwu<br>PS: Scrolluj 😉"
    );
    addSegment(
        "🤰 Wow! Masz już 17 lat!",
        "#b632c2",
        "Cieszę się że udało ci się tyle z nami zostać, mam nadzieję<br>że już nie będę musiał się martwić o ciebie!<br>Liczę że dożyjesz miiiiliiooooon lat!1!!11!!"
    );
    addSegment(
        "🍾 Tylko rok do pełnoletności!",
        "#d1dd27",
        "Za rok nauczę cię robić tornado w piwie 😎"
    );
    addSegment(
        "❤ Kocham cię bardzo!",
        "#ce3636",
        "Musisz o tym pamiętać bo cię bardzo kocham zosiu,<br>nie możesz o tym zapomnieć"
    );
    addSegment(
        "🎀 Przejdźmy do prezentów",
        "#1394eb",
        "Nie można pominąć najciekawszego!<br>Przygotowałem dla ciebie kilka rzeczy..."
    );
    addSegment(
        "👹 Maska",
        "#5f25db",
        "Kupiłem ci jakiś czas temu 'pink clay mask' z mari kej,<br>pamiętałem że ją chciałaś, więc ogarnąłem co mogłem 🥰"
    );
    addSegment(
        "💋 Buziaki",
        "#ac19b9",
        "Milion buziaków i przytulasów!!! Do odebrania przez całe życie 🤯<br>ypieee!"
    );
    addSegment(
        "🎮 Minecraft",
        "#45df22",
        "Kupiłem ci minecrafta!!!!!<br>TAK1!!!1!! Kupiłem ci go na nasz email tiktoczkowy,<br>hasło ci już podam sam ale tak możemy <b>razem</b><br>grać i mieć matching skiny 🤤<br>oczywiście na nick <b>komienUwU</b>"
    );

    setHTMLColor();
    block.innerHTML =
        `
            <div class="navigator" style="--w: ${100 / segments.length}%;">
                ${segments
                    .map(
                        (s, i) =>
                            `<div class="item" index="${i}" style="--c: ${s.color};">${s.short}</div>`
                    )
                    .join("\n")}
            </div>
        ` +
        segments
            .map(
                (s) => `<div class="segment">
                    <h1 class="title">${s.title}</h1>
                    <h1 class="content">${s.content}</h1>
                </div>`
            )
            .join("<hr>");
    body.toggleAttribute("hide");
    body.querySelectorAll(".navigator .item").forEach((e) => {
        e.onclick = (ev) => {
            document
                .querySelector(".block")
                .scroll(0, e.getAttribute("index") * window.innerHeight);
        };
    });
}

function addSegment(title, color, content) {
    const short = title.split(" ")[0];
    segments.push({
        short: short,
        color: color,
        title: title.replace(short + " ", ""),
        content: content,
    });
}

function setHTMLColor() {
    const bg = getBlendColor();
    body.style.setProperty("--col", bg);
    body.style.setProperty("--font", Colors.invert(bg));
}

function getBlendColor() {
    let diff = block.scrollTop / window.innerHeight;

    const index = parseInt(diff);
    const percentage = diff - index;

    const c2 = segments[index + 1] || segments[index];

    return percentage == 0
        ? segments[index].color
        : Colors.blend(segments[index].color, c2.color, percentage);
}

async function wait(n) {
    return new Promise((r) => setTimeout(r, n));
}
