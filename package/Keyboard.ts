import Metadata from './Metadata';
import Key from './Key';
import Switch from './Switch';
import Label from './Label';
import Ajv from 'ajv';

import backgroundSchema from './kle-json/v1/Background.schema.json';
import clusterSchema from './kle-json/v1/Cluster.schema.json';
import keyboardSchema from './kle-json/v1/Keyboard.schema.json';
import keyLabelsSchema from './kle-json/v1/KeyLabels.schema.json';
import metadataSchema from './kle-json/v1/Metadata.schema.json';
import keyChangesSchema from './kle-json/v1/KeyChanges.schema.json';

type KeyLabel = string;
type KeyChanges = { [key: string]: any };
type MetadataChanges = { [key: string]: any };
export type KeyboardJSON = Array<MetadataChanges | Array<KeyLabel | KeyChanges>>

const ajv = new Ajv({ allErrors: true, strictTuples: false });
for (const schema of [
  backgroundSchema,
  clusterSchema,
  keyboardSchema,
  keyChangesSchema,
  keyLabelsSchema,
  metadataSchema,
])
  ajv.addSchema(schema);
/**
 * Preloaded keyboard schema validation function.
 */
const validate = ajv.compile<KeyboardJSON>(keyboardSchema);

/**
 * Iteration helper used with `Array.prototype.map`.
 * @param e - Array element.
 * @param i - Array index.
 * @returns Array element-index pair.
 */
const enumerate = <T>(e: T, i: number): [T, number] => [e, i];

/**
 * Alignment to used label indexes.
 * -1 indicates not used.
 */
const labelMap = [
  [0, 6, 2, 8, 9, 11, 3, 5, 1, 4, 7, 10], // 0 = no centering
  [1, 7, -1, -1, 9, 11, 4, -1, -1, -1, -1, 10], // 1 = center x
  [3, -1, 5, -1, 9, 11, -1, -1, 4, -1, -1, 10], // 2 = center y
  [4, -1, -1, -1, 9, 11, -1, -1, -1, -1, -1, 10], // 3 = center x & y
  [0, 6, 2, 8, 10, -1, 3, 5, 1, 4, 7, -1], // 4 = center front (default)
  [1, 7, -1, -1, 10, -1, 4, -1, -1, -1, -1, -1], // 5 = center front & x
  [3, -1, 5, -1, 10, -1, -1, -1, 4, -1, -1, -1], // 6 = center front & y
  [4, -1, -1, -1, 10, -1, -1, -1, -1, -1, -1, -1], // 7 = center front & x & y
];

/**
 * Label index to disallowed alignment options.
 */
const disallowedAlignnmentForLabels = [
  [1, 2, 3, 5, 6, 7], // 0
  [2, 3, 6, 7], // 1
  [1, 2, 3, 5, 6, 7], // 2
  [1, 3, 5, 7], // 3
  [], // 4
  [1, 3, 5, 7], // 5
  [1, 2, 3, 5, 6, 7], // 6
  [2, 3, 6, 7], // 7
  [1, 2, 3, 5, 6, 7], // 8
  [4, 5, 6, 7], // 9
  [], // 10
  [4, 5, 6, 7] // 11
];


/**
 * Generates unaligned ordering of aligned items.
 * @param alignedItems - Aligned items to be unaligned.
 * @param alignment - Alignment option (0 - 7).
 * @param defaultVal - Default value to fill unused indexes.
 * @returns Copy of the array reordered to be unaligned reordered.
 */
const unaligned = <T>(
  alignedItems: Array<T>,
  alignment: number,
  defaultVal: T,
): Array<T> => {
  const unalignedItems: Array<T> = new Array(12)
    .fill(defaultVal);
  const enumerate = (element: T, i: number): [T, number] => [element, i];
  for (const [alignedItem, i] of alignedItems.map(enumerate))
    unalignedItems[labelMap[alignment][i]] = alignedItem;
  return unalignedItems;
};


