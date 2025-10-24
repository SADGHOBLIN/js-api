const API_KEY = "QGJf7Nj8sMO42SSKxpdf9bYy1x8";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// Add event listeners to buttons
document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

// GET request to check if API key is valid
async function getStatus(e) {
    const queryString =`${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until:</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}

// POST request to send JS code to be tested, log results to console
async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));
    const response = await fetch(API_URL, {
                                method: "POST",
                                headers: {
                                    "Authorization": API_KEY,
                                    },
                                    body: form,
    });
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let header = `JSHint Results for: ${data.file}`;
    let results;
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error-count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    displayData(header, results);

    document.getElementById("resultsModalTitle").innerText = header;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}