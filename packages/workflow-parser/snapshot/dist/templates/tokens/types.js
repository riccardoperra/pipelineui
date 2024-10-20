export var TokenType;
(function (TokenType) {
    TokenType[TokenType["String"] = 0] = "String";
    TokenType[TokenType["Sequence"] = 1] = "Sequence";
    TokenType[TokenType["Mapping"] = 2] = "Mapping";
    TokenType[TokenType["BasicExpression"] = 3] = "BasicExpression";
    TokenType[TokenType["InsertExpression"] = 4] = "InsertExpression";
    TokenType[TokenType["Boolean"] = 5] = "Boolean";
    TokenType[TokenType["Number"] = 6] = "Number";
    TokenType[TokenType["Null"] = 7] = "Null";
})(TokenType || (TokenType = {}));
export function tokenTypeName(type) {
    switch (type) {
        case TokenType.String:
            return "StringToken";
        case TokenType.Sequence:
            return "SequenceToken";
        case TokenType.Mapping:
            return "MappingToken";
        case TokenType.BasicExpression:
            return "BasicExpressionToken";
        case TokenType.InsertExpression:
            return "InsertExpressionToken";
        case TokenType.Boolean:
            return "BooleanToken";
        case TokenType.Number:
            return "NumberToken";
        case TokenType.Null:
            return "NullToken";
        default: {
            // Use never to ensure exhaustiveness
            const exhaustiveCheck = type;
            throw new Error(`Unhandled token type: ${type} ${exhaustiveCheck}}`);
        }
    }
}
//# sourceMappingURL=types.js.map