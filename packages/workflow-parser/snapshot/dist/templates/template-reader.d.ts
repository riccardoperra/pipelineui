import { ObjectReader } from "./object-reader";
import { TemplateContext } from "./template-context";
import { TemplateToken } from "./tokens";
export declare function readTemplate(context: TemplateContext, type: string, objectReader: ObjectReader, fileId: number | undefined): TemplateToken | undefined;
export interface ReadTemplateResult {
    value: TemplateToken;
    bytes: number;
}
//# sourceMappingURL=template-reader.d.ts.map