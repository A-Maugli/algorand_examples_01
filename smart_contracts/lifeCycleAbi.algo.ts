import { abimethod, assert, Contract, Global, log, Txn } from '@algorandfoundation/algorand-typescript'

export class LifeCycleAbi extends Contract {
  @abimethod({ onCreate: 'require' })
  public createApp(param: string): void {
    log(`createApp is called with param: ${param}`)
  }

  public hello(name: string): string {
    return `Hello, ${name}`
  }

  @abimethod({ allowActions: ['DeleteApplication'] })
  public deleteApp(param: string): void {
    assert(Txn.sender === Global.creatorAddress, 'Only the creator can delete the app')
    log(`deleteApp is called with param: ${param}`)
  }
}