FROM trufflesuite/ganache-cli:latest
RUN /bin/sh -c "apk add --no-cache bash"
ENTRYPOINT node /app/ganache-core.docker.cli.js --networkId 1337 --verbose --host 0.0.0.0