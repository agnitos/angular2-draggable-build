/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Renderer2, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Position } from './models/position';
import { HelperBlock } from './widgets/helper-block';
export class AngularDraggableDirective {
    /**
     * @param {?} el
     * @param {?} renderer
     */
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.allowDrag = true;
        this.moving = false;
        this.orignal = null;
        this.oldTrans = new Position(0, 0);
        this.tempTrans = new Position(0, 0);
        this.currTrans = new Position(0, 0);
        this.oldZIndex = '';
        this._zIndex = '';
        this.needTransform = false;
        this.draggingSub = null;
        /**
         * Bugfix: iFrames, and context unrelated elements block all events, and are unusable
         * https://github.com/xieziyu/angular2-draggable/issues/84
         */
        this._helperBlock = null;
        this.started = new EventEmitter();
        this.stopped = new EventEmitter();
        this.edge = new EventEmitter();
        /**
         * List of allowed out of bounds edges *
         */
        this.outOfBounds = {
            top: false,
            right: false,
            bottom: false,
            left: false
        };
        /**
         * Round the position to nearest grid
         */
        this.gridSize = 1;
        /**
         * Whether to limit the element stay in the bounds
         */
        this.inBounds = false;
        /**
         * Whether the element should use it's previous drag position on a new drag event.
         */
        this.trackPosition = true;
        /**
         * Input css scale transform of element so translations are correct
         */
        this.scale = 1;
        /**
         * Whether to prevent default event
         */
        this.preventDefaultEvent = false;
        /**
         * Set initial position by offsets
         */
        this.position = { x: 0, y: 0 };
        /**
         * Lock axis: 'x' or 'y'
         */
        this.lockAxis = null;
        /**
         * Emit position offsets when moving
         */
        this.movingOffset = new EventEmitter();
        /**
         * Emit position offsets when put back
         */
        this.endOffset = new EventEmitter();
        this._helperBlock = new HelperBlock(el.nativeElement, renderer);
    }
    /**
     * Set z-index when not dragging
     * @param {?} setting
     * @return {?}
     */
    set zIndex(setting) {
        this.renderer.setStyle(this.el.nativeElement, 'z-index', setting);
        this._zIndex = setting;
    }
    /**
     * @param {?} position
     * @return {?}
     */
    set absPosition(position) {
        this.tempTrans.set(position);
        this.tempTrans.subtract(this.oldTrans);
        this.transform();
    }
    /**
     * @param {?} setting
     * @return {?}
     */
    set ngDraggable(setting) {
        if (setting !== undefined && setting !== null && setting !== '') {
            this.allowDrag = !!setting;
            /** @type {?} */
            let element = this.getDragEl();
            if (this.allowDrag) {
                this.renderer.addClass(element, 'ng-draggable');
            }
            else {
                this.putBack();
                this.renderer.removeClass(element, 'ng-draggable');
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.allowDrag) {
            /** @type {?} */
            let element = this.getDragEl();
            this.renderer.addClass(element, 'ng-draggable');
        }
        this.resetPosition();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.bounds = null;
        this.handle = null;
        this.orignal = null;
        this.oldTrans = null;
        this.tempTrans = null;
        this.currTrans = null;
        this._helperBlock.dispose();
        this._helperBlock = null;
        if (this.draggingSub) {
            this.draggingSub.unsubscribe();
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['position'] && !changes['position'].isFirstChange()) {
            /** @type {?} */
            let p = changes['position'].currentValue;
            if (!this.moving) {
                if (Position.isIPosition(p)) {
                    this.oldTrans.set(p);
                }
                else {
                    this.oldTrans.reset();
                }
                this.transform();
            }
            else {
                this.needTransform = true;
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (this.inBounds) {
            this.boundsCheck();
            this.oldTrans.add(this.tempTrans);
            this.tempTrans.reset();
        }
    }
    /**
     * @private
     * @return {?}
     */
    getDragEl() {
        return this.handle ? this.handle : this.el.nativeElement;
    }
    /**
     * @return {?}
     */
    resetPosition() {
        if (Position.isIPosition(this.position)) {
            this.oldTrans.set(this.position);
        }
        else {
            this.oldTrans.reset();
        }
        this.tempTrans.reset();
        this.transform();
    }
    /**
     * @private
     * @param {?} p
     * @return {?}
     */
    moveTo(p) {
        if (this.orignal) {
            p.subtract(this.orignal);
            this.tempTrans.set(p);
            this.tempTrans.divide(this.scale);
            this.transform();
            if (this.bounds) {
                this.edge.emit(this.boundsCheck());
            }
            this.movingOffset.emit(this.currTrans.value);
        }
    }
    /**
     * @private
     * @return {?}
     */
    transform() {
        /** @type {?} */
        let translateX = this.tempTrans.x + this.oldTrans.x;
        /** @type {?} */
        let translateY = this.tempTrans.y + this.oldTrans.y;
        if (this.lockAxis === 'x') {
            translateX = this.oldTrans.x;
            this.tempTrans.x = 0;
        }
        else if (this.lockAxis === 'y') {
            translateY = this.oldTrans.y;
            this.tempTrans.y = 0;
        }
        // Snap to grid: by grid size
        if (this.gridSize > 1) {
            translateX = Math.round(translateX / this.gridSize) * this.gridSize;
            translateY = Math.round(translateY / this.gridSize) * this.gridSize;
        }
        /** @type {?} */
        let value = `translate(${Math.round(translateX)}px, ${Math.round(translateY)}px)`;
        this.renderer.setStyle(this.el.nativeElement, 'transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-ms-transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-moz-transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-o-transform', value);
        // save current position
        this.currTrans.x = translateX;
        this.currTrans.y = translateY;
    }
    /**
     * @private
     * @return {?}
     */
    pickUp() {
        // get old z-index:
        this.oldZIndex = this.el.nativeElement.style.zIndex ? this.el.nativeElement.style.zIndex : '';
        if (window) {
            this.oldZIndex = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue('z-index');
        }
        if (this.zIndexMoving) {
            this.renderer.setStyle(this.el.nativeElement, 'z-index', this.zIndexMoving);
        }
        if (!this.moving) {
            this.started.emit(this.el.nativeElement);
            this.moving = true;
            /**
             * Fix performance issue:
             * https://github.com/xieziyu/angular2-draggable/issues/112
             */
            this.subscribeEvents();
        }
    }
    /**
     * @private
     * @return {?}
     */
    subscribeEvents() {
        this.draggingSub = fromEvent(document, 'mousemove', { passive: false }).subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => this.onMouseMove((/** @type {?} */ (event)))));
        this.draggingSub.add(fromEvent(document, 'touchmove', { passive: false }).subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => this.onMouseMove((/** @type {?} */ (event))))));
        this.draggingSub.add(fromEvent(document, 'mouseup', { passive: false }).subscribe((/**
         * @return {?}
         */
        () => this.putBack())));
        // checking if browser is IE or Edge - https://github.com/xieziyu/angular2-draggable/issues/153
        /** @type {?} */
        let isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
        if (!isIEOrEdge) {
            this.draggingSub.add(fromEvent(document, 'mouseleave', { passive: false }).subscribe((/**
             * @return {?}
             */
            () => this.putBack())));
        }
        this.draggingSub.add(fromEvent(document, 'touchend', { passive: false }).subscribe((/**
         * @return {?}
         */
        () => this.putBack())));
        this.draggingSub.add(fromEvent(document, 'touchcancel', { passive: false }).subscribe((/**
         * @return {?}
         */
        () => this.putBack())));
    }
    /**
     * @private
     * @return {?}
     */
    unsubscribeEvents() {
        this.draggingSub.unsubscribe();
        this.draggingSub = null;
    }
    /**
     * @return {?}
     */
    boundsCheck() {
        if (this.bounds) {
            /** @type {?} */
            let boundary = this.bounds.getBoundingClientRect();
            /** @type {?} */
            let elem = this.el.nativeElement.getBoundingClientRect();
            /** @type {?} */
            let result = {
                'top': this.outOfBounds.top ? true : boundary.top < elem.top,
                'right': this.outOfBounds.right ? true : boundary.right > elem.right,
                'bottom': this.outOfBounds.bottom ? true : boundary.bottom > elem.bottom,
                'left': this.outOfBounds.left ? true : boundary.left < elem.left
            };
            if (this.inBounds) {
                if (!result.top) {
                    this.tempTrans.y -= (elem.top - boundary.top) / this.scale;
                }
                if (!result.bottom) {
                    this.tempTrans.y -= (elem.bottom - boundary.bottom) / this.scale;
                }
                if (!result.right) {
                    this.tempTrans.x -= (elem.right - boundary.right) / this.scale;
                }
                if (!result.left) {
                    this.tempTrans.x -= (elem.left - boundary.left) / this.scale;
                }
                this.transform();
            }
            return result;
        }
    }
    /**
     * Get current offset
     * @return {?}
     */
    getCurrentOffset() {
        return this.currTrans.value;
    }
    /**
     * @private
     * @return {?}
     */
    putBack() {
        if (this._zIndex) {
            this.renderer.setStyle(this.el.nativeElement, 'z-index', this._zIndex);
        }
        else if (this.zIndexMoving) {
            if (this.oldZIndex) {
                this.renderer.setStyle(this.el.nativeElement, 'z-index', this.oldZIndex);
            }
            else {
                this.el.nativeElement.style.removeProperty('z-index');
            }
        }
        if (this.moving) {
            this.stopped.emit(this.el.nativeElement);
            // Remove the helper div:
            this._helperBlock.remove();
            if (this.needTransform) {
                if (Position.isIPosition(this.position)) {
                    this.oldTrans.set(this.position);
                }
                else {
                    this.oldTrans.reset();
                }
                this.transform();
                this.needTransform = false;
            }
            if (this.bounds) {
                this.edge.emit(this.boundsCheck());
            }
            this.moving = false;
            this.endOffset.emit(this.currTrans.value);
            if (this.trackPosition) {
                this.oldTrans.add(this.tempTrans);
            }
            this.tempTrans.reset();
            if (!this.trackPosition) {
                this.transform();
            }
            /**
             * Fix performance issue:
             * https://github.com/xieziyu/angular2-draggable/issues/112
             */
            this.unsubscribeEvents();
        }
    }
    /**
     * @param {?} target
     * @param {?} element
     * @return {?}
     */
    checkHandleTarget(target, element) {
        // Checks if the target is the element clicked, then checks each child element of element as well
        // Ignores button clicks
        // Ignore elements of type button
        if (element.tagName === 'BUTTON') {
            return false;
        }
        // If the target was found, return true (handle was found)
        if (element === target) {
            return true;
        }
        // Recursively iterate this elements children
        for (let child in element.children) {
            if (element.children.hasOwnProperty(child)) {
                if (this.checkHandleTarget(target, element.children[child])) {
                    return true;
                }
            }
        }
        // Handle was not found in this lineage
        // Note: return false is ignore unless it is the parent element
        return false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseDown(event) {
        // 1. skip right click;
        if (event instanceof MouseEvent && event.button === 2) {
            return;
        }
        // 2. if handle is set, the element can only be moved by handle
        /** @type {?} */
        let target = event.target || event.srcElement;
        if (this.handle !== undefined && !this.checkHandleTarget(target, this.handle)) {
            return;
        }
        // 3. if allow drag is set to false, ignore the mousedown
        if (this.allowDrag === false) {
            return;
        }
        if (this.preventDefaultEvent) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.orignal = Position.fromEvent(event, this.getDragEl());
        this.pickUp();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseMove(event) {
        if (this.moving && this.allowDrag) {
            if (this.preventDefaultEvent) {
                event.stopPropagation();
                event.preventDefault();
            }
            // Add a transparent helper div:
            this._helperBlock.add();
            this.moveTo(Position.fromEvent(event, this.getDragEl()));
        }
    }
}
AngularDraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngDraggable]',
                exportAs: 'ngDraggable'
            },] }
];
/** @nocollapse */
AngularDraggableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
AngularDraggableDirective.propDecorators = {
    started: [{ type: Output }],
    stopped: [{ type: Output }],
    edge: [{ type: Output }],
    handle: [{ type: Input }],
    bounds: [{ type: Input }],
    outOfBounds: [{ type: Input }],
    gridSize: [{ type: Input }],
    zIndexMoving: [{ type: Input }],
    zIndex: [{ type: Input }],
    inBounds: [{ type: Input }],
    trackPosition: [{ type: Input }],
    scale: [{ type: Input }],
    preventDefaultEvent: [{ type: Input }],
    position: [{ type: Input }],
    absPosition: [{ type: Input }],
    lockAxis: [{ type: Input }],
    movingOffset: [{ type: Output }],
    endOffset: [{ type: Output }],
    ngDraggable: [{ type: Input }],
    onMouseDown: [{ type: HostListener, args: ['mousedown', ['$event'],] }, { type: HostListener, args: ['touchstart', ['$event'],] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.allowDrag;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.moving;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.orignal;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.oldTrans;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.tempTrans;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.currTrans;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.oldZIndex;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype._zIndex;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.needTransform;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.draggingSub;
    /**
     * Bugfix: iFrames, and context unrelated elements block all events, and are unusable
     * https://github.com/xieziyu/angular2-draggable/issues/84
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype._helperBlock;
    /** @type {?} */
    AngularDraggableDirective.prototype.started;
    /** @type {?} */
    AngularDraggableDirective.prototype.stopped;
    /** @type {?} */
    AngularDraggableDirective.prototype.edge;
    /**
     * Make the handle HTMLElement draggable
     * @type {?}
     */
    AngularDraggableDirective.prototype.handle;
    /**
     * Set the bounds HTMLElement
     * @type {?}
     */
    AngularDraggableDirective.prototype.bounds;
    /**
     * List of allowed out of bounds edges *
     * @type {?}
     */
    AngularDraggableDirective.prototype.outOfBounds;
    /**
     * Round the position to nearest grid
     * @type {?}
     */
    AngularDraggableDirective.prototype.gridSize;
    /**
     * Set z-index when dragging
     * @type {?}
     */
    AngularDraggableDirective.prototype.zIndexMoving;
    /**
     * Whether to limit the element stay in the bounds
     * @type {?}
     */
    AngularDraggableDirective.prototype.inBounds;
    /**
     * Whether the element should use it's previous drag position on a new drag event.
     * @type {?}
     */
    AngularDraggableDirective.prototype.trackPosition;
    /**
     * Input css scale transform of element so translations are correct
     * @type {?}
     */
    AngularDraggableDirective.prototype.scale;
    /**
     * Whether to prevent default event
     * @type {?}
     */
    AngularDraggableDirective.prototype.preventDefaultEvent;
    /**
     * Set initial position by offsets
     * @type {?}
     */
    AngularDraggableDirective.prototype.position;
    /**
     * Lock axis: 'x' or 'y'
     * @type {?}
     */
    AngularDraggableDirective.prototype.lockAxis;
    /**
     * Emit position offsets when moving
     * @type {?}
     */
    AngularDraggableDirective.prototype.movingOffset;
    /**
     * Emit position offsets when put back
     * @type {?}
     */
    AngularDraggableDirective.prototype.endOffset;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.el;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kcmFnZ2FibGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUNoQyxLQUFLLEVBQUUsTUFBTSxFQUFVLFlBQVksRUFDbkMsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBYSxRQUFRLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFNckQsTUFBTSxPQUFPLHlCQUF5Qjs7Ozs7SUE4RnBDLFlBQW9CLEVBQWMsRUFBVSxRQUFtQjtRQUEzQyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQTdGdkQsY0FBUyxHQUFHLElBQUksQ0FBQztRQUNqQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2YsWUFBTyxHQUFhLElBQUksQ0FBQztRQUN6QixhQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlCLGNBQVMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsY0FBUyxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvQixjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2YsWUFBTyxHQUFHLEVBQUUsQ0FBQztRQUNiLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRXRCLGdCQUFXLEdBQWlCLElBQUksQ0FBQzs7Ozs7UUFNakMsaUJBQVksR0FBZ0IsSUFBSSxDQUFDO1FBRS9CLFlBQU8s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QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLFxuICBJbnB1dCwgT3V0cHV0LCBPbkluaXQsIEhvc3RMaXN0ZW5lcixcbiAgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uLCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IElQb3NpdGlvbiwgUG9zaXRpb24gfSBmcm9tICcuL21vZGVscy9wb3NpdGlvbic7XG5pbXBvcnQgeyBIZWxwZXJCbG9jayB9IGZyb20gJy4vd2lkZ2V0cy9oZWxwZXItYmxvY2snO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdEcmFnZ2FibGVdJyxcbiAgZXhwb3J0QXM6ICduZ0RyYWdnYWJsZSdcbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckRyYWdnYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuICBwcml2YXRlIGFsbG93RHJhZyA9IHRydWU7XG4gIHByaXZhdGUgbW92aW5nID0gZmFsc2U7XG4gIHByaXZhdGUgb3JpZ25hbDogUG9zaXRpb24gPSBudWxsO1xuICBwcml2YXRlIG9sZFRyYW5zID0gbmV3IFBvc2l0aW9uKDAsIDApO1xuICBwcml2YXRlIHRlbXBUcmFucyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcbiAgcHJpdmF0ZSBjdXJyVHJhbnMgPSBuZXcgUG9zaXRpb24oMCwgMCk7XG4gIHByaXZhdGUgb2xkWkluZGV4ID0gJyc7XG4gIHByaXZhdGUgX3pJbmRleCA9ICcnO1xuICBwcml2YXRlIG5lZWRUcmFuc2Zvcm0gPSBmYWxzZTtcblxuICBwcml2YXRlIGRyYWdnaW5nU3ViOiBTdWJzY3JpcHRpb24gPSBudWxsO1xuXG4gIC8qKlxuICAgKiBCdWdmaXg6IGlGcmFtZXMsIGFuZCBjb250ZXh0IHVucmVsYXRlZCBlbGVtZW50cyBibG9jayBhbGwgZXZlbnRzLCBhbmQgYXJlIHVudXNhYmxlXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS94aWV6aXl1L2FuZ3VsYXIyLWRyYWdnYWJsZS9pc3N1ZXMvODRcbiAgICovXG4gIHByaXZhdGUgX2hlbHBlckJsb2NrOiBIZWxwZXJCbG9jayA9IG51bGw7XG5cbiAgQE91dHB1dCgpIHN0YXJ0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHN0b3BwZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGVkZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKiogTWFrZSB0aGUgaGFuZGxlIEhUTUxFbGVtZW50IGRyYWdnYWJsZSAqL1xuICBASW5wdXQoKSBoYW5kbGU6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBTZXQgdGhlIGJvdW5kcyBIVE1MRWxlbWVudCAqL1xuICBASW5wdXQoKSBib3VuZHM6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBMaXN0IG9mIGFsbG93ZWQgb3V0IG9mIGJvdW5kcyBlZGdlcyAqKi9cbiAgQElucHV0KCkgb3V0T2ZCb3VuZHMgPSB7XG4gICAgdG9wOiBmYWxzZSxcbiAgICByaWdodDogZmFsc2UsXG4gICAgYm90dG9tOiBmYWxzZSxcbiAgICBsZWZ0OiBmYWxzZVxuICB9O1xuXG4gIC8qKiBSb3VuZCB0aGUgcG9zaXRpb24gdG8gbmVhcmVzdCBncmlkICovXG4gIEBJbnB1dCgpIGdyaWRTaXplID0gMTtcblxuICAvKiogU2V0IHotaW5kZXggd2hlbiBkcmFnZ2luZyAqL1xuICBASW5wdXQoKSB6SW5kZXhNb3Zpbmc6IHN0cmluZztcblxuICAvKiogU2V0IHotaW5kZXggd2hlbiBub3QgZHJhZ2dpbmcgKi9cbiAgQElucHV0KCkgc2V0IHpJbmRleChzZXR0aW5nOiBzdHJpbmcpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3otaW5kZXgnLCBzZXR0aW5nKTtcbiAgICB0aGlzLl96SW5kZXggPSBzZXR0aW5nO1xuICB9XG4gIC8qKiBXaGV0aGVyIHRvIGxpbWl0IHRoZSBlbGVtZW50IHN0YXkgaW4gdGhlIGJvdW5kcyAqL1xuICBASW5wdXQoKSBpbkJvdW5kcyA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBlbGVtZW50IHNob3VsZCB1c2UgaXQncyBwcmV2aW91cyBkcmFnIHBvc2l0aW9uIG9uIGEgbmV3IGRyYWcgZXZlbnQuICovXG4gIEBJbnB1dCgpIHRyYWNrUG9zaXRpb24gPSB0cnVlO1xuXG4gIC8qKiBJbnB1dCBjc3Mgc2NhbGUgdHJhbnNmb3JtIG9mIGVsZW1lbnQgc28gdHJhbnNsYXRpb25zIGFyZSBjb3JyZWN0ICovXG4gIEBJbnB1dCgpIHNjYWxlID0gMTtcblxuICAvKiogV2hldGhlciB0byBwcmV2ZW50IGRlZmF1bHQgZXZlbnQgKi9cbiAgQElucHV0KCkgcHJldmVudERlZmF1bHRFdmVudCA9IGZhbHNlO1xuXG4gIC8qKiBTZXQgaW5pdGlhbCBwb3NpdGlvbiBieSBvZmZzZXRzICovXG4gIEBJbnB1dCgpIHBvc2l0aW9uOiBJUG9zaXRpb24gPSB7IHg6IDAsIHk6IDAgfTtcblxuICBASW5wdXQoKSBzZXQgYWJzUG9zaXRpb24ocG9zaXRpb246IElQb3NpdGlvbikge1xuICAgIHRoaXMudGVtcFRyYW5zLnNldChwb3NpdGlvbik7XG4gICAgdGhpcy50ZW1wVHJhbnMuc3VidHJhY3QodGhpcy5vbGRUcmFucyk7XG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgfVxuXG4gIC8qKiBMb2NrIGF4aXM6ICd4JyBvciAneScgKi9cbiAgQElucHV0KCkgbG9ja0F4aXM6IHN0cmluZyA9IG51bGw7XG5cbiAgLyoqIEVtaXQgcG9zaXRpb24gb2Zmc2V0cyB3aGVuIG1vdmluZyAqL1xuICBAT3V0cHV0KCkgbW92aW5nT2Zmc2V0ID0gbmV3IEV2ZW50RW1pdHRlcjxJUG9zaXRpb24+KCk7XG5cbiAgLyoqIEVtaXQgcG9zaXRpb24gb2Zmc2V0cyB3aGVuIHB1dCBiYWNrICovXG4gIEBPdXRwdXQoKSBlbmRPZmZzZXQgPSBuZXcgRXZlbnRFbWl0dGVyPElQb3NpdGlvbj4oKTtcblxuICBASW5wdXQoKVxuICBzZXQgbmdEcmFnZ2FibGUoc2V0dGluZzogYW55KSB7XG4gICAgaWYgKHNldHRpbmcgIT09IHVuZGVmaW5lZCAmJiBzZXR0aW5nICE9PSBudWxsICYmIHNldHRpbmcgIT09ICcnKSB7XG4gICAgICB0aGlzLmFsbG93RHJhZyA9ICEhc2V0dGluZztcblxuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmdldERyYWdFbCgpO1xuXG4gICAgICBpZiAodGhpcy5hbGxvd0RyYWcpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnB1dEJhY2soKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gICAgdGhpcy5faGVscGVyQmxvY2sgPSBuZXcgSGVscGVyQmxvY2soZWwubmF0aXZlRWxlbWVudCwgcmVuZGVyZXIpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZ2V0RHJhZ0VsKCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQsICduZy1kcmFnZ2FibGUnKTtcbiAgICB9XG4gICAgdGhpcy5yZXNldFBvc2l0aW9uKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmJvdW5kcyA9IG51bGw7XG4gICAgdGhpcy5oYW5kbGUgPSBudWxsO1xuICAgIHRoaXMub3JpZ25hbCA9IG51bGw7XG4gICAgdGhpcy5vbGRUcmFucyA9IG51bGw7XG4gICAgdGhpcy50ZW1wVHJhbnMgPSBudWxsO1xuICAgIHRoaXMuY3VyclRyYW5zID0gbnVsbDtcbiAgICB0aGlzLl9oZWxwZXJCbG9jay5kaXNwb3NlKCk7XG4gICAgdGhpcy5faGVscGVyQmxvY2sgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMuZHJhZ2dpbmdTdWIpIHtcbiAgICAgIHRoaXMuZHJhZ2dpbmdTdWIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3Bvc2l0aW9uJ10gJiYgIWNoYW5nZXNbJ3Bvc2l0aW9uJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICBsZXQgcCA9IGNoYW5nZXNbJ3Bvc2l0aW9uJ10uY3VycmVudFZhbHVlO1xuXG4gICAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbihwKSkge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMuc2V0KHApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5pbkJvdW5kcykge1xuICAgICAgdGhpcy5ib3VuZHNDaGVjaygpO1xuICAgICAgdGhpcy5vbGRUcmFucy5hZGQodGhpcy50ZW1wVHJhbnMpO1xuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldERyYWdFbCgpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGUgPyB0aGlzLmhhbmRsZSA6IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIHJlc2V0UG9zaXRpb24oKSB7XG4gICAgaWYgKFBvc2l0aW9uLmlzSVBvc2l0aW9uKHRoaXMucG9zaXRpb24pKSB7XG4gICAgICB0aGlzLm9sZFRyYW5zLnNldCh0aGlzLnBvc2l0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbGRUcmFucy5yZXNldCgpO1xuICAgIH1cbiAgICB0aGlzLnRlbXBUcmFucy5yZXNldCgpO1xuICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gIH1cblxuICBwcml2YXRlIG1vdmVUbyhwOiBQb3NpdGlvbikge1xuICAgIGlmICh0aGlzLm9yaWduYWwpIHtcbiAgICAgIHAuc3VidHJhY3QodGhpcy5vcmlnbmFsKTtcbiAgICAgIHRoaXMudGVtcFRyYW5zLnNldChwKTtcbiAgICAgIHRoaXMudGVtcFRyYW5zLmRpdmlkZSh0aGlzLnNjYWxlKTtcbiAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLmVkZ2UuZW1pdCh0aGlzLmJvdW5kc0NoZWNrKCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1vdmluZ09mZnNldC5lbWl0KHRoaXMuY3VyclRyYW5zLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYW5zZm9ybSgpIHtcbiAgICBsZXQgdHJhbnNsYXRlWCA9IHRoaXMudGVtcFRyYW5zLnggKyB0aGlzLm9sZFRyYW5zLng7XG4gICAgbGV0IHRyYW5zbGF0ZVkgPSB0aGlzLnRlbXBUcmFucy55ICsgdGhpcy5vbGRUcmFucy55O1xuXG4gICAgaWYgKHRoaXMubG9ja0F4aXMgPT09ICd4Jykge1xuICAgICAgdHJhbnNsYXRlWCA9IHRoaXMub2xkVHJhbnMueDtcbiAgICAgIHRoaXMudGVtcFRyYW5zLnggPSAwO1xuICAgIH0gZWxzZSBpZiAodGhpcy5sb2NrQXhpcyA9PT0gJ3knKSB7XG4gICAgICB0cmFuc2xhdGVZID0gdGhpcy5vbGRUcmFucy55O1xuICAgICAgdGhpcy50ZW1wVHJhbnMueSA9IDA7XG4gICAgfVxuXG4gICAgLy8gU25hcCB0byBncmlkOiBieSBncmlkIHNpemVcbiAgICBpZiAodGhpcy5ncmlkU2l6ZSA+IDEpIHtcbiAgICAgIHRyYW5zbGF0ZVggPSBNYXRoLnJvdW5kKHRyYW5zbGF0ZVggLyB0aGlzLmdyaWRTaXplKSAqIHRoaXMuZ3JpZFNpemU7XG4gICAgICB0cmFuc2xhdGVZID0gTWF0aC5yb3VuZCh0cmFuc2xhdGVZIC8gdGhpcy5ncmlkU2l6ZSkgKiB0aGlzLmdyaWRTaXplO1xuICAgIH1cblxuICAgIGxldCB2YWx1ZSA9IGB0cmFuc2xhdGUoJHsgTWF0aC5yb3VuZCh0cmFuc2xhdGVYKSB9cHgsICR7IE1hdGgucm91bmQodHJhbnNsYXRlWSkgfXB4KWA7XG5cbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3RyYW5zZm9ybScsIHZhbHVlKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJy13ZWJraXQtdHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLW1zLXRyYW5zZm9ybScsIHZhbHVlKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJy1tb3otdHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLW8tdHJhbnNmb3JtJywgdmFsdWUpO1xuXG4gICAgLy8gc2F2ZSBjdXJyZW50IHBvc2l0aW9uXG4gICAgdGhpcy5jdXJyVHJhbnMueCA9IHRyYW5zbGF0ZVg7XG4gICAgdGhpcy5jdXJyVHJhbnMueSA9IHRyYW5zbGF0ZVk7XG4gIH1cblxuICBwcml2YXRlIHBpY2tVcCgpIHtcbiAgICAvLyBnZXQgb2xkIHotaW5kZXg6XG4gICAgdGhpcy5vbGRaSW5kZXggPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4ID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCA6ICcnO1xuXG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgdGhpcy5vbGRaSW5kZXggPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoJ3otaW5kZXgnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy56SW5kZXhNb3ZpbmcpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMuekluZGV4TW92aW5nKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICB0aGlzLnN0YXJ0ZWQuZW1pdCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuXG4gICAgICAvKipcbiAgICAgICAqIEZpeCBwZXJmb3JtYW5jZSBpc3N1ZTpcbiAgICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS94aWV6aXl1L2FuZ3VsYXIyLWRyYWdnYWJsZS9pc3N1ZXMvMTEyXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc3Vic2NyaWJlRXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdWJzY3JpYmVFdmVudHMoKSB7XG4gICAgdGhpcy5kcmFnZ2luZ1N1YiA9IGZyb21FdmVudChkb2N1bWVudCwgJ21vdXNlbW92ZScsIHsgcGFzc2l2ZTogZmFsc2UgfSkuc3Vic2NyaWJlKGV2ZW50ID0+IHRoaXMub25Nb3VzZU1vdmUoZXZlbnQgYXMgTW91c2VFdmVudCkpO1xuICAgIHRoaXMuZHJhZ2dpbmdTdWIuYWRkKGZyb21FdmVudChkb2N1bWVudCwgJ3RvdWNobW92ZScsIHsgcGFzc2l2ZTogZmFsc2UgfSkuc3Vic2NyaWJlKGV2ZW50ID0+IHRoaXMub25Nb3VzZU1vdmUoZXZlbnQgYXMgVG91Y2hFdmVudCkpKTtcbiAgICB0aGlzLmRyYWdnaW5nU3ViLmFkZChmcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZXVwJywgeyBwYXNzaXZlOiBmYWxzZSB9KS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5wdXRCYWNrKCkpKTtcbiAgICAvLyBjaGVja2luZyBpZiBicm93c2VyIGlzIElFIG9yIEVkZ2UgLSBodHRwczovL2dpdGh1Yi5jb20veGlleml5dS9hbmd1bGFyMi1kcmFnZ2FibGUvaXNzdWVzLzE1M1xuICAgIGxldCBpc0lFT3JFZGdlID0gL21zaWVcXHN8dHJpZGVudFxcLy9pLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIGlmICghaXNJRU9yRWRnZSkge1xuICAgICAgdGhpcy5kcmFnZ2luZ1N1Yi5hZGQoZnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2VsZWF2ZScsIHtwYXNzaXZlOiBmYWxzZX0pLnN1YnNjcmliZSgoKSA9PiB0aGlzLnB1dEJhY2soKSkpO1xuICAgIH1cbiAgICB0aGlzLmRyYWdnaW5nU3ViLmFkZChmcm9tRXZlbnQoZG9jdW1lbnQsICd0b3VjaGVuZCcsIHsgcGFzc2l2ZTogZmFsc2UgfSkuc3Vic2NyaWJlKCgpID0+IHRoaXMucHV0QmFjaygpKSk7XG4gICAgdGhpcy5kcmFnZ2luZ1N1Yi5hZGQoZnJvbUV2ZW50KGRvY3VtZW50LCAndG91Y2hjYW5jZWwnLCB7IHBhc3NpdmU6IGZhbHNlIH0pLnN1YnNjcmliZSgoKSA9PiB0aGlzLnB1dEJhY2soKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bnN1YnNjcmliZUV2ZW50cygpIHtcbiAgICB0aGlzLmRyYWdnaW5nU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5kcmFnZ2luZ1N1YiA9IG51bGw7XG4gIH1cblxuICBib3VuZHNDaGVjaygpIHtcbiAgICBpZiAodGhpcy5ib3VuZHMpIHtcbiAgICAgIGxldCBib3VuZGFyeSA9IHRoaXMuYm91bmRzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgbGV0IGVsZW0gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICAndG9wJzogdGhpcy5vdXRPZkJvdW5kcy50b3AgPyB0cnVlIDogYm91bmRhcnkudG9wIDwgZWxlbS50b3AsXG4gICAgICAgICdyaWdodCc6IHRoaXMub3V0T2ZCb3VuZHMucmlnaHQgPyB0cnVlIDogYm91bmRhcnkucmlnaHQgPiBlbGVtLnJpZ2h0LFxuICAgICAgICAnYm90dG9tJzogdGhpcy5vdXRPZkJvdW5kcy5ib3R0b20gPyB0cnVlIDogYm91bmRhcnkuYm90dG9tID4gZWxlbS5ib3R0b20sXG4gICAgICAgICdsZWZ0JzogdGhpcy5vdXRPZkJvdW5kcy5sZWZ0ID8gdHJ1ZSA6IGJvdW5kYXJ5LmxlZnQgPCBlbGVtLmxlZnRcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLmluQm91bmRzKSB7XG4gICAgICAgIGlmICghcmVzdWx0LnRvcCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnkgLT0gKGVsZW0udG9wIC0gYm91bmRhcnkudG9wKSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc3VsdC5ib3R0b20pIHtcbiAgICAgICAgICB0aGlzLnRlbXBUcmFucy55IC09IChlbGVtLmJvdHRvbSAtIGJvdW5kYXJ5LmJvdHRvbSkgLyB0aGlzLnNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXN1bHQucmlnaHQpIHtcbiAgICAgICAgICB0aGlzLnRlbXBUcmFucy54IC09IChlbGVtLnJpZ2h0IC0gYm91bmRhcnkucmlnaHQpIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzdWx0LmxlZnQpIHtcbiAgICAgICAgICB0aGlzLnRlbXBUcmFucy54IC09IChlbGVtLmxlZnQgLSBib3VuZGFyeS5sZWZ0KSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXQgY3VycmVudCBvZmZzZXQgKi9cbiAgZ2V0Q3VycmVudE9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyVHJhbnMudmFsdWU7XG4gIH1cblxuICBwcml2YXRlIHB1dEJhY2soKSB7XG4gICAgaWYgKHRoaXMuX3pJbmRleCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4JywgdGhpcy5fekluZGV4KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuekluZGV4TW92aW5nKSB7XG4gICAgICBpZiAodGhpcy5vbGRaSW5kZXgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4JywgdGhpcy5vbGRaSW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KCd6LWluZGV4Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubW92aW5nKSB7XG4gICAgICB0aGlzLnN0b3BwZWQuZW1pdCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgICAvLyBSZW1vdmUgdGhlIGhlbHBlciBkaXY6XG4gICAgICB0aGlzLl9oZWxwZXJCbG9jay5yZW1vdmUoKTtcblxuICAgICAgaWYgKHRoaXMubmVlZFRyYW5zZm9ybSkge1xuICAgICAgICBpZiAoUG9zaXRpb24uaXNJUG9zaXRpb24odGhpcy5wb3NpdGlvbikpIHtcbiAgICAgICAgICB0aGlzLm9sZFRyYW5zLnNldCh0aGlzLnBvc2l0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9sZFRyYW5zLnJlc2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYm91bmRzKSB7XG4gICAgICAgIHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmVuZE9mZnNldC5lbWl0KHRoaXMuY3VyclRyYW5zLnZhbHVlKTtcblxuICAgICAgaWYgKHRoaXMudHJhY2tQb3NpdGlvbikge1xuICAgICAgICB0aGlzLm9sZFRyYW5zLmFkZCh0aGlzLnRlbXBUcmFucyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudGVtcFRyYW5zLnJlc2V0KCk7XG5cbiAgICAgIGlmICghdGhpcy50cmFja1Bvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogRml4IHBlcmZvcm1hbmNlIGlzc3VlOlxuICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy8xMTJcbiAgICAgICAqL1xuICAgICAgdGhpcy51bnN1YnNjcmliZUV2ZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldDogRXZlbnRUYXJnZXQsIGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICAvLyBDaGVja3MgaWYgdGhlIHRhcmdldCBpcyB0aGUgZWxlbWVudCBjbGlja2VkLCB0aGVuIGNoZWNrcyBlYWNoIGNoaWxkIGVsZW1lbnQgb2YgZWxlbWVudCBhcyB3ZWxsXG4gICAgLy8gSWdub3JlcyBidXR0b24gY2xpY2tzXG5cbiAgICAvLyBJZ25vcmUgZWxlbWVudHMgb2YgdHlwZSBidXR0b25cbiAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSAnQlVUVE9OJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB0YXJnZXQgd2FzIGZvdW5kLCByZXR1cm4gdHJ1ZSAoaGFuZGxlIHdhcyBmb3VuZClcbiAgICBpZiAoZWxlbWVudCA9PT0gdGFyZ2V0KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBSZWN1cnNpdmVseSBpdGVyYXRlIHRoaXMgZWxlbWVudHMgY2hpbGRyZW5cbiAgICBmb3IgKGxldCBjaGlsZCBpbiBlbGVtZW50LmNoaWxkcmVuKSB7XG4gICAgICBpZiAoZWxlbWVudC5jaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShjaGlsZCkpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tIYW5kbGVUYXJnZXQodGFyZ2V0LCBlbGVtZW50LmNoaWxkcmVuW2NoaWxkXSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSB3YXMgbm90IGZvdW5kIGluIHRoaXMgbGluZWFnZVxuICAgIC8vIE5vdGU6IHJldHVybiBmYWxzZSBpcyBpZ25vcmUgdW5sZXNzIGl0IGlzIHRoZSBwYXJlbnQgZWxlbWVudFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBbJyRldmVudCddKVxuICBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpIHtcbiAgICAvLyAxLiBza2lwIHJpZ2h0IGNsaWNrO1xuICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgJiYgZXZlbnQuYnV0dG9uID09PSAyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIDIuIGlmIGhhbmRsZSBpcyBzZXQsIHRoZSBlbGVtZW50IGNhbiBvbmx5IGJlIG1vdmVkIGJ5IGhhbmRsZVxuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudDtcbiAgICBpZiAodGhpcy5oYW5kbGUgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5jaGVja0hhbmRsZVRhcmdldCh0YXJnZXQsIHRoaXMuaGFuZGxlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIDMuIGlmIGFsbG93IGRyYWcgaXMgc2V0IHRvIGZhbHNlLCBpZ25vcmUgdGhlIG1vdXNlZG93blxuICAgIGlmICh0aGlzLmFsbG93RHJhZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcmV2ZW50RGVmYXVsdEV2ZW50KSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnbmFsID0gUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50LCB0aGlzLmdldERyYWdFbCgpKTtcbiAgICB0aGlzLnBpY2tVcCgpO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gICAgaWYgKHRoaXMubW92aW5nICYmIHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICBpZiAodGhpcy5wcmV2ZW50RGVmYXVsdEV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgYSB0cmFuc3BhcmVudCBoZWxwZXIgZGl2OlxuICAgICAgdGhpcy5faGVscGVyQmxvY2suYWRkKCk7XG4gICAgICB0aGlzLm1vdmVUbyhQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQsIHRoaXMuZ2V0RHJhZ0VsKCkpKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==