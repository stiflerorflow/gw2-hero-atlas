/** Only explicit bound states block auctioning; BoE remains tradeable until equipped. */
export function isAuctionBound(binding: string | null | undefined) {
  const value = (binding || "").toLowerCase().replace(/[^a-z]/g, "");
  return [
    "bop",
    "boa",
    "bindonpickup",
    "bindonacquire",
    "bindswhenpickedup",
    "soulbound",
    "questitem",
    "accountbound",
    "warbandbound",
  ].includes(value);
}
