FROM postgres:17-alpine
RUN mkdir /postgres_logs
RUN chown postgres:postgres /postgres_logs
CMD postgres -c logging_collector=on -c log_destination=stderr -c log_directory=/postgres_logs