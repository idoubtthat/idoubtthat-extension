(function() {

  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  function showCitation(jsonResponse) {
    resetPage();
    let textDiv = document.createElement("div");
    textDiv.innerHTML = jsonResponse;
    textDiv.style.height = "100vh";
    textDiv.className = "citationResponse";
    document.body.appendChild(textDiv);
  }

  function resetPage() {
    let existingCitations = document.querySelectorAll(".citationResponse");
    for (let citation of existingCitations) {
      citation.remove();
    }
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "addCitation") {
      console.log(message.response)
      showCitation(JSON.stringify(message.response));
    } else if (message.command === "reset") {
      resetPage();
    }
  });

})();
