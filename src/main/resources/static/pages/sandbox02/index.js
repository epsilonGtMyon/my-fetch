const status200Elem = document.getElementById("status200");
const status400Elem = document.getElementById("status400");
const status500Elem = document.getElementById("status500");
const downloadFileElem = document.getElementById("downloadFile");
const redirectElem = document.getElementById("redirect");

// -----------------------------------------------

/**
 *
 * @param {Response} response
 */
async function handleResponse(response) {
  console.log(response);
  const contentType = response.headers.get("Content-Type");

  if (contentType) {
    if (contentType.includes("application/json")) {
      const json = await response.json();
      return json;
    } else if (contentType.includes("text/html")) {
      if (response.redirected) {
        // こんなのでええんかな...
        // 2回エンドポイントたたくことになるけど
        location.href = response.url;
        return;
      } else {
        const text = await response.text();
        return text;
      }
    } else if (contentType.includes("application/octet-stream")) {
      // できればブラウザの方に任せたい
      // 雑に実装

      // ------------------------
      // ファイル名の抽出
      let filename = "unknown";
      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition) {
        // これでいいのかな...
        const f = contentDisposition.split("filename*=UTF-8''");
        if (f.length === 2) {
          filename = decodeURIComponent(f[1]);
        }
      }

      // ------------------------
      // ブラウザにダウンロードさせる
      const blob = await response.blob();

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.target = "_blank";
      a.download = filename;
      a.click();

      a.remove();
      URL.revokeObjectURL(a.href);
      return;
    }
  }
}

status200Elem.addEventListener("click", async () => {
  const response = await fetch("/sandbox02/status200", {
    method: "POST",
  });
  handleResponse(response);
});

status400Elem.addEventListener("click", async () => {
  const response = await fetch("/sandbox02/status400", {
    method: "POST",
  });
  handleResponse(response);
});

status500Elem.addEventListener("click", async () => {
  const response = await fetch("/sandbox02/status500", {
    method: "POST",
  });
  handleResponse(response);
});

downloadFileElem.addEventListener("click", async () => {
  const response = await fetch("/sandbox02/downloadPost", {
    method: "POST",
  });
  handleResponse(response);
});

redirectElem.addEventListener("click", async () => {
  const response = await fetch("/sandbox02/redirect", {
    method: "GET",
  });
  handleResponse(response);
});
