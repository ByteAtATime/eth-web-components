import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../index.ts";
import { EnsAvatarComponent } from "~/ens-avatar/ens-avatar.component.ts";
import { blo } from "blo";

const MOCK_AVATAR = "https://example.com/avatar.png";
const MOCK_ADDRESS = "0x0000000000000000000000000000000000000000";
const ADDRESS_BLOCKIE = blo(MOCK_ADDRESS);

describe("ens-avatar", () => {
  let el: EnsAvatarComponent;

  beforeEach(() => {
    el = document.createElement("ens-avatar");
    document.documentElement.appendChild(el);
    el.address = MOCK_ADDRESS;
  });

  it("should render the component", async () => {
    expect(el).toBeInTheDocument();
  });

  it("should render the avatar image given", async () => {
    el.avatarUri = MOCK_AVATAR;

    await expect
      .poll(() => el.shadowRoot!.querySelector("img")?.src)
      .toBe(MOCK_AVATAR);
  });

  it("should render the address blockie if no avatarUri is provided", async () => {
    expect(el.shadowRoot!.querySelector("img")?.src).toBe(ADDRESS_BLOCKIE);
  });

  it("should have an alt attribute", async () => {
    expect(el.shadowRoot!.querySelector("img")?.alt).to.not.be.empty;
  });

  afterEach(() => {
    el.remove();
  });
});
