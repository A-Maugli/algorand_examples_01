import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { Address } from 'algosdk'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { CalculatorFactory } from '../artifacts/calculator/CalculatorClient'

describe('Calculator contract', () => {
  const localnet = algorandFixture()
  beforeAll(() => {
    Config.configure({
      debug: true,
      traceAll: false,
    })
    registerDebugEventHandlers()
  })
  beforeEach(localnet.newScope)

  const deploy = async (account: Address) => {
    const factory = localnet.algorand.client.getTypedAppFactory(CalculatorFactory, {
      defaultSender: account,
    })

    const { appClient } = await factory.deploy({
      onUpdate: 'append',
      onSchemaBreak: 'append',
    })

    await localnet.algorand.send.payment({
      receiver: appClient.appAddress,
      amount: new AlgoAmount({ algo: 1 }),
      sender: localnet.context.testAccount,
    })

    return { client: appClient }
  }

  test('calculator("-",5,3) returns 2', async () => {
    const { testAccount } = localnet.context
    const { client } = await deploy(testAccount)
    const result = await client.send.calculator({ args: { op: '-', a: 5, b: 3 } })
    expect(result.return).toBe(2n)
  })

  test('calculator("-",5,3) throws error', async () => {
    const { testAccount } = localnet.context
    const { client } = await deploy(testAccount)
    await expect(
      client.send.calculator({ args: { op: '-', a: 3, b: 5 } }))
      .rejects.toThrow(Error);
  })

  test('calculator("*",5,3) returns 15', async () => {
    const { testAccount } = localnet.context
    const { client } = await deploy(testAccount)
    const result = await client.send.calculator({ args: { op: '*', a: 5, b: 3 } })
    expect(result.return).toBe(15n)
  })

  test('calculator("/",5,0) throws error', async () => {
    const { testAccount } = localnet.context
    const { client } = await deploy(testAccount)
    await expect(
      client.send.calculator({ args: { op: '/', a: 5, b: 0 } }))
      .rejects.toThrow(Error);
  })

  test('calculator("?",5,3) throws err', async () => {
    const { testAccount } = localnet.context
    const { client } = await deploy(testAccount)
    try {
      const result = await client.send.calculator({ args: { op: '?', a: 5, b: 3 } })
    } catch (e) {
      expect(e).instanceOf(Error)
    }
  })

})
