import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { Address } from 'algosdk'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { MappingFactory } from '../artifacts/mapping/MappingClient'

describe('Mapping contract', () => {
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
    const factory = localnet.algorand.client.getTypedAppFactory(MappingFactory, {
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

  test('ETH mapping simulation', async () => {
    const { testAccount } = localnet.context
    const { client } = await deploy(testAccount)
    console.log('client.appAddress:', client.appAddress.toString())

    await client.send.setMapping({
      args: { name: 'Peti', content: '123' },  // @todo: pack content with message pack 
    })
    await client.send.setMapping({
      args: { name: 'Kati', content: '28' },
    })
    await client.send.setMapping({
      args: { name: 'James Bond', content: '007' },
    })
    await client.send.setMapping({
      args: { name: 'Douglas Adams', content: '42' },
    })
    await client.send.setMapping({
      args: { name: 'EUR €', content: 'USD €' },
    })

    let result = await client.send.getMapping({   // @todo: unpack content with message pack
      args: { name: 'Peti' },
    })
    expect(result.return).toBe('123')

    result = await client.send.getMapping({
      args: { name: 'Kati' },
    })
    expect(result.return).toBe('28')

    result = await client.send.getMapping({
      args: { name: 'Douglas Adams' },
    })
    expect(result.return).toBe('42')

    result = await client.send.getMapping({
      args: { name: 'James Bond' },
    })
    expect(result.return).toBe('007')

    result = await client.send.getMapping({
      args: { name: 'Bond' },
    })
    expect(result.return).toBe('')

    result = await client.send.getMapping({
      args: { name: 'EUR €' },
    })
    expect(result.return).toBe('USD €')
  })
})
