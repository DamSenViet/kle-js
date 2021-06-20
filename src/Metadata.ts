import Background from './Background';
import Switch from './Switch';

/**
 * Metadata information.
 */
class Metadata {

  /**
   * Keyboard name.
   */
  public name: string = '';

  /**
   * Author's name.
   */
  public author: string = '';

  /**
   * Author's notes.
   */
  public notes: string = '';

  /**
   * Background of the keyboard.
   */
  public background: Background = new Background();

  /**
   * Background CSS color.
   */
  public backgroundColor: string = '#eeeeee';

  /**
   * CSS Border-radius value.
   */
  public radii: string = '';

  /**
   * CSS stylesheet.
   */
  public css: string = '';

  /**
   * Switch information.
   */
  public switch: Switch = new Switch();

  /**
   * Whether switches are pcb mounted.
   */
  public isSwitchesPcbMounted: boolean = false;

  /**
   * Whether to include switch pcb mounting in the KLE JSON.
   */
  public includeSwitchesPcbMounted: boolean = false;

  /**
   * Whether switches are plate mounted.
   */
  public isSwitchesPlateMounted: boolean = false;

  /**
   * Whether to include switch plate mounting in the KLE JSON.
   */
  public includeSwitchesPlateMounted: boolean = false;

  /**
   * Initializes a Metadata.
   */
  public constructor() { }

}

export default Metadata;