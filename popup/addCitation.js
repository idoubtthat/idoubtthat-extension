const hidePage = `body > :not(.citationResponse) {
                    display: none;
                  }`;
const host = "localhost"
function runExtension() {
  browser.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let url = tabs[0].url;
      document.getElementById("url").value = url
    });
    
  document.getElementById("sendCitation").addEventListener("click", (e) => {
    browser.tabs.query({active: true, currentWindow: true})
          .then(sendCitation)
          .catch(reportError);
      });

  document.getElementById("resetSendCitation").addEventListener("click", (e) => {
    browser.tabs.query({active: true, currentWindow: true})
          .then(reset)
          .catch(reportError);
      });

  function reset(tabs) {
    browser.tabs.removeCSS({code: hidePage}).then(() => {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "reset",
      });
    });
  }

  function reportError(error) {
    console.error(`Error: ${error}`);
  }

  async function getData() {
    response = await fetch(host + "/api/v1/citation", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  async function postData(data, endpoint) {
    response = await fetch(host + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async function sendCitation(tabs) {
    let url = document.getElementById("url").value;
    let comment = document.getElementById("comment").value;
    let author = document.getElementById("author").value;
    let data = {"url" : url, "commentary" : comment, "author": author}
    console.log(JSON.stringify(data));
    var response = await postData(data, "/api/v1/citation");
    browser.tabs.insertCSS({code: hidePage}).then(() => {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "addCitation",
        response: response
      });
    });
  }
}

function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute citation content script: ${error.message}`);
}

browser.tabs.executeScript({file: "/content_scripts/citations.js"})
.then(runExtension)
.catch(reportExecuteScriptError);