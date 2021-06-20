import Label from './Label';
import Switch from './Switch';

/**
 * Key information.
 */
class Key {

  /**
   * Keycap CSS color.
   */
  public color: string = '#cccccc';

  /**
   * 12 Labels.
   */
  public labels: Array<Label> = new Array(12)
    .fill(null)
    .map(_ => new Label());

  /**
   * Default CSS text color.
   */
  public defaultTextColor: string = '#000000';

  /**
   * Default text size.
   * 
   * Only used to optimize the KLE JSON size.
   */
  public defaultTextSize: number = 3;

  /**
   * X position of raised primary shape in key units.
   */
  public x: number = 0.0;

  /**
   * Y position of the raised primary shape in key units.
   */
  public y: number = 0.0;

  /**
   * Width of the raised primary shape in key units.
   */
  public width: number = 1.0;

  /**
   * Height of the raised primary shape in key units.
   */
  public height: number = 1.0;

  /**
   * X position offset of the lowered secondary shape in key units.
   */
  public x2: number = 0.0;

  /**
   * Y position offset of the lowered secondary shape in key units.
   */
  public y2: number = 0.0;

  /**
   * Width of the lowered secondary shape in key units.
   */
  public width2: number = 1.0;

  /**
   * Height of the lowered secondary shape in key units.
   */
  public height2: number = 1.0;

  /**
   * X position of the rotation origin in key units.
   */
  public rotationX: number = 0.0;

  /**
   * Y position of the rotation origin in key units.
   */
  public rotationY: number = 0.0;

  /**
   * Rotation angle in degrees.
   */
  public rotationAngle: number = 0.0;

  /**
   * Whether the key is rendered partially transparent.
   */
  public isGhosted: boolean = false;

  /**
   * Whether the key is stepped.
   */
  public isStepped: boolean = false;

  /**
   * Whether the key is a homing key.
   */
  public isHoming: boolean = false;

  /**
   * Whether the key is purely decorative.
   */
  public isDecal: boolean = false;

  /**
   * Keycap profile and row.
   */
  public profileAndRow: string = '';

  /**
   * Switch information.
   */
  public switch: Switch = new Switch();

  /**
   * Initializes a Key.
   */
  public constructor() { }

}

export default Key;