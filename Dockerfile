FROM reviewdog/action-golangci-lint:v1.1.3 AS reviewdog

RUN cp "$(go env GOPATH)/bin/reviewdog" /usr/bin/reviewdog

FROM php:7.3.13-cli-stretch

WORKDIR /github/workspace

COPY --from=reviewdog /usr/bin/reviewdog /usr/bin/reviewdog

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
