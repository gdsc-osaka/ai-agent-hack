import { InvalidUserError, validateUser } from "../../../src/domain/user";
import { ok } from "neverthrow";
import { toTimestamp } from "../../../src/domain/timestamp";

describe("validateUser", () => {
  it("returns valid User object for correct DBUser input", () => {
    const validDBUser = {
      id: "user123",
      uid: "uid123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = validateUser(validDBUser);

    expect(result).toEqual(
      ok({
        id: "user123",
        uid: "uid123",
        createdAt: toTimestamp(validDBUser.createdAt),
        updatedAt: toTimestamp(validDBUser.updatedAt),
      })
    );
  });

  it("returns InvalidUserError for missing required fields", () => {
    const invalidDBUser = {
      id: "",
      uid: "uid123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = validateUser(invalidDBUser);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(InvalidUserError.isFn(result.error)).toBe(true);
      expect(result.error.extra?.id?.length).toBeGreaterThan(0);
    }
  });
});
