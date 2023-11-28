declare module 'coordtransform' {
  export function wgs84togcj02(lng: number, lat: number): [number, number];
  export function gcj02tobd09(lng: number, lat: number): [number, number];
  export function bd09togcj02(lng: number, lat: number): [number, number];
  export function gcj02towgs84(lng: number, lat: number): [number, number];
}
