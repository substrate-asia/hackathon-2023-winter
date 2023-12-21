const { checkSignature } = require("./checkSignature");

describe("Signature", () => {
  test("Check signature works", async () => {
    const signedData = `{"roundId":1,"projectId":12,"content":"999","author":"5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk","timestamp":1702648243272}`;
    const address = "5DctGWV3aRtMiapszBwAE4GR9AYEzGM4Gkn5gqyU5nU7R9uk";
    const signature =
      "0x3256c07abb7b7efe62faedf7d615a32389bbe28b06480ca75eee866e9474bd7b39ef689dd50521015e43e7ca1aa5c524a224d30c67c6f8b99058711343365f80";
    const isOk = checkSignature(signedData, signature, address);
    expect(isOk).toBeTruthy();
  });
});
