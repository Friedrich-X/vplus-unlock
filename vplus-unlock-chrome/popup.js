var toggle = document.getElementById("toggle");
var statusEl = document.getElementById("status");
var statusText = document.getElementById("status-text");
var siteEl = document.getElementById("site");

document.getElementById("version").textContent =
  "v" + chrome.runtime.getManifest().version;

chrome.storage.local.get({ enabled: true }, function (settings) {
  toggle.checked = settings.enabled;
});

toggle.addEventListener("change", function () {
  chrome.storage.local.set({ enabled: toggle.checked });
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var tab = tabs[0];

  document.getElementById("reload").addEventListener("click", function () {
    chrome.tabs.reload(tab.id);
    window.close();
  });

  chrome.tabs.sendMessage(tab.id, "status", function (res) {
    if (chrome.runtime.lastError || !res) {
      siteEl.textContent = "Andere Seite";
      statusText.textContent = "Nur auf vol.at aktiv";
      return;
    }
    siteEl.textContent = "vol.at";
    if (!res.paywalled) {
      statusText.textContent = "Kein V+ Beitrag";
      statusEl.className = "card status free";
    } else if (res.enabled) {
      statusText.textContent = "V+ Beitrag, freigeschaltet";
      statusEl.className = "card status free";
    } else {
      statusText.textContent = "V+ Beitrag, gesperrt";
      statusEl.className = "card status locked";
    }
  });
});
