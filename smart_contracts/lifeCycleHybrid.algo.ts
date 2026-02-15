import { abimethod, assert, baremethod, Contract, Global, log, Txn } from '@algorandfoundation/algorand-typescript'

export class LifeCycleHybrid extends Contract {
  @baremethod()
  public createApplication(): void {
    log('createApp is called with no arguments')
  }

  public hello(name: string): string {
    return `Hello, ${name}`
  }

  @baremethod()
  public deleteApplication(): void {
    assert(Txn.sender === Global.creatorAddress, 'Only the creator can delete the app')
    log('deleteApp is called with no arguments')
  }
}
