# Fixing "invalid ApplicationArgs index 0" error in Algorand contract deployment

Date created: 15-Feb-2025

## The Problem

When deploying an Algorand contract with `factory.deploy()`, app creation fails with:
```
invalid ApplicationArgs index 0
```

## Root cause

The compiler generates ABI-compliant code for `createApplication()` 
and `deleteApplication()` (using conventional routing), but `factory.deploy()` 
still uses bare call convention for app creation. During a bare creation call, 
`ApplicationArgs[0]` doesn't exist, causing the TEAL code to fail when it tries 
to access it for method routing.

## The Fix

1. Explicitly specify the creation method in `deploy()`:

```typescript
const { appClient } = await factory.deploy({
  onUpdate: 'append',
  onSchemaBreak: 'append',
  createParams: {
    method: 'createApplication',  // or your custom method name
    args: {},
  }
})
```

## Recommended Changes

Two changes would prevent this confusion:

1. Make the compiler assume ABI convention for creation/deletion methods by default

2. Make `factory.deploy()` use ABI convention implicitly when no createParams is provided

This aligns with the ecosystem's move toward ABI conventions everywhere, 
hiding low-level bare call details from casual users.
