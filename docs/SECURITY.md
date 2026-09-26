# Security

BUILD 00 is read-only. It has no wallet connector, private-key parameter, signing code, order endpoint, authentication flow, database, or secret configuration.

The public-address probe accepts only an address and calls the public account-state endpoint. Network data is untrusted and validated before becoming a Contour model. Failed requests become explicit typed errors; they are never silently replaced with fixtures.

Terminal-payoff verification is not a safety guarantee against liquidation, oracle behavior, market outages, or settlement disputes.
