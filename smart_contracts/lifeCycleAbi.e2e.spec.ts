import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { Address } from 'algosdk'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { LifeCycleAbiFactory } from './artifacts/LifeCycleAbiClient'

describe('lifeCycleAbi contract', () => {
  const localnet = algorandFixture()
  let appClientGlobal: any

  beforeAll(async () => {
    Config.configure({
      debug: true,
      traceAll: false,
    })
    registerDebugEventHandlers()
    await localnet.newScope()
    appClientGlobal = await deploy(localnet.context.testAccount)
  })

  beforeEach(localnet.newScope)

  const deploy = async (account: Address) => {
    const factory = localnet.algorand.client.getTypedAppFactory(LifeCycleAbiFactory, {
      defaultSender: account,
    })

    const { appClient, result } = await factory.deploy({
      onUpdate: 'append',
      onSchemaBreak: 'append',
      createParams: {
        method: 'createApp',
        args: { param: 'Kilroy was here' },
      },
    })
    // check logs for createApp call 
    const logArray = (result as any).confirmation.logs[0]; 
    const createLog = new TextDecoder().decode(logArray)
    expect(createLog).toBe('createApp is called with param: Kilroy was here');

    await localnet.algorand.send.payment({
      receiver: appClient.appAddress,
      amount: new AlgoAmount({ algo: 1 }),
      sender: localnet.context.testAccount,
    })

    return { client: appClient }
  }

  test('says hello', async () => {
    const result = await appClientGlobal.client.send.hello({ args: { name: 'World' } })
    expect(result.return).toBe('Hello, World')
  })

  test('deleteApp', async () => {
    const result = await appClientGlobal.client.send.delete.deleteApp({ args: { param: 'Kilroy was here, too' } })
    // check logs for deleteApp call
    const logArray = (result as any).confirmation.logs[0]; 
    const createLog = new TextDecoder().decode(logArray)
    expect(createLog).toBe('deleteApp is called with param: Kilroy was here, too');
  })
})
