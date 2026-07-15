# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Create an automated end-to-end integration test suite to verify the complete business workflow in YSDMS-NextGen, covering customer contact, tray design orders, tray production orders, and mold orders using the completed system modules.

Working directory: `E:\AntiGravity\apps\ysdms-nextgen`
Integrity mode: demo

## Requirements

### R1. End-to-End UI Testing
Implement an automated UI test suite (e.g., using Playwright) that simulates a user navigating through the Next.js application. The test must successfully create a new order starting from the business contact phase, proceed to ordering a tray design, create a tray production order, and finally create a mold order.

### R2. Black-box Implementation
The team must implement the tests based strictly on the provided business workflow requirements and by observing the UI behavior. You are prohibited from reading the application's underlying source code to infer expected behaviors or test setups.

## Acceptance Criteria

### Test Execution
- [ ] A testing framework (e.g., Playwright) is correctly configured in the project if not already present.
- [ ] A dedicated npm command (e.g., `npm run test:e2e`) is available to run the test suite.
- [ ] The test suite successfully completes the full order creation flow (contact -> design -> tray -> mold) against the locally running application and outputs a clear pass/fail report.
