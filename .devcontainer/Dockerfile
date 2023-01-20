FROM mcr.microsoft.com/vscode/devcontainers/base:jammy

RUN wget -nv -O /tmp/deno.zip https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip && \
unzip -od /usr/local/bin /tmp/deno.zip && \
chmod +x /usr/local/bin/deno && \
deno completions bash | tee /etc/bash_completion.d/deno > /dev/null && \
deno completions zsh | tee /usr/local/share/zsh/site-functions/_deno > /dev/null && \
rm -f /tmp/deno.zip

EXPOSE 8000
