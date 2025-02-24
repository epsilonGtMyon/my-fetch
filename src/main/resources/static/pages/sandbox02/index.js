const status200Elem = document.getElementById("status200");
const status400Elem = document.getElementById("status400");
const status500Elem = document.getElementById("status500");
const downloadFileElem = document.getElementById("downloadFile");
const redirectElem = document.getElementById("redirect");

// -----------------------------------------------

async function download(response) {
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

/**
 *
 * @param {Response} response
 */
async function handleResponse(response) {
  console.log(response);

  const redirected = response.redirected;
  const status = response.status;
  const contentType = response.headers.get("Content-Type");

  // TODO 共通的な対応
  // トークンの保存とか

  // --------------------------
  // ここからは アプリの要件によって変わると思う
  // 最低限上記3つの要素を使って分岐することになると思う

  if (redirected) {
    if (contentType.includes("text/html")) {
      // こんなのでええんかな...
      // 2回エンドポイントたたくことになるけど
      location.href = response.url;
      return;
    }

    if (200 <= status && status < 300) {
      if (contentType.includes("application/json")) {
        const json = await response.json();
        return json;
      }
    }
  } else {
    if (200 <= status && status < 300) {
      if (contentType.includes("application/json")) {
        const json = await response.json();
        return json;
      } else if (contentType.includes("application/octet-stream")) {
        download(response);
      }
      return;
    }

    if (400 <= status && status < 500) {
      window.alert("400系エラー");
      return;
    }

    window.alert("その他エラー");
    throw new Error(`unknown content type = ${contentType}`);
  }
}

status200Elem.addEventListener("click", async () => {
  const response = await fetch("/sandbox02/status200", {
    method: "POST",
  });
  const r = await handleResponse(response);
  console.log(r)
});

status400Elem.addEventListener("click", async () => {
  const response = await fetch("/sandbox02/status400", {
    method: "POST",
  });
  const r = await handleResponse(response);
  console.log(r)
});

status500Elem.addEventListener("click", async () => {
  const response = await fetch("/sandbox02/status500", {
    method: "POST",
  });
  const r = await handleResponse(response);
  console.log(r)
});

downloadFileElem.addEventListener("click", async () => {
  const response = await fetch("/sandbox02/downloadPost", {
    method: "POST",
  });
  const r = await handleResponse(response);
  console.log(r)
});

redirectElem.addEventListener("click", async () => {
  const response = await fetch("/sandbox02/redirect", {
    method: "GET",
  });
  const r = await handleResponse(response);
  console.log(r)
});
