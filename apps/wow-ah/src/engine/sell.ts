export function sellDecision(
  vendor: number | null,
  gross: number | null,
  quantity: number,
  lostDeposits: number,
  bound: boolean,
  quoteOld = false,
) {
  const vendorTotal = vendor === null ? null : vendor * quantity,
    ahNet =
      bound || gross === null ? null : gross * quantity * 0.95 - lostDeposits,
    extra = ahNet === null || vendorTotal === null ? null : ahNet - vendorTotal;
  const title = bound
    ? "Cannot auction a bound item"
    : vendor === null
      ? "Check the vendor value"
      : gross === null
        ? "AH price unavailable"
        : quoteOld
          ? "Refresh the AH quote"
          : extra !== null && extra <= 0
            ? "Vendor pays at least as much"
            : "AH could pay more";
  return {
    title,
    vendorTotal,
    ahNet,
    extra,
    minGross:
      vendor === null || bound
        ? null
        : Math.floor((vendor + lostDeposits / quantity) / 0.95) + 1,
  };
}
