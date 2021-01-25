'use strict';

const { webpackHelper } = require('macaca-wd');

const {
  driver
} = webpackHelper;

const BASE_URL = 'http://127.0.0.1:8000/test';

describe('./test/autoscrollto.test.js', () => {
  before(() => {
    return driver
      .initWindow({
        width: 375,
        height: 600,
        deviceScaleFactor: 2,
      });
  });

  beforeEach(() => {
  });

  afterEach(function () {
    return driver
      .coverage()
      .saveScreenshots(this);
  });

  after(() => {
    return driver
      .openReporter(false)
      .quit();
  });

  describe('autoscrollto', () => {
    it('render should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}`)
        .sleep(1000)
        .execute('window.scrollTo(0, 600)')
        .sleep(1000)
        .getUrl(`${BASE_URL}`)
        .sleep(1000)
        .execute('window.scrollTo(0, 600)')
        .sleep(1000);
    });

    it('render should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}`)
        .sleep(3000);
    });
  });
});
