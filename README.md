## Agile Metrics Tools
[![Build Status](https://travis-ci.org/ferzerkerx/agile-metrics-tools.svg?branch=master)](https://travis-ci.org/ferzerkerx/lego-work-stream-slack)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=agile-metrics-tools&metric=alert_status)](https://sonarcloud.io/dashboard?id=agile-metrics-tools)

Agile metrics tools allows you to track metrics from different sources in order to identify trends and patterns on how your team performance is affected by its environment Inspired by 'Agile Metrics in Action' book and https://github.com/cwhd/measurementor project

Pulls data from:
- Jira
- Jenkins
- Github
- Sonarqube
- Manual external sources

And pushes it to ElasticSearch so that it can be further analyzed in order to find patterns.

Inspired by `Agile Metrics in Action` book and https://github.com/cwhd/measurementor project   

![alt tag](https://raw.githubusercontent.com/ferzerkerx/agile-metrics-tools/master/screenshots/agile-metrics-tools-1.png) 

### Env configurations
````
JIRA_HOST=
JIRA_API_TOKEN=

SONAR_HOST=
GITHUB_TOKEN=

JENKINS_HOST=
JENKINS_USER=
JENKINS_API_TOKEN=

ES_HOST=
````

### Configurations:
#### app-config.json
````
{
  "indexPrefix": "myindex",
  "modules": [
    {
      "type": "github",
      "configFile": "/your/path/configs/github-config.json"
    },
    {
      "type": "jira",
      "configFile": "/your/path/configs/jira-config.json"
    },
    {
      "type": "jenkins",
      "configFile": "/your/path/configs/jenkins-config.json"
    },
    {
      "type": "sonar",
      "configFile": "/your/path/configs/sonar-config.json"
    },
    {
      "type": "external",
      "configFile": "/your/path/configs/external-config.json"
    }
  ]
}
````

#### external-config.json
````
[
  {
    "metricType": "METRIC",
    "type": "csv",
    "srcType": "file",
    "srcPath": "/your/path/sample.csv",
    "since": "2018-12-03T00:00:00Z"
  }
]
````

#### github-config.json
````
[
  {
    "repositoryName": "your-repo",
    "orgName": "orgName/own",
    "since": "2018-12-03T00:00:00Z"
  }
]
````

#### jenkins-config.json
````
[
   {
      "orgName": "org-name",
      "projectName": "your-project",
      "since": "2018-12-03"
    }
]
````

#### jira-config.json
````
[
  {
    "teamId": 1,
    "since": "2018-12-03",
    "workFlowMap": {
          "Open": 1,
          "In Progress": 3,
          "Code Review": 4,
          "Po Review": 5,
          "Done": 7
        },
        "fields": {
          "storyPoints": "customfield_..."
          "teamName": "customfield_..."
        },
        "estimateConfig": {
            "maxTime": 8,
            "estimationValues": [1, 2, 3, 5, 8]
        }
  }
]
````

#### sonar-config.json
````
[
  {
     "projectName": "your-project",
     "since": "2018-12-03"
  }
]
````

### To use a Dockerized ELK

Please refer to https://elk-docker.readthedocs.io/ , mainly the only thing needed is:
````
sysctl -w vm.max_map_count=262144
docker run -p 5601:5601 -p 9200:9200 -p 5044:5044 -it --name elk sebp/elk
 grep vm.max_map_count /etc/sysctl.conf
````
