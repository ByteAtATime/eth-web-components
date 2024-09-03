import "../index.ts";

import { CopyAddressComponent } from "~/copy-address/copy-address.component.ts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const clipboardMock = vi.fn(() => Promise.resolve());
vi.stubGlobal("navigator", { clipboard: { writeText: clipboardMock } });

const MOCK_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("copy-address", () => {
  let el: CopyAddressComponent;

  beforeEach(() => {
    el = document.createElement("copy-address");
    el.address = MOCK_ADDRESS;
    document.body.appendChild(el);

    vi.useFakeTimers();
  });

  it("should render the component", async () => {
    expect(el).toBeInTheDocument();
  });

  it("should copy the address", async () => {
    el.shadowRoot!.querySelector("button")!.click();

    expect(clipboardMock).toHaveBeenCalledWith(MOCK_ADDRESS);
  });

  it("should change to a success icon after copying", async () => {
    const initialIcon = el.shadowRoot!.querySelector("svg");

    const eventPromise = new Promise<void>((resolve) => {
      el.addEventListener("address-copied", () => resolve(), { once: true });
    });

    el.shadowRoot!.querySelector("button")!.click();

    await eventPromise;

    expect(el.shadowRoot!.querySelector("svg")).toBeInTheDocument();
    expect(el.shadowRoot!.querySelector("svg")).not.toBe(initialIcon);
  });

  afterEach(() => {
    el.remove();

    vi.restoreAllMocks();
  });
});
