declare module "react-progress-arc" {
  interface Props {
    completed: number;
    diameter?: number;
    strokeWidth?: number;
  }

  class ProgressArc extends React.Component<Props> {}

  export = ProgressArc;
}

declare module "react-textfit" {
  interface TextfitProps {
    className?: string;
    /**
     * Algorithm to fit the text. Use single for headlines and multi for
     * paragraphs.
     * @default `multi`
     */
    mode?: "single" | "multi";
    /**
     * When `mode` is `single` and `forceSingleModeWidth` is `true`, the
     * element's height will be ignored.
     * @default `true`
     */
    forceSingleModeWidth?: boolean;
    /**
     * Minimum font size in pixel.
     * @default `1`
     */
    min?: number;
    /**
     * Maximum font size in pixel.
     * @default `100`
     */
    max?: number;
    /**
     * Window resize throttle in milliseconds.
     * @default `50`
     */
    throttle?: number;
    /**
     * Will be called when text is fitted.
     */
    onReady? (): void;
  }

  export class Textfit extends React.Component<TextfitProps> {}
}

declare module "react-markdown" {
  type Renderer<T> = (props: T) => React.ReactElement<T>;

  interface Renderers {
    "root": string | Renderer<object>;
    "break": string | Renderer<object>;
    "paragraph": string | Renderer<object>;
    "emphasis": string | Renderer<object>;
    "strong": string | Renderer<object>;
    "thematicBreak": string | Renderer<object>;
    "blockquote": string | Renderer<object>;
    "delete": string | Renderer<object>;
    "link": string | Renderer<object>;
    "image": string | Renderer<object>;
    "linkReference": string | Renderer<object>;
    "imageReference": string | Renderer<object>;
    "table": string | Renderer<object>;
    "tableHead": string | Renderer<object>;
    "tableBody": string | Renderer<object>;
    "tableRow": string | Renderer<object>;
    "tableCell": string | Renderer<object>;
    "list": string | Renderer<object>;
    "listItem": string | Renderer<object>;
    "definition": string | Renderer<object>;
    "heading": string | Renderer<object>;
    "inlineCode": string | Renderer<object>;
    "code": string | Renderer<object>;
    "html": string | Renderer<object>;
  }

  type NodeTypes = keyof Renderers;

  interface MarkdownProps {
    /**
     * The Markdown source to parse.
     */
    source: string;
    /**
     * Class name of the container element.
     * @default `''`
     */
    className?: string;
    /**
     * Setting to `false` will cause HTML to be rendered (see note above about
     * broken HTML, though). Be aware that setting this to `false` might cause
     * security issues if the input is user-generated. Use at your own risk.
     * @default `true`
     */
    escapeHtml?: boolean;
    /**
     * Setting to `true` will skip inlined and blocks of HTML.
     * @default `false`
     */
    skipHtml?: boolean;
    /**
     * Setting to `true` will add `data-sourcepos` attributes to all elements,
     * indicating where in the markdown source they were rendered from.
     * @default `false`
     */
    sourcePos?: boolean;
    /**
     * Defines which types of nodes should be allowed (rendered).
     * @default all types
     */
    allowedTypes?: NodeTypes[];
    /**
     * Defines which types of nodes should be disallowed (not rendered).
     * @default none
     */
    disallowedTypes?: NodeTypes[];
    /**
     * Setting to `true` will try to extract/unwrap the children of disallowed
     * nodes. For instance, if disallowing `Strong`, the default behaviour is to
     * simply skip the text within the strong altogether, while the behaviour
     * some might want is to simply have the text returned without the strong
     * wrapping it.
     * @default `false`
     */
    unwrapDisallowed?: boolean;
    /**
     * Function execute if in order to determine if the node should be allowed.
     * Ran prior to checking `allowedTypes`/`disallowedTypes`. Returning a
     * truthy value will allow the node to be included. Note that if this
     * function returns `true` and the type is not in `allowedTypes` (or
     * specified as a `disallowedType`), it won't be included. The function will
     * receive three arguments argument (`node`, `index`, `parent`), where node
     * contains different properties depending on the node type.
     */
    allowNode? (node: object, index: number, parent: NodeTypes): boolean;
    /**
     * Function that gets called for each encountered link with a single
     * argument - `uri`. The returned value is used in place of the original.
     * The default link URI transformer acts as an XSS-filter, neutralizing
     * things like `javascript:`, `vbscript:` and `file:` protocols. If you
     * specify a custom function, this default filter won't be called, but you
     * can access it as `require('react-markdown').uriTransformer`. If you want
     * to disable the default transformer, pass `null` to this option.
     */
    transformLinkUri?: ((uri: string) => string) | null;
    /**
     * Function that gets called for each encountered image with a single
     * argument - `uri`. The returned value is used in place of the original.
     */
    transformImageUri?: ((uri: string) => string) | null;
    /**
     * An object where the keys represent the node type and the value is a React
     * component. The object is merged with the default renderers. The props
     * passed to the component varies based on the type of node.
     */
    renderers?: Partial<Renderers>;
    /**
     * An object where the keys represent the node type and the value is a React
     * component. The object is merged with the default renderers. The props
     * passed to the component varies based on the type of node.
     */
    plugins?: any[];
    astPlugins?: any[];
  }

  class ReactMarkdown extends React.Component<MarkdownProps> {}

  export = ReactMarkdown;
}

declare module "remark-breaks" {
  class Ph {}

  export = Ph;
}

declare namespace Intl {
  function getCanonicalLocales(locales: string | string[]): string[];

  class RelativeTimeFormat {
      constructor(locale: string);
  }

  class ListFormat {
      constructor(locale: string, options?: ListFormatOptions);
      format(list: Iterable<string>): string;
  }

  type ListFormatOptions = {
    localeMatcher?: "lookup" | "best fit";
    type: "conjunction" | "disjunction" | "unit";
    style?: "long";
  } | {
    localeMatcher?: "lookup" | "best fit";
    type: "unit";
    style: "short" | "narrow";
  }
}

declare module 'react-markdown/plugins/html-parser' {
  export = (options: {
    isValidNode?: (node: any) => boolean
  }) => any
}
