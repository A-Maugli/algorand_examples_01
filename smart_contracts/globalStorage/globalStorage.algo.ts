import type { bytes, uint64 } from "@algorandfoundation/algorand-typescript";
import {
  Bytes,
  Contract,
  GlobalState,
  Uint64,
  log,
  ensureBudget,
  OpUpFeeSource
} from "@algorandfoundation/algorand-typescript";
import { AppGlobal, concat, extract, btoi } from '@algorandfoundation/algorand-typescript/op'

const GREETING = "Hello"
const CONSTANT = Uint64(42n)
const SET_GREETING_BUDGET = 5000

export class GlobalStorage extends Contract {

  // globalState default key: variable name, i.e. "greeting"
  greeting = GlobalState<string>({ 
    initialValue: GREETING 
  });
  // but to decrease app size, you can redefine key, here to 'c1'
  constant = GlobalState<uint64>({
    key: "c1",
    initialValue: CONSTANT,
  });

  // High level Algorand TypeScript routines
  public setGreeting(newGreeting: string): void {
    ensureBudget(SET_GREETING_BUDGET, OpUpFeeSource.GroupCredit);
    this.greeting.value = newGreeting;
    this.logBytesAsInt("setGreeting: ", Bytes(newGreeting));   
  }

  public getGreeting(): string {
    return this.greeting.value;
  }

  public setConstant(newConstant: uint64): void {
    this.constant.value = newConstant;
  }

  public getConstant(): uint64 {
    return this.constant.value;
  }

  public getConstantPlusOne(): uint64 {
    return this.constant.value + 1;
  }

  // AVM specific low level versions 
  public setGreetingL(newGreeting: string): void {
    ensureBudget(SET_GREETING_BUDGET, OpUpFeeSource.GroupCredit);
    AppGlobal.put(Bytes('greeting'), Bytes(newGreeting))
    this.logBytesAsInt("setGreetingL:", Bytes(newGreeting));
  }

  public getGreetingL(): string {
    let msg: bytes = (AppGlobal.getBytes(Bytes('greeting')))
    return String(msg)
  }

  public setConstantL(newConstant: uint64): void {
    AppGlobal.put(Bytes('c1'), newConstant);
  }

  public getConstantL(): uint64 {
    return AppGlobal.getUint64(Bytes('c1'))
  }

  public getConstantPlusOneL(): uint64 {
    return AppGlobal.getUint64(Bytes('c1')) + 1
  }

  // itoa
  private uint64ToDec(n: uint64): bytes {
    const digits: bytes = Bytes("0123456789")
    let res: bytes = Bytes('')
    res = extract(digits, n%10, 1)
    if (n > digits.length) {
      res = concat(this.uint64ToDec(n/10), extract(digits, n%10, 1))
    }
    return res
  }

  // itoa_hex
  private uint64ToHex(n: uint64): bytes {
    const digits: bytes = Bytes("0123456789ABCDEF")
    let res: bytes = Bytes('0x')
    let s = extract(digits, n%16, 1)
    if (n < digits.length) {
      res = concat(Bytes('0x'), s)
    } else {
      res = concat(this.uint64ToHex(n/16), s)
    }
    return res
  }

  // special log, a in the form of hexa bytes
  private logBytesAsInt(msg: string, a: bytes) {
    let  logMsg: bytes = Bytes('');
    logMsg = concat(logMsg, Bytes(msg))
    for (let i:uint64=0; i<a.length; i++) {
      let c:uint64 = btoi(extract(a, i, 1));
      logMsg = concat(logMsg, this.uint64ToHex(c))
      logMsg = concat(logMsg, Bytes(' '))
    }
    log(logMsg)
  }

}
