# Algorand app creation and deletion using Puya-ts

Date created: 15-Feb-2025

## Current patterns for app creation

Note: Only the bare call pattern works without `createParams` today. 

| Pattern	| Creation Method	| Deployment Call |
| ------- | --------------- | --------------- |
| Bare call	| @baremethod()<br>createApplication()	| factory.deploy({}) |
| Conventional routing | createApplication()<br>(no decorator)	| factory.deploy({ createParams:<br>{ method: 'createApp' } }) |
| ABI method	| @abimethod({ onCreate: 'require' })<br>createApp()	| factory.deploy({ createParams:<br>{ method: 'createApp' } }) |

## Current patterns for app deletion

| Pattern	| Deletion Method	| Deletion Call |
| ------- | --------------- | ------------- |
| Bare call	| @baremethod()<br>deleteApplication()	| await client.send.delete.bare() |
| Conventional routing | deleteApplication()<br>(no decorator)	| await client.send.delete.deleteApplication(<br>{args: { param: 'Goodbye' }}) |
| ABI method	| @abimethod({<br>allowActions: ['DeleteApplication'] })<br>public deleteApp(param1: type1,...): void {...}	| await client.send.delete.deleteApp<br>({ args: { param1: value1, ... } }) |

## Current pattern for method call

| Pattern	| Method definiton	| Method Call |
| ------- | ----------------- | ------------- |
| ABI method	| @abimethod()<br>public methodName(param1: type1,...): void {...}	| await client.send.methodName<br>({ args: { param1: value1, ... } }) |

## Examples

### Algorand contracts

<a href="./smart_contracts/lifeCycleHybrid/lifeCycleHybrid.algo.ts">App using **bare call** for app creation and deletion</a>

<a href="./smart_contracts/lifeCycleConventional/lifeCycleConventional.algo.ts">App using **conventional routing** for app creation and deletion</a>

<a href="./smart_contracts/lifeCycleAbi/lifeCycleAbi.algo.ts">App using **ABI routing** for app creation and deletion</a>

<a href="./smart_contracts/calculator/calculator.algo.ts">Calculator</a>

<a href="./smart_contracts/mapping/mapping.algo.ts">Ethereum-like mapping using boxes</a>

### Commands to run after GIT checkout
```
algokit localnet start
npm install
npm run build
npm run test
```

To run a specific test file, e.g. `calculator.e2e.spec.ts`, use command
```
npx vitest run calculator.e2e.spec.ts 
```
or
```
npm run test:one calculator.e2e.spec.ts
```

## References

<a  href="https://algorandfoundation.github.io/puya-ts/documents/Algorand_TypeScript_Language_Guide.Program_Structure.html">Algorand TypeScript, Program Structure</a>

<a href="https://algorandfoundation.github.io/puya-ts/documents/Reference_docs.ABI_Routing.html">Algorand Typescript, ABI routing</a>

<a href="https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/capabilities/app-client.md">Algokit-utils-ts, App client and App factory</a>

