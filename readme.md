# jwt-central

[![Build Status](https://travis-ci.org/spitimage/jwt-central.svg?branch=master)](https://travis-ci.org/spitimage/jwt-central)

Centralized auth server for issuing JWTs from multiple providers

# Introduction
This is a node/express application that provides _centralized_ and _consistent_ [JWT][jwt] provisioning. It delegates the actual authentication to a variety of identity providers (allowing the true experts to perform the hard part). The JWTs provisioned by this application are signed using [PKI][pki] to support simple and quick validation using a cached public key.

# Features

* Focused on authentication
* Single secure source for signed JWTs
* Leverages existing identity [providers][providers]
* Provides decoupling from identity providers
* Stateless

# The General Flow

1. The application (JWTC) provides a simple login page at `/login` that allows the user to select an identity provider.
1. The user agent is redirected to the identity provider for the OAuth or OpenID Connect _authorization code_ flow.
1. After the user authorizes the application, the user agent is redirected back to the JWTC callback.
1. Various code and state values are validated, and an access token is acquired from the identity provider.
1. In most cases, the access token is used to request the user profile from the identity provider.
1. JWTC creates a JWT from the profile.
1. JWTC signs the JWT with a private key.
1. JWTC returns the JWT to the user agent
1. The user agent caches the JWT to be used for API endpoints.
1. The API service can validate the JWT by using the cached public key (paired with the key used to sign the JWT).


# Identity Providers
[PassportJS][passport] provides an easy way to include pluggable libraries for various identity providers. There is an extensive collection of middleware modules in the passport [ecosystem][providers].

## Included Providers

#### Google
Uses the google account email as the subject.

#### Github
Uses the github profile URL as the subject. _Note_ see [this](https://github.com/jaredhanson/passport-github/issues/20) related to the latest version. For now you'll notice a github reference for this in package.json.

# Security

### JWT Handling

* JWTs should be carefully protected. They can be a single point of failure in a secure system.
* HTTPS should be used for __all__ traffic that includes a JWT

### CSRF
We're using a strategy that uses short-lived dynamic tokens for the state parameter. The user agent holds onto the state token for the duration of the authentication/authorization flow. This prevents CSRF attaches to the callback endpoint (details [here][csrf]).

### Bundled Deployment
Most of the time, you'll deploy a configurable reverse proxy in front of both JWTC and your own web application to avoid cross-domain issues. With this approach, JWTC is effectively bundled with your own web application (running as a micro-service). This is the model expected by most identity providers when you register an application with them.

### Standalone Deployment
JWTC can also serve as a single authentication service supporting multiple APIs. In this scenario, you'll need to architect an out-of-band method to pass the JWT from the user agent to your API client. You would register JWTC as a generic authentication application with the identity providers.

# Client Module
The client module can be found [here][client].

# Installing
First, install the dependencies:

    npm install

Create a production RSA key for JWT signing:

    cd scripts
    sh ./genkeys.sh

# Running
To start the server, edit the run.sh script as necessary and:

    cd scripts
    sh ./run.sh

Clients can download the public key at `/key` with something like:

    curl localhost:8000/key

# Testing

    npm install -g mocha
    mocha

# Linting

    npm install -g jshint
    jshint app
    jshint test


# License
[MIT][license]

[jwt]: https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-08
[pki]: http://en.wikipedia.org/wiki/Public_key_infrastructure
[passport]: http://passportjs.org
[providers]: http://passportjs.org/guide/providers/
[csrf]: http://tools.ietf.org/html/rfc6749#section-10.12
[client]: https://github.com/spitimage/jwt-central-client
[license]: https://github.com/spitimage/jwt-central/blob/master/LICENSE
