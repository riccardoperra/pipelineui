import {visit} from 'unist-util-visit';

const propsRegexp = /(\w+)="([^"]*)"/gi;

export function rehypeBlockquote() {
  return function transformer(tree: any) {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || node.tagName !== 'blockquote') {
        return;
      }
      const blockquote = node;

      const firstChildNode = blockquote.children.find(
        (child: any) => child.type === 'element',
      );

      if (!firstChildNode) {
        return;
      }

      for (const child of firstChildNode.children) {
        // Support custom props: `prop1=value`
        if (child.type === 'text') {
          const matches = [
            ...(String(child.value).matchAll(propsRegexp) ?? []),
          ];

          if (matches && matches.length) {
            for (const match of matches) {
              const [, key, value] = match;
              blockquote.properties[key] = value;
            }
            child.value = child.value.replaceAll(propsRegexp, '');
            break;
          }

          // Support GitHub syntax
          [
            {match: '[!WARNING]', type: 'warning'},
            {match: '[!NOTE]', type: 'info'},
          ].forEach(({type, match}) => {
            if (child.value.includes(match)) {
              blockquote.properties.type = type;
              child.value = child.value.replaceAll(match, '');
            }
          });
        }
      }
    });
  };
}
