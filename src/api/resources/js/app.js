((global) => {
  const formatDate = (theDate) => {
    return theDate.toISOString().substring(0, 10);
  };

  const defaultSampleSince = (referenceDate) => {
    const since = new Date(referenceDate.toISOString());
    since.setDate(since.getDate() - 1);
    return formatDate(since);
  };

  const prettyJson = (theObj) => {
    return JSON.stringify(theObj, null, 2);
  };

  const sampleJira = (referenceDate = new Date()) => {
    return {
      teamId: 1,
      teamName: 'someTeam',
      since: defaultSampleSince(referenceDate),
      workFlowMap: {
        Open: 1,
        'In Progress': 3,
        'Code Review': 4,
        'Po Review': 5,
        Done: 7,
      },
      fields: {
        storyPoints: 'customfield_10005',
      },
      estimateConfig: {
        maxTime: 7,
        estimationValues: [1, 2, 3, 5, 8],
      },
    };
  };
  const sampleGithub = (referenceDate = new Date()) => {
    return {
      repositoryName: 'your-repo',
      teamName: 'someTeam',
      orgName: 'someOrg',
      since: defaultSampleSince(referenceDate),
    };
  };
  const sampleJenkins = (referenceDate = new Date()) => {
    return {
      orgName: 'someOrg',
      teamName: 'someTeam',
      projectName: 'your-project',
      since: defaultSampleSince(referenceDate),
    };
  };
  const sampleSonar = (referenceDate = new Date()) => {
    return {
      projectName: 'your-project',
      teamName: 'someTeam',
      since: defaultSampleSince(referenceDate),
    };
  };

  const externalSampleBuilder = (
    { metricType, columns },
    referenceDate = new Date()
  ) => {
    return {
      metricType: metricType,
      since: defaultSampleSince(referenceDate),
      type: 'csv',
      srcType: 'inline',
      inlineData: [
        {
          createdAt: formatDate(referenceDate),
          teamName: 'someTeam',
          ...columns,
        },
      ],
    };
  };

  const sampleExternalConfig = (referenceDate = new Date()) => {
    return externalSampleBuilder(
      {
        metricType: 'METRIC-NAME',
        columns: {
          colOne: 0,
          colTwo: 'value',
        },
      },
      referenceDate
    );
  };

  const sampleForValue = (theValue, optionText) => {
    const mappings = {};
    mappings['jira-Jira'] = sampleJira;
    mappings['github-Github'] = sampleGithub;
    mappings['jenkins-Jenkins'] = sampleJenkins;
    mappings['sonar-Sonarqube'] = sampleSonar;
    mappings[`external-External`] = sampleExternalConfig;
    return mappings[`${theValue}-${optionText}`]();
  };

  const aceEditor = ace.edit('editor');
  const editorContainerDom = document.getElementById('editorContainer');
  const formDom = document.getElementById('inputForm');
  const errorDom = document.getElementById('errorDiv');
  const successDom = document.getElementById('successDiv');
  const submitButtonDom = document.getElementById('submitBtn');
  const sampleBtnDom = document.getElementById('sampleBtn');

  const configurationFromText = (configStr) => {
    try {
      const configObj = JSON.parse(configStr);

      return Array.isArray(configObj) ? configObj : [configObj];
    } catch (e) {
      console.warn(e.message);
      return null;
    }
  };

  const createRequest = (form) => {
    const startDate = form.startDate.valueAsDate || null;
    const endDate = form.endDate.valueAsDate || null;
    const teamName = form.teamName ? form.teamName.value || null : null;
    const shouldUpdateEntries = form.shouldReplace.checked || false;
    const serviceName = form.serviceName
      ? form.serviceName.value || null
      : null;
    const mode = form.mode.value || 'byTeam';

    let config = null;
    if (mode === 'byTeam') {
      if (!teamName) {
        throw Error('team is required.');
      }
      if (!startDate && endDate) {
        throw Error('Start date is required.');
      }
      if (startDate && endDate && endDate < startDate) {
        throw Error('Invalid date range.');
      }
    } else {
      if (!serviceName) {
        throw Error('serviceName is required.');
      }
      config = configurationFromText(aceEditor.getValue());
      if (!config) {
        throw Error('Valid configuration is required on Service Name Mode.');
      }
    }

    return {
      startDate,
      endDate,
      shouldUpdateEntries,
      teamName,
      serviceName,
      config: config,
    };
  };

  const sendRequest = (request) => {
    const url = `/metrics/`;
    fetch(url, {
      method: request.shouldUpdateEntries ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  };

  const handleFormSubmit = (e) => {
    submitButtonDom.disabled = true;
    try {
      e.preventDefault();
      const form = e.target;
      errorDom.innerText = '';
      successDom.innerText = '';
      const request = createRequest(form);
      sendRequest(request);
      successDom.innerText =
        'Your request is being processed... be advised that this can take several minutes.';

      global.setTimeout(() => {
        successDom.innerText = '';
        submitButtonDom.disabled = false;
      }, 4000);
    } catch (e) {
      errorDom.innerText = `Error: ${e.message}`;
    }
  };

  const toggleModeType = (e) => {
    const searchType = e.target.value;
    if (searchType === 'byTeam') {
      formDom.teamName.disabled = false;
      formDom.serviceName.disabled = true;
      formDom.startDate.disabled = false;
      formDom.endDate.disabled = false;
      editorContainerDom.classList.toggle('hidden');
      return;
    }

    formDom.teamName.disabled = true;
    formDom.serviceName.disabled = false;
    formDom.startDate.disabled = true;
    formDom.endDate.disabled = true;
    editorContainerDom.classList.remove('hidden');
  };

  const setSample = (e) => {
    e.preventDefault();
    const selectedService = formDom.serviceName.value;
    const optionText =
      formDom.serviceName.options[formDom.serviceName.selectedIndex].innerText;
    const sample = sampleForValue(selectedService, optionText);
    if (sample) {
      const jsonString = prettyJson([sample]);
      aceEditor.setValue(jsonString, -1);
    }
  };

  const cleanup = (modeRadios) => {
    global.onunload = () => {
      formDom.removeEventListener('submit', handleFormSubmit);
      for (const radio of modeRadios) {
        radio.removeEventListener('click', toggleModeType);
      }
      sampleBtnDom.removeEventListener('click', setSample);
    };
  };

  const addEventListeners = () => {
    if (!formDom) {
      throw Error('cannot start app because inputForm is not there.');
    }
    formDom.addEventListener('submit', handleFormSubmit);
    sampleBtnDom.addEventListener('click', setSample);

    const modeRadios = formDom.elements.mode;
    for (const radio of modeRadios) {
      radio.addEventListener('click', toggleModeType);
    }
    cleanup(modeRadios);
  };

  const setupEditor = () => {
    aceEditor.setTheme('ace/theme/monokai');
    aceEditor.session.setMode('ace/mode/json');
  };

  const start = () => {
    addEventListeners();
    setupEditor();
  };

  start();
})(window);
