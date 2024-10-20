export interface TraceWriter {
    error(message: string): void;
    info(message: string): void;
    verbose(message: string): void;
}
export declare class NoOperationTraceWriter implements TraceWriter {
    error(): void;
    info(): void;
    verbose(): void;
}
//# sourceMappingURL=trace-writer.d.ts.map