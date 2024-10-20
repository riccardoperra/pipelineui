export function parseFileReference(ref) {
    if (ref.startsWith("./")) {
        return {
            path: ref.substring(2)
        };
    }
    const [remotePath, version] = ref.split("@");
    const [owner, repository, ...pathSegments] = remotePath.split("/").filter(s => s.length > 0);
    if (!owner || !repository || !version) {
        throw new Error(`Invalid file reference: ${ref}`);
    }
    return {
        repository,
        owner,
        path: pathSegments.join("/"),
        version
    };
}
export function fileIdentifier(ref) {
    if (!("repository" in ref)) {
        return "./" + ref.path;
    }
    return `${ref.owner}/${ref.repository}/${ref.path}@${ref.version}`;
}
//# sourceMappingURL=file-reference.js.map