# Market flip scanner and historical price context

The default `#scanner` route works without professions, inventory or character setup. `#opportunities` remains compatible and is labelled Crafting in navigation. Existing profiles and backups are unchanged.

The scanner reads AHledger's public market/deals endpoints only. It does not fetch profession catalogues or apply character-specific quotes, inventory or budgets. Presets choose active markets, deep discounts or broad discounted leads. Advanced filters use the provider's validated options: discount15/25/35/50/70%, minimum estimated daily units0/1/10/100, minimum listed quantity1/5/20/100. Results are capped at200 provider leads; search is within those leads, not a complete auction catalogue. Sorting can prioritize activity, potential unit profit, return on cash or low purchase prices.

Default current-spread resale assumption is the lower of the latest median asks and90% of the provider's named historical reference asks, adjustable to80/90/100%. Historical recovery is a separate speculative mode. Potential profit applies the5% AH cut once and is shown before lost deposits. Calculator inputs can test another exit price, lost-deposit allowance and whole-unit quantity. Quantities above total listed supply are marked unsupported; price depth at the cheapest quote is always unverified. No trading is automated and market demand is not assumed to become the user's personal sales.

Each candidate shows current buy price, reference discount, potential profit, daily rate, listed stock and approximate days of supply. A zero inferred rate differs from unavailable rate data. A current-scan reference is explicitly distinguished from a7/30-day historical reference.

Open Price history & calculator, then Load price history & demand coverage. The existing seven-day price-detail endpoint supplies lowest/median asking-price snapshots and reported daily-rate coverage. The chart offers24h/7d views, shows the current buy quote and compares it with the observed median-ask range. This is listing history, not confirmed sales or a fair-value forecast. Sparse/missing observations remain visible; no synthetic continuous history is archived.

Source adapter preserves provider windowDays, coveredHours and method link. Loading a24h chart does not change the provider's sales-estimate window. Provider data remains in TTL-limited memory, never profile exports. Filters/scenarios last only for the visit. Optional saving to the selected character's watchlist is available inside details; no sales-log bookkeeping is required to scan.

Verified against live public API2026-11-14. The deals400 validation response documents valid filter values, sorts saving/discount/sales and limit1–200. The successful deals response identifies the reference basis, quantity, inferred sales/day, item attribution URL and observation time. No unsupported endpoint or historical sales count was invented.

[Live validation findings and cross-source checks](MARKET_VALIDATION.md) explain why historical price recovery is now opt-in, and document vendor competition and quote freshness.
