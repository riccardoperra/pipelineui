import { TemplateToken } from "./template-token";
/**
 * Base class for everything that is not a mapping or sequence
 */
export class ScalarToken extends TemplateToken {
    constructor(type, file, range, definitionInfo) {
        super(type, file, range, definitionInfo);
    }
    get isScalar() {
        return true;
    }
    static trimDisplayString(displayString) {
        let firstLine = displayString.trimStart();
        const firstNewLine = firstLine.indexOf("\n");
        const firstCarriageReturn = firstLine.indexOf("\r");
        if (firstNewLine >= 0 || firstCarriageReturn >= 0) {
            firstLine = firstLine.substr(0, Math.min(firstNewLine >= 0 ? firstNewLine : Number.MAX_VALUE, firstCarriageReturn >= 0 ? firstCarriageReturn : Number.MAX_VALUE));
        }
        return firstLine;
    }
}
//# sourceMappingURL=scalar-token.js.map