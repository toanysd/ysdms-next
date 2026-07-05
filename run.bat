@echo off
set PATH=C:\Program Files\nodejs;%PATH%
npm run test:e2e tests/e2e/workflow.spec.ts
