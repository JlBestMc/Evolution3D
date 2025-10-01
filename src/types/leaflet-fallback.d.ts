/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "leaflet" {
  export type LatLngBoundsLiteral = [[number, number], [number, number]];
  const L: any;
  export default L;
}