/**
 * Determines whether text size and ordered version are equal.
 * @param textSizes - Text sizes to compare.
 * @param alignedTextSizes - Ordered text sizes.
 * @param alignedTextLabels - Ordered text labels.
 * @returns Whether the text sizes are equal.
 */
const compareTextSizes = (
  textSizes: number | Array<number>,
  alignedTextSizes: Array<number>,
  alignedTextLabels: Array<string>,
): boolean => {
  if (typeof textSizes === 'number')
    textSizes = [textSizes].concat(new Array(11).fill(0));
  for (let i = 0; i < 12; ++i) {
    if (alignedTextLabels[i] === '')
      continue;
    if (( // mismatched text size 0'd states
      Boolean(textSizes[i]) !==
      Boolean(alignedTextSizes[i])
    ) || ( // text size is non 0 and values mismatched
        textSizes[i] !== 0 &&
        textSizes[i] !== alignedTextSizes[i]
      ))
      return false;
  }
  return true;
};

/**
 * Plays back recorded Metadata changes into Metadata.
 * @param metadata - Metadata to alter.
 * @param metadataChanges - Metadata changes.
 */
const playbackMetadataChanges = (
  metadata: Metadata,
  metadataChanges: MetadataChanges,
): void => {
  if ('author' in metadataChanges)
    metadata.author = metadataChanges.author;
  if ('backcolor' in metadataChanges)
    metadata.backgroundColor = metadataChanges.backcolor;
  if ('background' in metadataChanges) {
    if ('name' in metadataChanges.background)
      metadata.background.name = metadataChanges.background.name;
    if ('style' in metadataChanges.background)
      metadata.background.style = metadataChanges.background.style;
  }
  if ('name' in metadataChanges)
    metadata.name = metadataChanges.name;
  if ('notes' in metadataChanges)
    metadata.notes = metadata.notes;
  if ('radii' in metadataChanges)
    metadata.radii = metadataChanges.radii;
  if ('switchMount' in metadataChanges)
    metadata.switch.mount = metadataChanges.switchMount;
  if ('switchBrand' in metadataChanges)
    metadata.switch.brand = metadataChanges.switchBrand;
  if ('switchType' in metadataChanges)
    metadata.switch.type = metadataChanges.switchType;
  if ('css' in metadataChanges)
    metadata.css = metadataChanges.css;
  if ('pcb' in metadataChanges) {
    metadata.isSwitchesPcbMounted = metadataChanges.pcb;
    metadata.includeSwitchesPcbMounted = true;
  }
  if ('plate' in metadataChanges) {
    metadata.isSwitchesPlateMounted = metadataChanges.plate;
    metadata.includeSwitchesPlateMounted = true;
  }
};

/**
 * Plays back recorded Key changes into Key.
 * @param key - Key to alter.
 * @param keyChanges - Key changes.
 * @param currentLabelsColor - Key's labels' color, default values set to ""
 * @param currentLabelsSize - Key's labels' size, default values set to 0
 * @param alignment - Tracked text alignment.
 * @param clusterRotationX - Tracked rotation origin X.
 * @param clusterRotationY - Tracked rotation origin Y.
 * @returns Updated inputs.
 */
