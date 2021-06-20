import Metadata from './Metadata';
import Key from './Key';
import Switch from './Switch';
import Label from './Label';

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

}

export default Keyboard;