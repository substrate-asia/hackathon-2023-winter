import { exportCallDataGroth16 } from "../snarkjsZkproof";

export async function sudokuCalldata(unsolved, solved) {
  const input = {
    unsolved: unsolved,
    solved: solved,
  };

  let dataResult;

  try {
    dataResult = await exportCallDataGroth16(
      input,
      process.env.PUBLIC_URL + "/zkproof/sudoku/sudoku.wasm",
      process.env.PUBLIC_URL + "/zkproof/sudoku/sudoku_0001.zkey"
    );
  } catch (error) {
    console.log(error);
    window.alert("Wrong answer");
  }

  return dataResult;
}
