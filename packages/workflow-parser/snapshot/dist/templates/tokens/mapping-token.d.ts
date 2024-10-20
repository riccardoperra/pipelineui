import {TemplateToken, KeyValuePair, ScalarToken} from '.';
import {DefinitionInfo} from '../schema/definition-info';
import {SerializedToken} from './serialization';
import {TokenRange} from './token-range';
export declare class MappingToken extends TemplateToken {
  private readonly map;
  constructor(
    file: number | undefined,
    range: TokenRange | undefined,
    definitionInfo: DefinitionInfo | undefined,
  );
  get count(): number;
  get isScalar(): boolean;
  get isLiteral(): boolean;
  get isExpression(): boolean;
  add(key: ScalarToken, value: TemplateToken): void;
  get(index: number): KeyValuePair;
  find(key: string): TemplateToken | undefined;
  remove(index: number): void;
  clone(omitSource?: boolean): TemplateToken;
  toJSON(): SerializedToken;
  [Symbol.iterator](): Iterator<KeyValuePair>;
}
//# sourceMappingURL=mapping-token.d.ts.map
