import '@testing-library/jest-dom';
import {formatTemperature, formatWindSpeed, formatDay} from "../utils/utils";

describe('Tests util functions', () => {
  test('Test formatTemperature', () => {
    expect(formatTemperature(17.23)).toBe("17");
  });
  test('Test formatTemperature', () => {
    expect(formatWindSpeed(36.7)).toBe("37");
  });
  test('Test formatDay', () => {
    expect(formatDay("2023-05-15 17:00:00")).toBe("15/5");
  });
});

