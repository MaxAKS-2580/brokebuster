/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode
    }
    interface ElementAttributesProperty { props: {} }
    interface ElementChildrenAttribute { children: {} }
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

declare module 'react' {
  export * from 'react';
  export as namespace React;
  
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  export type ReactNode = ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;
  export type Key = string | number;
  export type ReactFragment = {} | Iterable<ReactNode>;
  export type ReactPortal = any;
  export type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<any, any>);
  
  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  export function createElement<P extends {}>(type: string | ComponentType<P>, props?: P, ...children: ReactNode[]): ReactElement<P>;
  
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type EffectCallback = () => (void | (() => void | undefined));
  export type DependencyList = ReadonlyArray<any>;
  export type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
  export interface ComponentClass<P = {}> {
    new (props: P): Component<P, any>;
  }
  export interface FunctionComponent<P = {}> {
    (props: P): ReactElement<any, any> | null;
  }
  export class Component<P, S> {
    constructor(props: P);
    render(): ReactNode;
  }
}

declare module 'react-dom/client' {
  export interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }
  export function createRoot(container: Element | DocumentFragment): Root;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
