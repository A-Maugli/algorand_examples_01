import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, err } from '@algorandfoundation/algorand-typescript'

export class Calculator extends Contract {

  private add(a: uint64, b: uint64): uint64 {
    return a + b
  }

  private sub(a: uint64, b: uint64): uint64 {
    return a - b
  }

  private mul(a: uint64, b: uint64): uint64 {
    return a * b
  }

  private div(a: uint64, b: uint64): uint64 {
    return a / b
  }

  public calculator(op: string, a: uint64, b: uint64): uint64 {
    if (op === '+') {
      return this.add(a, b)
    } else if (op === '-') {
      return this.sub(a, b)
    } else if (op === '*') {
      return this.mul(a, b)
    } else if (op === '/') {
      return this.div(a, b)
    } else {
      //throw new Error('Unsupported operation')
      err('Unsupported operation')
    }
  }
}