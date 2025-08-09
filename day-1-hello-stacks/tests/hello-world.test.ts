import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";
import { tx } from "@hirosystems/clarinet-sdk";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Hello World Contract", () => {
  it("should get default greeting", () => {
    const result = simnet.callReadOnlyFn(
      "hello-world",
      "get-greeting",
      [],
      deployer
    );

    expect(result.result).toBeAscii("Hello, World!");
  });

  it("should allow owner to set greeting", () => {
    const block = simnet.mineBlock([
      tx.callPublicFn(
        "hello-world",
        "set-greeting",
        [Cl.stringAscii("Hello, Stacks!")],
        deployer
      ),
    ]);

    expect(block[0].result).toBeOk(Cl.stringAscii("Hello, Stacks!"));

    // Verify greeting was updated
    const result = simnet.callReadOnlyFn(
      "hello-world",
      "get-greeting",
      [],
      deployer
    );

    expect(result.result).toBeAscii("Hello, Stacks!");
  });

  it("should not allow non-owner to set greeting", () => {
    const block = simnet.mineBlock([
      tx.callPublicFn(
        "hello-world",
        "set-greeting",
        [Cl.stringAscii("Hacked!")],
        wallet1
      ),
    ]);

    expect(block[0].result).toBeErr(Cl.uint(100));
  });

  it("should allow users to set personal greetings", () => {
    const block = simnet.mineBlock([
      tx.callPublicFn(
        "hello-world",
        "set-user-greeting",
        [Cl.stringAscii("Hello from Wallet 1!")],
        wallet1
      ),
      tx.callPublicFn(
        "hello-world",
        "set-user-greeting",
        [Cl.stringAscii("Greetings from Wallet 2!")],
        wallet2
      ),
    ]);

    expect(block[0].result).toBeOk(Cl.stringAscii("Hello from Wallet 1!"));
    expect(block[1].result).toBeOk(Cl.stringAscii("Greetings from Wallet 2!"));

    // Verify individual greetings
    const result1 = simnet.callReadOnlyFn(
      "hello-world",
      "get-user-greeting",
      [Cl.principal(wallet1)],
      wallet1
    );

    const result2 = simnet.callReadOnlyFn(
      "hello-world",
      "get-user-greeting",
      [Cl.principal(wallet2)],
      wallet2
    );

    expect(result1.result).toBeAscii("Hello from Wallet 1!");
    expect(result2.result).toBeAscii("Greetings from Wallet 2!");
  });
});
