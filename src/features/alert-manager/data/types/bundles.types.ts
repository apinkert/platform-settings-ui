export interface BundleFacet {
  id: string;
  name: string;
  displayName: string;
  children?: BundleFacet[];
}
