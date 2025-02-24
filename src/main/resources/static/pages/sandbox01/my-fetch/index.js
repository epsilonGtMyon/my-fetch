class GetRqeustBuilder {
  _fetchClient = null;
  _url = "";
  _headers = {};
  _params = {};

  constructor(fetchClient, url) {
    this._fetchClient = fetchClient;
    this._url = url;
  }

  headers(headers) {
    this._headers = headers;
    return this;
  }

  addHeader(key, value) {
    this._headers[key] = value;
    return this;
  }

  addHeaders(headers) {
    this._headers = {
      ...this._headers,
      ...headers,
    };
    return this;
  }

  // ---------------------

  params(params) {
    this._params = params;
    return this;
  }

  execute() {
    const option = {
      method: "GET",
      headers: this._headers,
    };

    return this._fetchClient.fetch(this._url, this._params, option);
  }
}

class MyPostRequestBuilder {
  _fetchClient = null;
  _url = "";
  _headers = {};
  _body = {};
  _explicitContentType = null;

  constructor(fetchClient, url) {
    this._fetchClient = fetchClient;
    this._url = url;
  }

  headers(headers) {
    this._headers = headers;
    return this;
  }

  addHeader(key, value) {
    this._headers[key] = value;
    return this;
  }

  addHeaders(headers) {
    this._headers = {
      ...this._headers,
      ...headers,
    };
    return this;
  }

  // ---------------------

  body(body) {
    this._body = body;
    return this;
  }

  jsonBody(body) {
    this.body(JSON.stringify(body));
    this._explicitContentType = "application/json";
    return this;
  }

  execute() {
    const headers = {
      ...this._headers,
    };
    if (this._explicitContentType != null) {
      headers["Content-Type"] = this._explicitContentType;
    }

    const option = {
      method: "POST",
      headers,
      body: this._body,
    };

    return this._fetchClient.fetch(this._url, null, option);
  }
}

// ================================================================

class MyFetchExecutor {
  /**
   * @type {{
   *  preRequest: (url: String, option: Object) => void,
   *  postRequest: (resp: Response, url: String, option: Object) => void,
   * }[]}
   */
  _requestListeners = [];

  async execute(paramUrl, paramQueryParam, paramOption) {
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

    // -------------------------------
    // fetch を実行

    for (const listener of this._requestListeners) {
      if (listener.preRequest != null) {
        listener.preRequest(url, option);
      }
    }

    const resp = await this.doFetch(url, option);

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
}

// ================================================================

class MyFetchClient {
  constructor(fetchExecutor) {
    this._fetchExecutor = fetchExecutor;
  }

  get(url) {
    return new GetRqeustBuilder(this, url);
  }

  post(url) {
    return new MyPostRequestBuilder(this, url);
  }

  fetch(paramUrl, paramQueryParam, paramOption) {
    return this._fetchExecutor.execute(paramUrl, paramQueryParam, paramOption);
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
