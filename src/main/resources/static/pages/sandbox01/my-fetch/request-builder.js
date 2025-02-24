class AbstractMyRequestBuilder {
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

  params(params) {
    this._params = params;
    return this;
  }

  execute() {
    throw new Error("Not implemented");
  }
}

class MyGetRequestBuilder extends AbstractMyRequestBuilder {
  constructor(fetchClient, url) {
    super(fetchClient, url);
  }

  execute() {
    const option = {
      method: "GET",
      headers: this._headers,
    };

    return this._fetchClient.fetch(this._url, this._params, option);
  }
}

class MyPostRequestBuilder extends AbstractMyRequestBuilder {
  _body = {};
  _explicitContentType = null;

  constructor(fetchClient, url) {
    super(fetchClient, url);
  }

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

    return this._fetchClient.fetch(this._url, this._params, option);
  }
}

export {
  AbstractMyRequestBuilder,
  MyGetRequestBuilder,
  MyPostRequestBuilder,
}