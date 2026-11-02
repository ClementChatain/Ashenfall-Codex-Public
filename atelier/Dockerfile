FROM python:3.12-slim
RUN groupadd --gid 10001 atelier && useradd --uid 10001 --gid 10001 --no-create-home atelier && mkdir /data && chown atelier:atelier /data
WORKDIR /app
COPY --chown=atelier:atelier server.py /app/server.py
COPY --chown=atelier:atelier web /app/web
USER atelier
ENV ATELIER_DB=/data/workshop.sqlite
EXPOSE 8050
CMD ["python", "server.py", "serve", "--host", "0.0.0.0", "--port", "8050"]
