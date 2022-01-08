FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-20.04
USER root
WORKDIR /home/app
RUN echo "Acquire::Check-Valid-Until \"false\";\nAcquire::Check-Date \"false\";" | cat > /etc/apt/apt.conf.d/10no--check-valid-until
RUN apt-get update
RUN apt-get -y install curl gnupg build-essential
RUN curl -sL https://deb.nodesource.com/setup_10.x  | bash -
RUN apt-get -y install nodejs
RUN npm install
RUN npm install -g truffle@5.1.39
RUN npm install ganache-cli
ENV PATH "$PATH:/workspace/node_modules/.bin/"