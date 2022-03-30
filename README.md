# readability-rest

Mozilla's [Readability.js](https://github.com/mozilla/readability), as a REST API

## Rationale

Exposing Readability.js as a REST API allows non-js usage of the library without
the need of custom language-specific bindings.

## Endpoints

There is only one endpoint - `/parse`

#### `GET /parse`

Arguments:

* `url` - The URL from which HTML will be processed
