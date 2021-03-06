import { Renderer2 } from '@angular/core';
export declare class ResizeHandle {
    protected parent: Element;
    protected renderer: Renderer2;
    type: string;
    css: string;
    private onMouseDown;
    protected _handle: Element;
    private _onResize;
    constructor(parent: Element, renderer: Renderer2, type: string, css: string, onMouseDown: any);
    dispose(): void;
    readonly el: Element;
}
