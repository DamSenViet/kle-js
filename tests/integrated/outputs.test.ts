import fs from 'fs';
import path from 'path';
import { Keyboard, KeyboardJSON } from '../../package/index';

const inputsPath: string = path.resolve(__dirname, '..', 'inputs');
const outputsPath: string = path.resolve(__dirname, '..', 'outputs');

fs.mkdirSync(outputsPath, { recursive: true });

const filePaths: Array<string> = (() => {
  try { return fs.readdirSync(inputsPath); }
  catch { return []; }
})()
  .filter(filePath => filePath.endsWith('.json'))
  .map(filePath => path.resolve(inputsPath, filePath));

const inputs = filePaths.map(filePath => {
  const filename = filePath.replace(/^.*[\\\/]/, '');
  return {
    filename,
    inputPath: filePath,
    outputPath: path.resolve(outputsPath, filename),
  };
});

describe.each(inputs)('$outputPath', ({
  inputPath,
  outputPath,
}) => {
  it(`matches ${inputPath}`, () => {
    const encoding = 'utf-8';
    const inputFile: string = fs.readFileSync(inputPath, encoding);
    const keyboardJSON: KeyboardJSON = JSON.parse(inputFile);
    const keyboard: Keyboard  = Keyboard.fromJSON(keyboardJSON);
    const outputFile: string = JSON.stringify(keyboard.toJSON(), null, '  ');
    fs.writeFileSync(outputPath, outputFile, { encoding });
    expect(outputFile).toBe(inputFile);
  });
});
