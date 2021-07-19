const events = document.getElementById("events");

function getData() {
    fetch("https://jacobs.jeanlaurent.fr/data/jacobs.json", {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })
    .then(r => console.log(r.json()))
    .then(d => console.log(d))
    .catch(e => console.log(e));
}

getData();