export type Matcher = RegExp;
export interface Matchers {
  keyword?: Matcher;
  [k: string]: Matcher;
}
