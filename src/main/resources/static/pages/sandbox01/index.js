import { useMyFetchClient } from "./my-fetch/index.js";

// --------------------------------------------------------------

const fileElem = document.getElementById("file");
const get01Elem = document.getElementById("get01");
const postJson01Elem = document.getElementById("postJson01");
const postForm01Elem = document.getElementById("postForm01");
const postUpload01Elem = document.getElementById("postUpload01");

// --------------------------------------------------------------

get01Elem.addEventListener("click", async () => {
  const client = useMyFetchClient();

  const resp = await client
    .get("http://localhost:1111/sandbox01/get01")
    .params({
      value01: "あいうえお",
      value02: "かきくけこ",
    })
    .addHeaders({
      "X-aaa": "bbb",
    })
    .execute();
});

postJson01Elem.addEventListener("click", async () => {
  const client = useMyFetchClient();

  const resp = await client
    .post("/sandbox01/postJson01")
    .jsonBody({
      value01: "値01",
      value02: "値02",
      nestedObj: {
        nestValue01: "親子・値01",
      },
      nestedList: [
        {
          nestValue01: "親子・リスト01",
        },
        {
          nestValue01: "親子・リスト02",
        },
      ],
    })
    .addHeaders({
      z: "c",
    })
    .execute();
});

postForm01Elem.addEventListener("click", async () => {
  const formData = new FormData();
  formData.append("value01", "値01");
  formData.append("value02", "値02");
  formData.append("nestedObj.nestValue01", "親子・値01");
  formData.append("nestedList[0].nestValue01", "親子・リスト01");
  formData.append("nestedList[1].nestValue01", "親子・リスト02");

  const client = useMyFetchClient();

  const resp = await client
    .post("/sandbox01/postForm01")
    .body(formData)
    .execute();
});

postUpload01Elem.addEventListener("click", async () => {
  const formData = new FormData();
  for (let i = 0; i < fileElem.files.length; i++) {
    formData.append("files", fileElem.files[i]);
  }

  const client = useMyFetchClient();

  const resp = await client
    .post("/sandbox01/postUpload01")
    .body(formData)
    .execute();
});
