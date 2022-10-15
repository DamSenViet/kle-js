/**
 * Keyboard information.
 */
 export type KeyboardJSON = [MetadataJSON | ClusterJSON, ...ClusterJSON[]]
 /**
  * Keys and their running changes grouped by their rotation origin and y coordinate.
  */
 export type ClusterJSON =
   | [
       KeyLabelsJSON | KeyChangesJSON,
       ...(
         | KeyLabelsJSON
         | (KeyChangesJSON & {
             r?: false
             rx?: false
             ry?: false
             [k: string]: unknown
           })
       )[]
     ]
 /**
  * Aligned and joined label texts for a key.
  */
 export type KeyLabelsJSON = string
 
 /**
  * Metadata information.
  */
 export type MetadataJSON = {
   /**
    * Author name.
    */
   author?: string
   /**
    * Background CSS color.
    */
   backcolor?: string
   background?: BackgroundJSON
   /**
    * The Keyboard name.
    */
   name?: string
   /**
    * Author's notes.
    */
   notes?: string
   /**
    * CSS border radius value.
    */
   radii?: string
   /**
    * Default switch mount for the keys.
    */
   switchMount?: string
   /**
    * Default switch brand for the keys.
    */
   switchBrand?: string
   /**
    * Default switch type for the keys.
    */
   switchType?: string
   /**
    * CSS stylesheet.
    */
   css?: string
   /**
    * Whether the switches are pcb mounted.
    */
   pcb?: boolean
   /**
    * Whether the switches are plate mounted
    */
   plate?: boolean
   [k: string]: unknown
 }
 /**
  * Background information.
  */
 export type BackgroundJSON = {
   /**
    * Name of the background.
    */
   name?: string
   /**
    * Background CSS style declaration.
    */
   style?: string
   [k: string]: unknown
 }
 /**
  * The changes between succeeding keys or the next following key.
  */
 export type KeyChangesJSON = {
   /**
    * Rotation angle in degrees.
    */
   r?: number
   /**
    * X position of rotation origin in key units.
    */
   rx?: number
   /**
    * Y posiiton of rotation origin in key units
    */
   ry?: number
   /**
    * The alignment for label text, label sizes, label colors.
    */
   a?: number
   /**
    * Default label size for succeeding keys.
    */
   f?: number
   /**
    * Optimized label size for succeeding keys.
    */
   f2?: number
   /**
    * Label sizes for succeeding keys.
    */
   fa?: number[]
   /**
    * Profile for succeeding keys.
    */
   p?: string
   /**
    * Aligned cap CSS color for succeeding keys.
    */
   c?: string
   /**
    * Aligned label CSS colors for succeeding keys.
    */
   t?: string
   /**
    * X position of the raised primary shape in key units.
    */
   x?: number
   /**
    * Y position of the raised primary shape in key units.
    */
   y?: number
   /**
    * Width position of the raised primary shape in key units.
    */
   w?: number
   /**
    * Height position of the raised primary shape in key units.
    */
   h?: number
   /**
    * X position offset of the lowered secondary shape in key units for the next key.
    */
   x2?: number
   /**
    * Y position offset of lowered secondary shape in key units for the next key.
    */
   y2?: number
   /**
    * Width of lowered secondary shape in key units for the next key.
    */
   w2?: number
   /**
    * Height of lowered secondary shape in key units for the next key.
    */
   h2?: number
   /**
    * Whether the next key is a homing key.
    */
   n?: boolean
   /**
    * Whether the next key is a stepped key.
    */
   l?: boolean
   /**
    * Whether the next key is a decal key.
    */
   d?: boolean
   /**
    * Whether succeeding keys are ghosted keys.
    */
   g?: boolean
   /**
    * Switch mount for succeeding keys.
    */
   sm?: string
   /**
    * Switch brand for succeeding keys.
    */
   sb?: string
   /**
    * Switch type for succeeding keys.
    */
   st?: string
   [k: string]: unknown
 }
 