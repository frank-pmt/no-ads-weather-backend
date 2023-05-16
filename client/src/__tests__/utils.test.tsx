import '@testing-library/jest-dom';
import {formatTemperature, formatWindSpeed, formatDay, formatTime} from "../utils/utils";

describe('Tests util functions', () => {
  test('Test formatTime', () => {
    expect(formatTime("2023-05-15 17:00:00")).toBe("5pm");
    expect(formatTime("2023-05-15 12:00:00")).toBe("12pm");
    expect(formatTime("2023-05-15 22:00:00")).toBe("10pm");
    expect(formatTime("2023-05-15 10:00:00")).toBe("10am");
  });
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