const playbackKeyChanges = (
  key: Key,
  keyChanges: KeyChanges,
  currentLabelsColor: Array<string>,
  currentLabelsSize: Array<number>,
  alignment: number,
  clusterRotationX: number,
  clusterRotationY: number,
): [
    Array<string>,
    Array<number>,
    number,
    number,
    number,
  ] => {
  if ('r' in keyChanges)
    key.rotationAngle = keyChanges.r;
  if ('rx' in keyChanges) {
    key.rotationX = keyChanges.rx;
    clusterRotationX = keyChanges.rx;
    key.x = clusterRotationX;
    key.y = clusterRotationY;
  }
  if ('ry' in keyChanges) {
    key.rotationY = keyChanges.ry;
    clusterRotationY = keyChanges.ry;
    key.x = clusterRotationX;
    key.y = clusterRotationY;
  }
  if ('a' in keyChanges)
    alignment = keyChanges.a;
  if ('f' in keyChanges) {
    key.defaultTextSize = keyChanges.f;
    for (let i = 0; i < currentLabelsSize.length; ++i)
      currentLabelsSize[i] = 0;
  }
  if ('f2' in keyChanges)
    for (let i = 1; i < 12; ++i)
      currentLabelsSize[i] = keyChanges.f2;
  if ('fa' in keyChanges) {
    for (let i = 0; i < keyChanges.fa.length; ++i)
      currentLabelsSize[i] = keyChanges.fa[i];
    for (let i = keyChanges.fa.length; i < 12; ++i)
      currentLabelsSize[i] = 0;
  }
  if ('p' in keyChanges)
    key.profileAndRow = keyChanges.p;
  if ('c' in keyChanges)
    key.color = keyChanges.c;
  if ('t' in keyChanges) {
    const labelsColor = keyChanges.t.split('\n');
    if (labelsColor[0] != '')
      key.defaultTextColor = labelsColor[0];
    for (
      const [color, i] of
      unaligned<string>(labelsColor, alignment, '')
        .map(enumerate)
    )
      currentLabelsColor[i] = color;
  }
  if ('x' in keyChanges)
    key.x += keyChanges.x;
  if ('y' in keyChanges)
    key.y += keyChanges.y;
  if ('w' in keyChanges) {
    key.width = keyChanges.w;
    key.width2 = keyChanges.w;
  }
  if ('h' in keyChanges) {
    key.height = keyChanges.h;
    key.height2 = keyChanges.h;
  }
  if ('x2' in keyChanges)
    key.x2 = keyChanges.x2;
  if ('y2' in keyChanges)
    key.y2 = keyChanges.y2;
  if ('w2' in keyChanges)
    key.width2 = keyChanges.w2;
  if ('h2' in keyChanges)
    key.height2 = keyChanges.h2;
  if ('n' in keyChanges)
    key.isHoming = keyChanges.n;
  if ('l' in keyChanges)
    key.isStepped = keyChanges.l;
  if ('d' in keyChanges)
    key.isDecal = keyChanges.d;
  if ('g' in keyChanges)
    key.isGhosted = keyChanges.g;
  if ('sm' in keyChanges)
    key.switch.mount = keyChanges.sm;
  if ('sb' in keyChanges)
    key.switch.brand = keyChanges.sb;
  if ('st' in keyChanges)
    key.switch.type = keyChanges.st;
  return [
    currentLabelsColor,
    currentLabelsSize,
    alignment,
    clusterRotationX,
    clusterRotationY,
  ];
};

/**
 * Helper to help sort keys into KLE order before serialization.
 * @param KeyA - 1st Key to compare.
 * @param KeyB - 2nd Key to compare.
 * @returns Numeric sort value.
 */
const keySortCriteria = (
  keyA: Key,
  keyB: Key,
): number => (
  ((keyA.rotationAngle + 360) % 360 - (keyB.rotationAngle + 360) % 360) ||
  (keyA.rotationX - keyB.rotationX) ||
  (keyA.rotationY - keyB.rotationY) ||
  (keyA.y - keyB.y) ||
  (keyA.x - keyB.x)
);

/**
 * Records change into changes if a value is not equal to default.
 * @param changes - Changes to potentially add to.
 * @param name - Property name in changes to use if change is recorded.
 * @param val - Value in changes to use if change is recorded.
 * @param defaultVal - Default value to compare to.
 * @returns Value recorded or default value if not recorded.
 */
const recordChange = <T>(
  changes: { [key: string]: any },
  name: string,
  val: T,
  defaultVal: T | null,
): T => {
  if (JSON.stringify(val) !== JSON.stringify(defaultVal))
    changes[name] = val;
  return val;
};

