## Agile Metrics Tools

[![Build Status](https://travis-ci.org/ferzerkerx/agile-metrics-tools.svg?branch=master)](https://travis-ci.org/ferzerkerx/agile-metrics-tools)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=agile-metrics-tools&metric=alert_status)](https://sonarcloud.io/dashboard?id=agile-metrics-tools)

Agile metrics tools allows you to track metrics from different sources in order to identify trends and patterns on how
your team performance is affected by its environment Inspired by 'Agile Metrics in Action' book
and https://github.com/cwhd/measurementor project

Allows data pulled from different sources to be pushed to ElasticSearch so that it can be further analyzed in order to
find patterns.

Inspired by `Agile Metrics in Action` book and https://github.com/cwhd/measurementor project

![alt tag](https://raw.githubusercontent.com/ferzerkerx/agile-metrics-tools/master/screenshots/agile-metrics-tools-1.png)


### Env configurations

Please refer to docker-compose.yml file

### API Documentation

[Swagger](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/patitalabs/agile-metrics-core/main/src/api/resources/agile-metrics-jira-open-api.yml)
or in ```http://localhost:3001/ ```

### To use a Dockerized ELK

ES version 740 Please refer to https://elk-docker.readthedocs.io/ , mainly the only thing needed is:

````
sudo sysctl -w vm.max_map_count=262144
sudo grep vm.max_map_count /etc/sysctl.conf
docker run -p 5601:5601 -p 9200:9200 -p 5044:5044 -it --name elk sebp/elk:740
````

Remove limits of space if unable to create index

````
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_cluster/settings -d '{ "transient": { "cluster.routing.allocation.disk.threshold_enabled": false } }'
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_all/_settings -d '{"index.blocks.read_only_allow_delete": null}'
````

## Test locally (Using Web)

1. Start ELK stack and make sure ES is running on <http://localhost:92000>
2. Run yarn start-local
3. Go to <http://localhost:3000> on a browser
4. Select by service
5. Select external service
6. Click on sample
7. Click on submit
8. Create an index pattern ``myindex-*`` on <http://localhost:5601/app/kibana#/management/kibana/index_pattern?_g=()>
   with ``createdAt`` as time filter