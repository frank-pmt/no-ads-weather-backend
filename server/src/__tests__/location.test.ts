import {describe, beforeEach, expect, test, jest} from '@jest/globals';
import {
  createRequest, createResponse, MockRequest, MockResponse,
} from 'node-mocks-http';
import {LocationApi} from "../location";


let readFileResponse= "";
let readFileResponseOk: string;
let readFileResponseNoMatch: string;
let shouldFail = false;

const readFileMock = (file:string, encoding:string, callback:any) => {
  return callback(null, readFileResponse);
}

const readFileFailingMock = (file:string, encoding:string, callback:any) => {
  throw 'error reading file';
}

jest.mock('fs', () => {

  return {
    readFile: (file:string, encoding:string, callback:any) => {
      if (!shouldFail) {
        return readFileMock(file, encoding, callback);
      } else {
        return readFileFailingMock(file, encoding, callback);
      }
    }
  }

});

describe('Location API tests', () => {

  beforeEach(() => {
    const line1 = '1\tAmsterdam\t_\t_\t1\t2\t_\t_\tNL\t_\t_\t_';
    const line2 = '1\tHelsinki\t_\t_\t1\t2\t_\t_\tFI\t_\t_\t_';
    const line3 = '1\tParis\t_\t_\t1\t2\t_\t_\tFR\t_\t_\t_';
    readFileResponseOk = `${line1}\n${line2}\n${line3}\n`
    readFileResponseNoMatch = 'No match.';
    shouldFail = false;
  });


  test('Test Search', async function () {
    const response = createResponse();

    const request = createRequest({
      method: 'GET',
      url: '/api/location/search?q=Paris',
    });

    readFileResponse = readFileResponseOk;

    new LocationApi().processLocationRequest(request, response)

    const data = response._getData();

    expect(response.statusCode).toBe(200);
    expect(response._isJSON()).toBe(true);
    expect(JSON.parse(data).length).toBe(1);

  }, 1000);


  test('Test Search No Match', async function () {
    const response = createResponse();

    const request = createRequest({
      method: 'GET',
      url: '/api/location/search?q=Paris',
    });

    readFileResponse = readFileResponseNoMatch;

    new LocationApi().processLocationRequest(request, response)

    const data = response._getData();

    expect(response.statusCode).toBe(200);
    expect(response._isJSON()).toBe(true);
    expect(JSON.parse(data).length).toBe(0);

  }, 1000);

  test('Test Search Fails', async function () {
    const response = createResponse();

    const request = createRequest({
      method: 'GET',
      url: '/api/location/search?q=Paris',
    });

    shouldFail = true;

    new LocationApi().processLocationRequest(request, response)

    const data = response._getData();

    expect(response.statusCode).toBe(500);
    expect(response._isJSON()).toBe(true);
    expect(JSON.parse(data).error).toBe('error reading file');

  }, 1000);

});