/**
 * Returns copy of text sizes with right zeroes stripped.
 * @param textSizes - Array of text sizes.
 * @returns Text sizes right stripped of zeroes.
 */
const reducedTextSizes = (
  textSizes: Array<number>,
): Array<number> => {
  // copy and modify
  const rStripped: Array<number> = JSON.parse(JSON.stringify(textSizes));
  while (
    rStripped.length > 0 &&
    rStripped.slice(-1).pop() === 0
  )
    rStripped.pop();
  return rStripped;
};

/**
 * More space efficient text labels, text colors, text sizes.
 * @param key - Key to recompute the property reorders of.
 * @param currentLabelsSize - Text label sizes to help compute the aligned sizes.
 * @returns Tuple with alignment, reordered version of labels, colors, sizes.
 */
const alignedKeyProperties = (
  key: Key,
  currentLabelsSize: Array<number>,
): [
    number,
    Array<string>,
    Array<string>,
    Array<number>
  ] => {
  // size and colors if match default changed to based values
  const keyLabelsSize = key.labels.map(label => label.size);
  const keyLabelsColor = key.labels.map(label => label.color);
  for (const [label, i] of key.labels.map(enumerate)) {
    if (label.text === '') {
      keyLabelsColor[i] = '';
      keyLabelsSize[i] = 0;
    }
    if (label.color === key.defaultTextColor) {
      keyLabelsColor[i] = '';
    }
    if (label.size == key.defaultTextSize) {
      keyLabelsSize[i] = 0;
    }
  }

  const texts: Array<string> = key.labels.map(label => label.text);
  const colors: Array<string> = keyLabelsColor.slice();
  const sizes: Array<number> = keyLabelsSize.slice();
  const alignments: Array<number> = [7, 5, 6, 4, 3, 1, 2, 0];

  // remove impossible flag combinations
  for (const [text, i] of texts.map(enumerate)) {
    if (text !== '') {
      try {
        for (const alignment of alignments.slice())
          if (disallowedAlignnmentForLabels[i].includes(alignment))
            alignments.splice(alignments.indexOf(alignment), 1);
      }
      catch { }
    }
  }

  // generate label array properties according to alignment
  const alignment: number = <number>alignments.shift();
  const alignedTextLabels: Array<string> = new Array(12).fill('');
  const alignedTextColors: Array<string> = new Array(12).fill('');
  const alignedTextSizes: Array<number> = new Array(12).fill(0);
  for (let i = 0; i < 12; ++i) {
    if (!labelMap[alignment].includes(i))
      continue;
    const ndx = labelMap[alignment].indexOf(i)
    if (ndx >= 0) {
      if (texts[i] !== '')
        alignedTextLabels[ndx] = texts[i];
      if (colors[i] !== '')
        alignedTextColors[ndx] = colors[i];
      if (sizes[i] !== 0)
        alignedTextSizes[ndx] = sizes[i];
    }
  }

  // cleanup
  const reducedAlignedTextSizes = reducedTextSizes(alignedTextSizes);
  for (let i = 0; i < reducedAlignedTextSizes.length; ++i) {
    if (alignedTextLabels[i] === '')
      alignedTextSizes[i] = currentLabelsSize[i]
    if (alignedTextSizes[i] === key.defaultTextSize)
      alignedTextSizes[i] = 0;
  }

  return [
    alignment,
    alignedTextLabels,
    alignedTextColors,
    alignedTextSizes,
  ];
};

/**
 * Keyboard informations.
 */
class Keyboard {

  /**
   * Metadata information.
   */
  public metadata: Metadata = new Metadata();

  /**
   * List of Keys.
   */
  public keys: Array<Key> = new Array();

  /**
   * Initializes a Keyboard.
   */
  public constructor() { }

