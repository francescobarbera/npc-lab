export const evaluate = async (
  iterationNumber: number,
  requiredPercentage: number,
  test: () => Promise<boolean>,
) => {
  const testPromises = Array.from({ length: iterationNumber }, async () =>
    test(),
  );

  const results = await Promise.all(testPromises);

  const successCount = results.filter((r) => r === true).length;

  return (
    successCount >= Math.floor((iterationNumber / 100) * requiredPercentage)
  );
};
