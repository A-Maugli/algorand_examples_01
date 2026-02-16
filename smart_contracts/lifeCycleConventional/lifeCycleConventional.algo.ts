import { assert, Contract, Global, log, Txn } from '@algorandfoundation/algorand-typescript'
import { ConventionalRouting } from '@algorandfoundation/algorand-typescript/arc4'

export class LifeCycleConventional extends Contract implements ConventionalRouting {
  public createApplication(param: string): void {
    log(`createApplication is called with param: ${param}`)
  }

  public hello(name: string): string {
    return `Hello, ${name}`
  }

  public deleteApplication(param: string): void {
    assert(Txn.sender === Global.creatorAddress, 'Only the creator can delete the app')
    log(`deleteApplication is called with param: ${param}`)
  }
}