  /**
   * Derserializes a KLE JSON into a Keyboard.
   * @param keyboardJSON - KLE JSON to parse.
   * @returns Keyboard instance.
   */
  public static fromJSON(keyboardJSON: KeyboardJSON) {
    // validate against schema
    const valid = validate(keyboardJSON);
    if (!valid)
      throw new Error(ajv.errorsText(validate.errors));

    const keyboard = new Keyboard();

    // tracks the key with accumulated changes
    const current = new Key();
    // allows for non-KLE defautlts for label intiailizers
    let currentLabelsSize = new Array(12).fill(0);
    let currentLabelsColor = new Array(12).fill('');
    // tmp variables to construct final labels
    let alignment = 4;
    // keys are now separated by clusters
    // track rotation info for reset x/y postiions
    let clusterRotationX = 0.0;
    let clusterRotationY = 0.0;

    for (const r of keyboardJSON) {
      if (r instanceof Array) {
        for (const k of r) {
          if (typeof k === 'string') {
            const labels = k;
            const key = Object.assign(
              new Key(),
              current,
              {
                labels: current.labels
                  .map(label => Object.assign(new Label(), label)),
                switch: Object.assign(new Switch(), current.switch),
              },
            );
            for (const [text, i] of unaligned(
              labels.split('\n'),
              alignment,
              '',
            ).map(enumerate))
              key.labels[i].text = text;
            for (const [size, i] of unaligned(
              currentLabelsSize,
              alignment,
              0,
            ).map(enumerate))
              if (size === 0)
                key.labels[i].size = key.defaultTextSize;
              else
                key.labels[i].size = size;
            for (const [color, i] of currentLabelsColor.map(enumerate))
              if (color === '')
                key.labels[i].color = key.defaultTextColor;
              else
                key.labels[i].color = color;

            keyboard.keys.push(key);
            // adjustments for the next key 
            current.x += current.width;
            current.width = 1.0;
            current.height = 1.0;
            current.x2 = 0.0;
            current.y2 = 0.0;
            current.width2 = current.width;
            current.height2 = current.height;
            current.isHoming = false;
            current.isStepped = false;
            current.isDecal = false;
          }
          else if (k instanceof Object) {
            const keyChanges = k;
            [
              currentLabelsColor,
              currentLabelsSize,
              alignment,
              clusterRotationX,
              clusterRotationY,
            ] = playbackKeyChanges(
              current,
              keyChanges,
              currentLabelsColor,
              currentLabelsSize,
              alignment,
              clusterRotationX,
              clusterRotationY,
            )
          }
        }
        current.y += 1.0;
      }
      else if (r instanceof Object) {
        const metadataChanges = r;
        playbackMetadataChanges(keyboard.metadata, metadataChanges);
        current.switch.mount = keyboard.metadata.switch.mount;
        current.switch.brand = keyboard.metadata.switch.brand;
        current.switch.type = keyboard.metadata.switch.type;
      }
      current.x = current.rotationX;
    }
    return keyboard;
  }

