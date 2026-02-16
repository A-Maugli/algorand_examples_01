import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Bytes, contract, Contract, err, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'
import { Box } from '@algorandfoundation/algorand-typescript/op'

export class Mapping extends Contract {

  // ETH mapping simulation with Box routines

  // mapping(string => string) public nameToFavouriteSomething;
  public setMapping(name: string, content: string): void {
    Box.delete(Bytes(name)) // ensure old value is deleted and box is recreated with correct length
    Box.put(Bytes(name), Bytes(content))
  }

  public getMapping(name: string): string {
    const [content, exists] = Box.get(Bytes(name))
    if (!exists) {
      return ''
    }
    return content.toString()
  }

}
