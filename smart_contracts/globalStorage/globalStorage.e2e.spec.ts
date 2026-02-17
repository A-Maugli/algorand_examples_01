import { Config } from "@algorandfoundation/algokit-utils";
import { registerDebugEventHandlers } from "@algorandfoundation/algokit-utils-debug";
import { algorandFixture } from "@algorandfoundation/algokit-utils/testing";
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { transactionFees } from "@algorandfoundation/algokit-utils";
import { Address } from "algosdk";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { GlobalStorageFactory } from "../artifacts/globalStorage/GlobalStorageClient";
import { nullLogger } from "@algorandfoundation/algokit-utils/types/logging";

describe("HelloWorld contract", () => {
  const localnet = algorandFixture();
  const C_Hello = "Hello";
  const C_42 = 42n;
  const C_2UP64 = BigInt(2 ** 64);
  const SET_GREETING_EXTRA_TX = Math.floor(5000/700);

  beforeAll(() => {
    Config.configure({
      debug: true,
      traceAll: false,
      logger: nullLogger,
    });
    registerDebugEventHandlers();
  });

  beforeEach(localnet.newScope);

  const deploy = async (account: Address) => {
    const factory = localnet.algorand.client.getTypedAppFactory(
      GlobalStorageFactory,
      {
        defaultSender: account,
      },
    );

    const { appClient } = await factory.deploy({
      onUpdate: "append",
      onSchemaBreak: "append",
    });

    await localnet.algorand.send.payment({
      receiver: appClient.appAddress,
      amount: new AlgoAmount({ algo: 1 }),
      sender: localnet.context.testAccount,
    });

    return { client: appClient };
  };

  test("test getGreeting()", async () => {
    const { testAccount } = localnet.context;
    const { client } = await deploy(testAccount);
    const result = await client.send.getGreeting();
    expect(result.return).toBe(C_Hello);
  });

  test("test setGreeting()", async () => {
    const { testAccount } = localnet.context;
    const { client } = await deploy(testAccount);
    await client.send.setGreeting({ 
      args: { newGreeting: "Ciao" },
      maxFee: AlgoAmount.MicroAlgos(SET_GREETING_EXTRA_TX*1000+3000),
      extraFee: transactionFees(SET_GREETING_EXTRA_TX),
     });
    // for every tests a new app is created, so the getter is called in the same test
    const result = await client.send.getGreeting();
    expect(result.return).toBe("Ciao");
  });

  test("test some special chars", async () => {
    const msg = "Hello 🌍, árvíztűrő tükörfúrógép 😊";
    const { testAccount } = localnet.context;
    const { client } = await deploy(testAccount);
    await client.send.setGreeting({
      args: { newGreeting: msg },
      maxFee: AlgoAmount.MicroAlgos(SET_GREETING_EXTRA_TX*1000+3000),
      extraFee: transactionFees(SET_GREETING_EXTRA_TX),
    });
    const result = await client.send.getGreeting();
    expect(result.return).toBe(msg);
  });

  test("test getConstant()", async () => {
    const { testAccount } = localnet.context;
    const { client } = await deploy(testAccount);
    const result = await client.send.getConstant();
    expect(result.return).toBe(C_42);
  });

  test("test getConstantPlusOne()", async () => {
    const { testAccount } = localnet.context;
    const { client } = await deploy(testAccount);
    const result = await client.send.getConstantPlusOne();
    expect(result.return).toBe(C_42 + 1n);
  });

  test("test setConstant()", async () => {
    const { testAccount } = localnet.context;
    const { client } = await deploy(testAccount);
    await client.send.setConstant({
      args: {
        newConstant: C_2UP64 - 1n,
      },
    });
    // for every tests a new app is created, so the getter in called the same test
    const result1 = await client.send.getConstant();
    expect(result1.return).toBe(C_2UP64 - 1n);
  });

  test("test for overflow getConstantPlusOne()", async () => {
    const { testAccount } = localnet.context;
    const { client } = await deploy(testAccount);
    const result = await client.send.setConstant({
      args: {
        newConstant: C_2UP64 - 1n,
      },
    });
    await expect(client.send.getConstantPlusOne()).rejects.toThrow(
      Error,
    ); // Overflow
  });

  test("test some special chars L", async () => {
    const msg = "Hello 🌍, árvíztűrő tükörfúrógép 😊";
    const { testAccount } = localnet.context;
    const { client } = await deploy(testAccount);
    await client.send.setGreetingL({
      args: { newGreeting: msg },
      maxFee: AlgoAmount.MicroAlgos(SET_GREETING_EXTRA_TX*1000+3000),
      extraFee: transactionFees(SET_GREETING_EXTRA_TX),
    });
    const result = await client.send.getGreeting();
    expect(result.return).toBe(msg);
  });
});
