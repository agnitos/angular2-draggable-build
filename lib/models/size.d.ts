export interface ISize {
    width: number;
    height: number;
}
export declare class Size implements ISize {
    width: number;
    height: number;
    constructor(width: number, height: number);
    static getCurrent(el: Element): Size;
    static copy(s: Size): Size;
    set(s: ISize): this;
}
