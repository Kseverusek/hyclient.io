async function request(url) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })
    .then(res => {
        return res.json()
    })
    .then(data => console.log(data));
}

async function apiRequest(url) {
    request("https://sus-database.herokuapp.com/sus/" + url);
}