FROM postgres:13

ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD deploy.sql /docker-entrypoint-initdb.d/