# UNINETT TechSmith Relay User Registration

**NOTE: Created to suit higher education in Norway; makes use of Dataporten (UNINETT) for client/user (O)Authentication.** 

This Client facilitates self-service account registration with TechSmith Relay (Self-Hosted instance). 
It requires access to the techsmith-relay-register-api to be of any use (also configured with Dataporten).

## Installation

- Clone the repository
- Register as Client in Dataporten and request the following scopes:
    - `email`, `groups`, `profile`, `userid`, `userid-feide`
- Request access to the `ecampus-kind-api` and `techsmith-relay-register-api`
    - request admin scope access for both
- Rename dataporten_auth_SAMPLE.js -> dataporten_auth.js and populate the config object with Client Credentials from Dataporten and API endpoints.

## Dependencies

- UNINETT Dataporten
    - http://docs.dataporten.no
- The UNINETT Relay Register API (must be registered with Dataporten)
    - https://github.com/skrodal/techsmith-relay-register-api
- The UNINETT (eCampus) Kind API (must be registered with Dataporten)
    - https://github.com/skrodal/ecampus-kind-api
- JSO – OAuth 2.0 Client with Javascript by Andreas Åkre Solberg (UNINETT)
    - https://github.com/andreassolberg/jso
- UNINETT Bootstrap theme
    - https://github.com/andreassolberg/uninett-bootstrap-theme
    - Colfax fonts (required but not included in the repo, as they are licenced separately)
- JQuery/Bootstrap

— Simon Skrødal, July 2016