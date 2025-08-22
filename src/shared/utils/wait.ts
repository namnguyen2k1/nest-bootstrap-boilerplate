export async function wait(ms: number): Promise<void> {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
