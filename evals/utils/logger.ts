function logTestPassed(message: string) {
  console.log(`\x1b[32mTest passed: \x1b[0m${message}`);
}

function logTestFailed(message: string) {
  console.log(`\x1b[31mTest failed: \x1b[0m${message}`);
}

export function logTestResult(message: string, passed: boolean) {
  if (passed) {
    logTestPassed(message);
  } else {
    logTestFailed(message);
  }
}
