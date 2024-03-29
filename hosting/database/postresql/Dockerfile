FROM postgres:16.1
ENV POSTGIS_MAJOR 3
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR \
    postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR-scripts

CMD ["postgres"]
