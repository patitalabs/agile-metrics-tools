## Agile Metrics Tools
[![Build Status](https://travis-ci.org/ferzerkerx/agile-metrics-tools.svg?branch=master)](https://travis-ci.org/ferzerkerx/lego-work-stream-slack)
![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=agile-metrics-tools&metric=alert_status)


Pulls data from:
- Jira
- Jenkins
- Github
- Sonarqube
- Manual external sources

And pushes it to ElasticSearch so that it can be further analyzed in order to find patterns.

Inspired by `Agile Metrics in Action` book and https://github.com/cwhd/measurementor project    

### Env conigurations
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

###Configurations:
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