  /**
   * Serializes the Keyboard into a KLE JSON.
   */
  public toJSON(): KeyboardJSON {
    const keyboardJSON: KeyboardJSON = new Array();
    let row: Array<KeyLabel | KeyChanges> = new Array();
    const current: Key = new Key();
    current.switch.mount = this.metadata.switch.mount;
    current.switch.brand = this.metadata.switch.brand;
    current.switch.type = this.metadata.switch.type;
    let currentAlignment: number = 4;
    let currentLabelsColor: string = current.defaultTextColor;
    let currentLabelsSize: Array<number> = new Array(12).fill(0);
    let clusterRotationAngle: number = 0.0;
    let clusterRotationX: number = 0.0;
    let clusterRotationY: number = 0.0;

    const metadataChanges = {};
    const defualtMetadata = new Metadata();
    recordChange<string>(
      metadataChanges,
      'backcolor',
      this.metadata.backgroundColor,
      defualtMetadata.backgroundColor,
    );
    recordChange<string>(
      metadataChanges,
      'name',
      this.metadata.name,
      defualtMetadata.name,
    );
    recordChange<string>(
      metadataChanges,
      'author',
      this.metadata.author,
      defualtMetadata.author,
    );
    recordChange<string>(
      metadataChanges,
      'notes',
      this.metadata.notes,
      defualtMetadata.notes,
    );
    const backgroundChanges: { [key: string]: any } = new Object();
    recordChange<string>(
      backgroundChanges,
      'name',
      this.metadata.background.name,
      '',
    );
    recordChange<string>(
      backgroundChanges,
      'style',
      this.metadata.background.style,
      '',
    );
    if (Object.keys(backgroundChanges).length > 0)
      recordChange<{ [key: string]: any }>(
        metadataChanges,
        'background',
        backgroundChanges,
        null,
      );
    recordChange<string>(
      metadataChanges,
      'radii',
      this.metadata.radii,
      defualtMetadata.radii,
    );
    recordChange<string>(
      metadataChanges,
      'switchMount',
      this.metadata.switch.mount,
      defualtMetadata.switch.mount,
    );
    recordChange<string>(
      metadataChanges,
      'switchBrand',
      this.metadata.switch.brand,
      defualtMetadata.switch.brand,
    );
    recordChange<string>(
      metadataChanges,
      'switchType',
      this.metadata.switch.type,
      defualtMetadata.switch.type,
    );
    recordChange<string>(
      metadataChanges,
      'css',
      this.metadata.css,
      defualtMetadata.css,
    );
    if (
      this.metadata.includeSwitchesPlateMounted ||
      this.metadata.isSwitchesPlateMounted
    )
      recordChange<boolean>(
        metadataChanges,
        'plate',
        this.metadata.isSwitchesPlateMounted,
        null,
      );
    if (
      this.metadata.includeSwitchesPcbMounted ||
      this.metadata.isSwitchesPcbMounted
    )
      recordChange<boolean>(
        metadataChanges,
        'pcb',
        this.metadata.isSwitchesPcbMounted,
        null,
      );
    if (Object.keys(metadataChanges).length > 0)
      keyboardJSON.push(metadataChanges);

    let isNewRow: boolean = true;
    // will be incremented on the first row
    current.y -= 1.0;

    for (const key of this.keys.slice().sort(keySortCriteria)) {
      const keyChanges: KeyChanges = new Object();
      const [
        alignment,
        alignedTextLabels,
        alignedTextColors,
        alignedTextSizes,
      ] = alignedKeyProperties(
        key,
        currentLabelsSize,
      );

      // start a new row when necessary
      const isClusterChanged: boolean = (
        key.rotationAngle != clusterRotationAngle ||
        key.rotationX != clusterRotationX ||
        key.rotationY != clusterRotationY
      );
      const isRowChanged: boolean = key.y != current.y;
      if (row.length > 0 && (isRowChanged || isClusterChanged)) {
        keyboardJSON.push(row);
        row = [];
        isNewRow = true;
      }
      if (isNewRow) {
        current.y += 1.0;
        // set up for the new row
        // y is reset if eihter rx or ry are changed
        if (
          key.rotationY != clusterRotationY ||
          key.rotationX != clusterRotationX
        )
          current.y = key.rotationY;
        // always reset x to rx (defaults to 0)
        current.x = key.rotationX;
        // update current cluster
        clusterRotationAngle = key.rotationAngle;
        clusterRotationX = key.rotationX;
        clusterRotationY = key.rotationY;
        isNewRow = false;
      }
      current.rotationAngle = recordChange<number>(
        keyChanges,
        'r',
        key.rotationAngle,
        current.rotationAngle,
      );
      current.rotationX = recordChange<number>(
        keyChanges,
        'rx',
        key.rotationX,
        current.rotationX,
      );
      current.rotationY = recordChange<number>(
        keyChanges,
        'ry',
        key.rotationY,
        current.rotationY,
      );
      current.y += recordChange<number>(
        keyChanges,
        'y',
        key.y - current.y,
        0.0,
      );
      current.x += recordChange<number>(
        keyChanges,
        'x',
        key.x - current.x,
        0.0,
      ) + key.width;
      current.color = recordChange<string>(
        keyChanges,
        'c',
        key.color,
        current.color,
      );
      if (alignedTextColors[0] === '')
        alignedTextColors[0] = key.defaultTextColor;
      else
        for (let i = 2; i < 12; ++i)
          if (
            alignedTextColors[i] !== '' &&
            alignedTextColors[i] !== alignedTextColors[0]
          )
            alignedTextColors[i] = key.defaultTextColor
      currentLabelsColor = recordChange<string>(
        keyChanges,
        't',
        alignedTextColors.join('\n').trimEnd(),
        currentLabelsColor,
      );
      current.isGhosted = recordChange<boolean>(
        keyChanges,
        'g',
        key.isGhosted,
        current.isGhosted,
      );
      current.profileAndRow = recordChange<string>(
        keyChanges,
        'p',
        key.profileAndRow,
        current.profileAndRow,
      );
      current.switch.mount = recordChange<string>(
        keyChanges,
        'sm',
        key.switch.mount,
        current.switch.mount,
      );
      current.switch.brand = recordChange<string>(
        keyChanges,
        'sb',
        key.switch.brand,
        current.switch.brand,
      );
      current.switch.type = recordChange<string>(
        keyChanges,
        'st',
        key.switch.type,
        current.switch.type,
      );
      currentAlignment = recordChange<number>(
        keyChanges,
        'a',
        alignment,
        currentAlignment,
      );
      current.defaultTextSize = recordChange<number>(
        keyChanges,
        'f',
        key.defaultTextSize,
        current.defaultTextSize,
      );
      if ('f' in keyChanges)
        currentLabelsSize = new Array(12).fill(0);
      // text sizes aren't alreayd optimized, optimize it
      if (!compareTextSizes(
        currentLabelsSize,
        alignedTextSizes,
        alignedTextLabels
      ))
        if (reducedTextSizes(alignedTextSizes).length === 0)
          recordChange<number>(
            keyChanges,
            'f',
            key.defaultTextSize,
            null,
          );
        else {
          let optimizeF2: boolean = alignedTextSizes[0] === 0;
          for (let i = 2; i < reducedTextSizes(alignedTextSizes).length; ++i) {
            if (!optimizeF2)
              break;
            optimizeF2 = alignedTextSizes[i] == alignedTextSizes[1];
          }
          if (optimizeF2) {
            const f2 = alignedTextSizes[1];
            recordChange<number>(keyChanges, 'f2', f2, null);
            currentLabelsSize = [0, ...new Array(11).fill(f2)];
          }
          else {
            currentLabelsSize = alignedTextSizes;
            recordChange<Array<number>>(
              keyChanges,
              'fa',
              reducedTextSizes(alignedTextSizes),
              new Array(),
            );
          }
        }
      recordChange(keyChanges, 'w', key.width, 1.0);
      recordChange(keyChanges, 'h', key.height, 1.0);
      recordChange(keyChanges, 'w2', key.width2, key.width);
      recordChange(keyChanges, 'h2', key.height2, key.height);
      recordChange(keyChanges, 'x2', key.x2, 0.0);
      recordChange(keyChanges, 'y2', key.y2, 0.0);
      recordChange(keyChanges, 'n', key.isHoming, false);
      recordChange(keyChanges, 'l', key.isStepped, false);
      recordChange(keyChanges, 'd', key.isDecal, false);
      if (Object.keys(keyChanges).length > 0)
        row.push(keyChanges);
      row.push(alignedTextLabels.join('\n').trimEnd())
    }
    if (row.length > 0)
      keyboardJSON.push(row);
    return keyboardJSON;
  }

}

export default Keyboard;