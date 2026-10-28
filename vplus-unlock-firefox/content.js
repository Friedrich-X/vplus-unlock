var postId = (window.location.href.split("/")[4] || "").split("?")[0];
var enabled = true;

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg === "status") {
    sendResponse({
      enabled: enabled,
      paywalled: !!document.querySelector(".vodl-paywall, .paywalled-content"),
    });
  }
});

chrome.storage.local.get({ enabled: true }, function (settings) {
  enabled = settings.enabled;
  if (!enabled) return;
  document.documentElement.classList.add("vplus-unlock");
  setInterval(function () {
    var contentWrapper =
      document.getElementsByClassName("paywalled-content")[0];
    if (contentWrapper && contentWrapper.children.length == 0) {
      unlockVPlus(contentWrapper);
    }
    unlockComments();
  }, 1000);
});

function unlockComments() {
  var comments = document.getElementById("comments");
  if (!comments) return;
  comments.classList.remove("hidden");
  var overlay = comments.querySelector("dialog, [role='dialog']");
  if (!overlay) {
    comments.querySelectorAll("div").forEach(function (el) {
      if (
        el.textContent.includes("eingeloggte") ||
        el.textContent.includes("Jetzt Anmelden")
      ) {
        if (el.parentElement && el.parentElement.closest("#comments")) {
          el
            .closest("#comments > div:last-child, #comments > div > div")
            ?.remove() || el.style.setProperty("display", "none", "important");
        }
      }
    });
  } else {
    overlay.remove();
  }
  comments
    .querySelectorAll("[style*='blur'], [style*='opacity']")
    .forEach(function (el) {
      el.style.filter = "none";
      el.style.opacity = "1";
    });
}

function unlockVPlus(contentWrapper) {
  var contentString = document.getElementById("__NUXT_DATA__").innerHTML;
  var data = JSON.parse(contentString);

  var startIndex = data.indexOf(Number(postId));

  var paragraphs =
    startIndex === -1
      ? []
      : data
          .slice(startIndex + 1)
          .filter((v) => typeof v === "string" && v.startsWith("<"));

  paragraphs.splice(0, 3);
  let div = document.createElement("div");
  div.classList.add("flex");
  div.classList.add("flex-col");
  div.classList.add("gap-y-8");
  div.classList.add("md:gap-y-10");
  contentWrapper.appendChild(div);

  for (const paragraph of paragraphs) {
    let div2 = document.createElement("div");
    div2.classList.add("content-block--wrapper");
    div.appendChild(div2);
    let div3 = document.createElement("div");
    div3.classList.add("content-block");
    div3.innerHTML = paragraph;
    div2.appendChild(div3);
  }
}
