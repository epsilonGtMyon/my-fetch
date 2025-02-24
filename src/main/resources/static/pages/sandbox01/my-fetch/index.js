import {
  MyGetRequestBuilder,
  MyPostRequestBuilder,
} from "./request-builder.js";

// ================================================================

// このクラスはそのままでも使えると思う
class MyFetchClient {
  constructor(fetchExecutor) {
    this._fetchExecutor = fetchExecutor;
  }

  get(url) {
    return new MyGetRequestBuilder(this, url);
  }

  post(url) {
    return new MyPostRequestBuilder(this, url);
  }

  fetch(paramUrl, paramQueryParam, paramOption) {
    return this._fetchExecutor.execute(paramUrl, paramQueryParam, paramOption);
  }
}

// ================================================================

// このクラスはオーバーライド前提になると思う
class MyFetchExecutor {
  /**
   * @type {{
   *  preRequest: (url: String, option: Object) => void,
   *  postRequest: (resp: Response, url: String, option: Object) => void,
   * }[]}
   */
  _requestListeners = [];

  execute(paramUrl, paramQueryParam, paramOption) {
    // -------------------------------
    // fetchの第1引数のURLを作成
    let url = paramUrl;
    if (paramQueryParam != null && paramQueryParam !== "") {
      const qs = new URLSearchParams(paramQueryParam).toString();
      url = `${url}?${qs}`;
    }

    // -------------------------------
    // fetchの第2引数のオプションを作成
    const defaultOption = {
      mode: "cors",
      cache: "default",
      credentials: "same-origin",
    };

    let option = {};
    if (paramOption != null) {
      option = {
        ...defaultOption,
        ...paramOption,
      };
      option.headers = {
        ...defaultOption.headers,
        ...paramOption.headers,
      };
    }

    return this.executeFetch(url, option);
  }

  // この部分はアプリの要件によって変わるので
  // オーバーライド前提になると思う
  async executeFetch(url, option) {
    for (const listener of this._requestListeners) {
      if (listener.preRequest != null) {
        listener.preRequest(url, option);
      }
    }

    let resp = null;
    let error = null;
    try {
      resp = await this.doFetch(url, option);
    } catch (e) {
      error = e;
      this.handleFetchError(e, url, option);
    }

    for (const listener of this._requestListeners) {
      if (listener.postRequest != null) {
        listener.postRequest(resp, url, option);
      }
    }

    // -------------------------------
    // TODO 結果のハンドリング

    // 生のResponseじゃなくて リクエストの情報とかをまとめてラップしたやつ返すのがよさそう
    // それも拡張性もたせるような感じで
    return resp;
  }

  doFetch(url, option) {
    return fetch(url, option);
  }

  handleFetchError(error, url, option) {
    throw error;
  }
}

function useMyFetchClient(executor) {
  if (executor == null) {
    executor = new MyFetchExecutor();

    // TODO リスナーは外部から追加したいし拡張可能な方式にしたい
    const requestLogListener = {
      preRequest(url, option) {
        console.log(`preRequest: url=${url}`, option);
      },
      postRequest(resp, url, option) {
        console.log(`postRequest: url=${url}`, resp);
      },
    };

    const csrfTokenListener = {
      preRequest(url, option) {
        const csrfToken = "aaaa";
        option.headers["X-CSRF-Token"] = csrfToken;
      },
    };

    // TODO どうやってリスナー追加しようかな
    executor._requestListeners.push(requestLogListener);
    executor._requestListeners.push(csrfTokenListener);
  }

  return new MyFetchClient(executor);
}

export { useMyFetchClient };
