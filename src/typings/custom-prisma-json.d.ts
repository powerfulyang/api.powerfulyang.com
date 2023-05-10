// should export
// otherwise, it will not take effect
export declare global {
  namespace PrismaJson {
    type Tags = string[];
    type Size = {
      width: number;
      height: number;
    };
  }
}
