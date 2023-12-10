export enum ERequestType {
  BODY = 'body',
  QUERY = 'queryStringParameters',
  HEADERS = 'headers',
}

export enum ERequestMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  NO_HTTP = 'NO_HTTP',
}
