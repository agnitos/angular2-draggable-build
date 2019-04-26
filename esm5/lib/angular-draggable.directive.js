/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Renderer2, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Position } from './models/position';
import { HelperBlock } from './widgets/helper-block';
var AngularDraggableDirective = /** @class */ (function () {
    function AngularDraggableDirective(el, renderer) {
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
    Object.defineProperty(AngularDraggableDirective.prototype, "zIndex", {
        /** Set z-index when not dragging */
        set: /**
         * Set z-index when not dragging
         * @param {?} setting
         * @return {?}
         */
        function (setting) {
            this.renderer.setStyle(this.el.nativeElement, 'z-index', setting);
            this._zIndex = setting;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularDraggableDirective.prototype, "absPosition", {
        set: /**
         * @param {?} position
         * @return {?}
         */
        function (position) {
            this.tempTrans.set(position);
            this.tempTrans.subtract(this.oldTrans);
            this.transform();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularDraggableDirective.prototype, "ngDraggable", {
        set: /**
         * @param {?} setting
         * @return {?}
         */
        function (setting) {
            if (setting !== undefined && setting !== null && setting !== '') {
                this.allowDrag = !!setting;
                /** @type {?} */
                var element = this.getDragEl();
                if (this.allowDrag) {
                    this.renderer.addClass(element, 'ng-draggable');
                }
                else {
                    this.putBack();
                    this.renderer.removeClass(element, 'ng-draggable');
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    AngularDraggableDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.allowDrag) {
            /** @type {?} */
            var element = this.getDragEl();
            this.renderer.addClass(element, 'ng-draggable');
        }
        this.resetPosition();
    };
    /**
     * @return {?}
     */
    AngularDraggableDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    AngularDraggableDirective.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['position'] && !changes['position'].isFirstChange()) {
            /** @type {?} */
            var p = changes['position'].currentValue;
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
    };
    /**
     * @return {?}
     */
    AngularDraggableDirective.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        if (this.inBounds) {
            this.boundsCheck();
            this.oldTrans.add(this.tempTrans);
            this.tempTrans.reset();
        }
    };
    /**
     * @private
     * @return {?}
     */
    AngularDraggableDirective.prototype.getDragEl = /**
     * @private
     * @return {?}
     */
    function () {
        return this.handle ? this.handle : this.el.nativeElement;
    };
    /**
     * @return {?}
     */
    AngularDraggableDirective.prototype.resetPosition = /**
     * @return {?}
     */
    function () {
        if (Position.isIPosition(this.position)) {
            this.oldTrans.set(this.position);
        }
        else {
            this.oldTrans.reset();
        }
        this.tempTrans.reset();
        this.transform();
    };
    /**
     * @private
     * @param {?} p
     * @return {?}
     */
    AngularDraggableDirective.prototype.moveTo = /**
     * @private
     * @param {?} p
     * @return {?}
     */
    function (p) {
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
    };
    /**
     * @private
     * @return {?}
     */
    AngularDraggableDirective.prototype.transform = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var translateX = this.tempTrans.x + this.oldTrans.x;
        /** @type {?} */
        var translateY = this.tempTrans.y + this.oldTrans.y;
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
        var value = "translate(" + Math.round(translateX) + "px, " + Math.round(translateY) + "px)";
        this.renderer.setStyle(this.el.nativeElement, 'transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-ms-transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-moz-transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-o-transform', value);
        // save current position
        this.currTrans.x = translateX;
        this.currTrans.y = translateY;
    };
    /**
     * @private
     * @return {?}
     */
    AngularDraggableDirective.prototype.pickUp = /**
     * @private
     * @return {?}
     */
    function () {
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
    };
    /**
     * @private
     * @return {?}
     */
    AngularDraggableDirective.prototype.subscribeEvents = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.draggingSub = fromEvent(document, 'mousemove', { passive: false }).subscribe((/**
         * @param {?} event
         * @return {?}
         */
        function (event) { return _this.onMouseMove((/** @type {?} */ (event))); }));
        this.draggingSub.add(fromEvent(document, 'touchmove', { passive: false }).subscribe((/**
         * @param {?} event
         * @return {?}
         */
        function (event) { return _this.onMouseMove((/** @type {?} */ (event))); })));
        this.draggingSub.add(fromEvent(document, 'mouseup', { passive: false }).subscribe((/**
         * @return {?}
         */
        function () { return _this.putBack(); })));
        // checking if browser is IE or Edge - https://github.com/xieziyu/angular2-draggable/issues/153
        /** @type {?} */
        var isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
        if (!isIEOrEdge) {
            this.draggingSub.add(fromEvent(document, 'mouseleave', { passive: false }).subscribe((/**
             * @return {?}
             */
            function () { return _this.putBack(); })));
        }
        this.draggingSub.add(fromEvent(document, 'touchend', { passive: false }).subscribe((/**
         * @return {?}
         */
        function () { return _this.putBack(); })));
        this.draggingSub.add(fromEvent(document, 'touchcancel', { passive: false }).subscribe((/**
         * @return {?}
         */
        function () { return _this.putBack(); })));
    };
    /**
     * @private
     * @return {?}
     */
    AngularDraggableDirective.prototype.unsubscribeEvents = /**
     * @private
     * @return {?}
     */
    function () {
        this.draggingSub.unsubscribe();
        this.draggingSub = null;
    };
    /**
     * @return {?}
     */
    AngularDraggableDirective.prototype.boundsCheck = /**
     * @return {?}
     */
    function () {
        if (this.bounds) {
            /** @type {?} */
            var boundary = this.bounds.getBoundingClientRect();
            /** @type {?} */
            var elem = this.el.nativeElement.getBoundingClientRect();
            /** @type {?} */
            var result = {
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
    };
    /** Get current offset */
    /**
     * Get current offset
     * @return {?}
     */
    AngularDraggableDirective.prototype.getCurrentOffset = /**
     * Get current offset
     * @return {?}
     */
    function () {
        return this.currTrans.value;
    };
    /**
     * @private
     * @return {?}
     */
    AngularDraggableDirective.prototype.putBack = /**
     * @private
     * @return {?}
     */
    function () {
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
    };
    /**
     * @param {?} target
     * @param {?} element
     * @return {?}
     */
    AngularDraggableDirective.prototype.checkHandleTarget = /**
     * @param {?} target
     * @param {?} element
     * @return {?}
     */
    function (target, element) {
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
        for (var child in element.children) {
            if (element.children.hasOwnProperty(child)) {
                if (this.checkHandleTarget(target, element.children[child])) {
                    return true;
                }
            }
        }
        // Handle was not found in this lineage
        // Note: return false is ignore unless it is the parent element
        return false;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AngularDraggableDirective.prototype.onMouseDown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // 1. skip right click;
        if (event instanceof MouseEvent && event.button === 2) {
            return;
        }
        // 2. if handle is set, the element can only be moved by handle
        /** @type {?} */
        var target = event.target || event.srcElement;
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AngularDraggableDirective.prototype.onMouseMove = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.moving && this.allowDrag) {
            if (this.preventDefaultEvent) {
                event.stopPropagation();
                event.preventDefault();
            }
            // Add a transparent helper div:
            this._helperBlock.add();
            this.moveTo(Position.fromEvent(event, this.getDragEl()));
        }
    };
    AngularDraggableDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ngDraggable]',
                    exportAs: 'ngDraggable'
                },] }
    ];
    /** @nocollapse */
    AngularDraggableDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
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
    return AngularDraggableDirective;
}());
export { AngularDraggableDirective };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kcmFnZ2FibGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUNoQyxLQUFLLEVBQUUsTUFBTSxFQUFVLFlBQVksRUFDbkMsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBYSxRQUFRLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFckQ7SUFrR0UsbUNBQW9CLEVBQWMsRUFBVSxRQUFtQjtRQUEzQyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQTdGdkQsY0FBUyxHQUFHLElBQUksQ0FBQztRQUNqQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2YsWUFBTyxHQUFhLElBQUksQ0FBQztRQUN6QixhQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlCLGNBQVMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsY0FBUyxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvQixjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2YsWUFBTyxHQUFHLEVBQUUsQ0FBQztRQUNiLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRXRCLGdCQUFXLEdBQWlCLElBQUksQ0FBQzs7Ozs7UUFNakMsaUJBQVksR0FBZ0IsSUFBSSxDQUFDO1FBRS9CLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBTyxD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OztJQU16QyxpREFBeUM7O0lBRXpDLDRDQUE0Qzs7SUFDNUMsNENBQTRDOztJQUM1Qyx5Q0FBeUM7Ozs7O0lBR3pDLDJDQUE2Qjs7Ozs7SUFHN0IsMkNBQTZCOzs7OztJQUc3QixnREFLRTs7Ozs7SUFHRiw2Q0FBc0I7Ozs7O0lBR3RCLGlEQUE4Qjs7Ozs7SUFROUIsNkNBQTBCOzs7OztJQUcxQixrREFBOEI7Ozs7O0lBRzlCLDBDQUFtQjs7Ozs7SUFHbkIsd0RBQXFDOzs7OztJQUdyQyw2Q0FBOEM7Ozs7O0lBUzlDLDZDQUFpQzs7Ozs7SUFHakMsaURBQXVEOzs7OztJQUd2RCw4Q0FBb0Q7Ozs7O0lBa0J4Qyx1Q0FBc0I7Ozs7O0lBQUUsNkNBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsXG4gIElucHV0LCBPdXRwdXQsIE9uSW5pdCwgSG9zdExpc3RlbmVyLFxuICBFdmVudEVtaXR0ZXIsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdJbml0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSVBvc2l0aW9uLCBQb3NpdGlvbiB9IGZyb20gJy4vbW9kZWxzL3Bvc2l0aW9uJztcbmltcG9ydCB7IEhlbHBlckJsb2NrIH0gZnJvbSAnLi93aWRnZXRzL2hlbHBlci1ibG9jayc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ0RyYWdnYWJsZV0nLFxuICBleHBvcnRBczogJ25nRHJhZ2dhYmxlJ1xufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRHJhZ2dhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XG4gIHByaXZhdGUgYWxsb3dEcmFnID0gdHJ1ZTtcbiAgcHJpdmF0ZSBtb3ZpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBvcmlnbmFsOiBQb3NpdGlvbiA9IG51bGw7XG4gIHByaXZhdGUgb2xkVHJhbnMgPSBuZXcgUG9zaXRpb24oMCwgMCk7XG4gIHByaXZhdGUgdGVtcFRyYW5zID0gbmV3IFBvc2l0aW9uKDAsIDApO1xuICBwcml2YXRlIGN1cnJUcmFucyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcbiAgcHJpdmF0ZSBvbGRaSW5kZXggPSAnJztcbiAgcHJpdmF0ZSBfekluZGV4ID0gJyc7XG4gIHByaXZhdGUgbmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgZHJhZ2dpbmdTdWI6IFN1YnNjcmlwdGlvbiA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEJ1Z2ZpeDogaUZyYW1lcywgYW5kIGNvbnRleHQgdW5yZWxhdGVkIGVsZW1lbnRzIGJsb2NrIGFsbCBldmVudHMsIGFuZCBhcmUgdW51c2FibGVcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy84NFxuICAgKi9cbiAgcHJpdmF0ZSBfaGVscGVyQmxvY2s6IEhlbHBlckJsb2NrID0gbnVsbDtcblxuICBAT3V0cHV0KCkgc3RhcnRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgc3RvcHBlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZWRnZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIC8qKiBNYWtlIHRoZSBoYW5kbGUgSFRNTEVsZW1lbnQgZHJhZ2dhYmxlICovXG4gIEBJbnB1dCgpIGhhbmRsZTogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIFNldCB0aGUgYm91bmRzIEhUTUxFbGVtZW50ICovXG4gIEBJbnB1dCgpIGJvdW5kczogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIExpc3Qgb2YgYWxsb3dlZCBvdXQgb2YgYm91bmRzIGVkZ2VzICoqL1xuICBASW5wdXQoKSBvdXRPZkJvdW5kcyA9IHtcbiAgICB0b3A6IGZhbHNlLFxuICAgIHJpZ2h0OiBmYWxzZSxcbiAgICBib3R0b206IGZhbHNlLFxuICAgIGxlZnQ6IGZhbHNlXG4gIH07XG5cbiAgLyoqIFJvdW5kIHRoZSBwb3NpdGlvbiB0byBuZWFyZXN0IGdyaWQgKi9cbiAgQElucHV0KCkgZ3JpZFNpemUgPSAxO1xuXG4gIC8qKiBTZXQgei1pbmRleCB3aGVuIGRyYWdnaW5nICovXG4gIEBJbnB1dCgpIHpJbmRleE1vdmluZzogc3RyaW5nO1xuXG4gIC8qKiBTZXQgei1pbmRleCB3aGVuIG5vdCBkcmFnZ2luZyAqL1xuICBASW5wdXQoKSBzZXQgekluZGV4KHNldHRpbmc6IHN0cmluZykge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHNldHRpbmcpO1xuICAgIHRoaXMuX3pJbmRleCA9IHNldHRpbmc7XG4gIH1cbiAgLyoqIFdoZXRoZXIgdG8gbGltaXQgdGhlIGVsZW1lbnQgc3RheSBpbiB0aGUgYm91bmRzICovXG4gIEBJbnB1dCgpIGluQm91bmRzID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgc2hvdWxkIHVzZSBpdCdzIHByZXZpb3VzIGRyYWcgcG9zaXRpb24gb24gYSBuZXcgZHJhZyBldmVudC4gKi9cbiAgQElucHV0KCkgdHJhY2tQb3NpdGlvbiA9IHRydWU7XG5cbiAgLyoqIElucHV0IGNzcyBzY2FsZSB0cmFuc2Zvcm0gb2YgZWxlbWVudCBzbyB0cmFuc2xhdGlvbnMgYXJlIGNvcnJlY3QgKi9cbiAgQElucHV0KCkgc2NhbGUgPSAxO1xuXG4gIC8qKiBXaGV0aGVyIHRvIHByZXZlbnQgZGVmYXVsdCBldmVudCAqL1xuICBASW5wdXQoKSBwcmV2ZW50RGVmYXVsdEV2ZW50ID0gZmFsc2U7XG5cbiAgLyoqIFNldCBpbml0aWFsIHBvc2l0aW9uIGJ5IG9mZnNldHMgKi9cbiAgQElucHV0KCkgcG9zaXRpb246IElQb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9O1xuXG4gIEBJbnB1dCgpIHNldCBhYnNQb3NpdGlvbihwb3NpdGlvbjogSVBvc2l0aW9uKSB7XG4gICAgdGhpcy50ZW1wVHJhbnMuc2V0KHBvc2l0aW9uKTtcbiAgICB0aGlzLnRlbXBUcmFucy5zdWJ0cmFjdCh0aGlzLm9sZFRyYW5zKTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICB9XG5cbiAgLyoqIExvY2sgYXhpczogJ3gnIG9yICd5JyAqL1xuICBASW5wdXQoKSBsb2NrQXhpczogc3RyaW5nID0gbnVsbDtcblxuICAvKiogRW1pdCBwb3NpdGlvbiBvZmZzZXRzIHdoZW4gbW92aW5nICovXG4gIEBPdXRwdXQoKSBtb3ZpbmdPZmZzZXQgPSBuZXcgRXZlbnRFbWl0dGVyPElQb3NpdGlvbj4oKTtcblxuICAvKiogRW1pdCBwb3NpdGlvbiBvZmZzZXRzIHdoZW4gcHV0IGJhY2sgKi9cbiAgQE91dHB1dCgpIGVuZE9mZnNldCA9IG5ldyBFdmVudEVtaXR0ZXI8SVBvc2l0aW9uPigpO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBuZ0RyYWdnYWJsZShzZXR0aW5nOiBhbnkpIHtcbiAgICBpZiAoc2V0dGluZyAhPT0gdW5kZWZpbmVkICYmIHNldHRpbmcgIT09IG51bGwgJiYgc2V0dGluZyAhPT0gJycpIHtcbiAgICAgIHRoaXMuYWxsb3dEcmFnID0gISFzZXR0aW5nO1xuXG4gICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZ2V0RHJhZ0VsKCk7XG5cbiAgICAgIGlmICh0aGlzLmFsbG93RHJhZykge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQsICduZy1kcmFnZ2FibGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHV0QmFjaygpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsZW1lbnQsICduZy1kcmFnZ2FibGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG5ldyBIZWxwZXJCbG9jayhlbC5uYXRpdmVFbGVtZW50LCByZW5kZXJlcik7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5hbGxvd0RyYWcpIHtcbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5nZXREcmFnRWwoKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWRyYWdnYWJsZScpO1xuICAgIH1cbiAgICB0aGlzLnJlc2V0UG9zaXRpb24oKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuYm91bmRzID0gbnVsbDtcbiAgICB0aGlzLmhhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5vcmlnbmFsID0gbnVsbDtcbiAgICB0aGlzLm9sZFRyYW5zID0gbnVsbDtcbiAgICB0aGlzLnRlbXBUcmFucyA9IG51bGw7XG4gICAgdGhpcy5jdXJyVHJhbnMgPSBudWxsO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5kcmFnZ2luZ1N1Yikge1xuICAgICAgdGhpcy5kcmFnZ2luZ1N1Yi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1sncG9zaXRpb24nXSAmJiAhY2hhbmdlc1sncG9zaXRpb24nXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIGxldCBwID0gY2hhbmdlc1sncG9zaXRpb24nXS5jdXJyZW50VmFsdWU7XG5cbiAgICAgIGlmICghdGhpcy5tb3ZpbmcpIHtcbiAgICAgICAgaWYgKFBvc2l0aW9uLmlzSVBvc2l0aW9uKHApKSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5zZXQocCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5yZXNldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubmVlZFRyYW5zZm9ybSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLmluQm91bmRzKSB7XG4gICAgICB0aGlzLmJvdW5kc0NoZWNrKCk7XG4gICAgICB0aGlzLm9sZFRyYW5zLmFkZCh0aGlzLnRlbXBUcmFucyk7XG4gICAgICB0aGlzLnRlbXBUcmFucy5yZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0RHJhZ0VsKCkge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZSA/IHRoaXMuaGFuZGxlIDogdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgcmVzZXRQb3NpdGlvbigpIHtcbiAgICBpZiAoUG9zaXRpb24uaXNJUG9zaXRpb24odGhpcy5wb3NpdGlvbikpIHtcbiAgICAgIHRoaXMub2xkVHJhbnMuc2V0KHRoaXMucG9zaXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9sZFRyYW5zLnJlc2V0KCk7XG4gICAgfVxuICAgIHRoaXMudGVtcFRyYW5zLnJlc2V0KCk7XG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZVRvKHA6IFBvc2l0aW9uKSB7XG4gICAgaWYgKHRoaXMub3JpZ25hbCkge1xuICAgICAgcC5zdWJ0cmFjdCh0aGlzLm9yaWduYWwpO1xuICAgICAgdGhpcy50ZW1wVHJhbnMuc2V0KHApO1xuICAgICAgdGhpcy50ZW1wVHJhbnMuZGl2aWRlKHRoaXMuc2NhbGUpO1xuICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcblxuICAgICAgaWYgKHRoaXMuYm91bmRzKSB7XG4gICAgICAgIHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubW92aW5nT2Zmc2V0LmVtaXQodGhpcy5jdXJyVHJhbnMudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhbnNmb3JtKCkge1xuICAgIGxldCB0cmFuc2xhdGVYID0gdGhpcy50ZW1wVHJhbnMueCArIHRoaXMub2xkVHJhbnMueDtcbiAgICBsZXQgdHJhbnNsYXRlWSA9IHRoaXMudGVtcFRyYW5zLnkgKyB0aGlzLm9sZFRyYW5zLnk7XG5cbiAgICBpZiAodGhpcy5sb2NrQXhpcyA9PT0gJ3gnKSB7XG4gICAgICB0cmFuc2xhdGVYID0gdGhpcy5vbGRUcmFucy54O1xuICAgICAgdGhpcy50ZW1wVHJhbnMueCA9IDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmxvY2tBeGlzID09PSAneScpIHtcbiAgICAgIHRyYW5zbGF0ZVkgPSB0aGlzLm9sZFRyYW5zLnk7XG4gICAgICB0aGlzLnRlbXBUcmFucy55ID0gMDtcbiAgICB9XG5cbiAgICAvLyBTbmFwIHRvIGdyaWQ6IGJ5IGdyaWQgc2l6ZVxuICAgIGlmICh0aGlzLmdyaWRTaXplID4gMSkge1xuICAgICAgdHJhbnNsYXRlWCA9IE1hdGgucm91bmQodHJhbnNsYXRlWCAvIHRoaXMuZ3JpZFNpemUpICogdGhpcy5ncmlkU2l6ZTtcbiAgICAgIHRyYW5zbGF0ZVkgPSBNYXRoLnJvdW5kKHRyYW5zbGF0ZVkgLyB0aGlzLmdyaWRTaXplKSAqIHRoaXMuZ3JpZFNpemU7XG4gICAgfVxuXG4gICAgbGV0IHZhbHVlID0gYHRyYW5zbGF0ZSgkeyBNYXRoLnJvdW5kKHRyYW5zbGF0ZVgpIH1weCwgJHsgTWF0aC5yb3VuZCh0cmFuc2xhdGVZKSB9cHgpYDtcblxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLXdlYmtpdC10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctbXMtdHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLW1vei10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctby10cmFuc2Zvcm0nLCB2YWx1ZSk7XG5cbiAgICAvLyBzYXZlIGN1cnJlbnQgcG9zaXRpb25cbiAgICB0aGlzLmN1cnJUcmFucy54ID0gdHJhbnNsYXRlWDtcbiAgICB0aGlzLmN1cnJUcmFucy55ID0gdHJhbnNsYXRlWTtcbiAgfVxuXG4gIHByaXZhdGUgcGlja1VwKCkge1xuICAgIC8vIGdldCBvbGQgei1pbmRleDpcbiAgICB0aGlzLm9sZFpJbmRleCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS56SW5kZXggPyB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4IDogJyc7XG5cbiAgICBpZiAod2luZG93KSB7XG4gICAgICB0aGlzLm9sZFpJbmRleCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZSgnei1pbmRleCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnpJbmRleE1vdmluZykge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4JywgdGhpcy56SW5kZXhNb3ZpbmcpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5tb3ZpbmcpIHtcbiAgICAgIHRoaXMuc3RhcnRlZC5lbWl0KHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICB0aGlzLm1vdmluZyA9IHRydWU7XG5cbiAgICAgIC8qKlxuICAgICAgICogRml4IHBlcmZvcm1hbmNlIGlzc3VlOlxuICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy8xMTJcbiAgICAgICAqL1xuICAgICAgdGhpcy5zdWJzY3JpYmVFdmVudHMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN1YnNjcmliZUV2ZW50cygpIHtcbiAgICB0aGlzLmRyYWdnaW5nU3ViID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgeyBwYXNzaXZlOiBmYWxzZSB9KS5zdWJzY3JpYmUoZXZlbnQgPT4gdGhpcy5vbk1vdXNlTW92ZShldmVudCBhcyBNb3VzZUV2ZW50KSk7XG4gICAgdGhpcy5kcmFnZ2luZ1N1Yi5hZGQoZnJvbUV2ZW50KGRvY3VtZW50LCAndG91Y2htb3ZlJywgeyBwYXNzaXZlOiBmYWxzZSB9KS5zdWJzY3JpYmUoZXZlbnQgPT4gdGhpcy5vbk1vdXNlTW92ZShldmVudCBhcyBUb3VjaEV2ZW50KSkpO1xuICAgIHRoaXMuZHJhZ2dpbmdTdWIuYWRkKGZyb21FdmVudChkb2N1bWVudCwgJ21vdXNldXAnLCB7IHBhc3NpdmU6IGZhbHNlIH0pLnN1YnNjcmliZSgoKSA9PiB0aGlzLnB1dEJhY2soKSkpO1xuICAgIC8vIGNoZWNraW5nIGlmIGJyb3dzZXIgaXMgSUUgb3IgRWRnZSAtIGh0dHBzOi8vZ2l0aHViLmNvbS94aWV6aXl1L2FuZ3VsYXIyLWRyYWdnYWJsZS9pc3N1ZXMvMTUzXG4gICAgbGV0IGlzSUVPckVkZ2UgPSAvbXNpZVxcc3x0cmlkZW50XFwvL2kudGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgaWYgKCFpc0lFT3JFZGdlKSB7XG4gICAgICB0aGlzLmRyYWdnaW5nU3ViLmFkZChmcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZWxlYXZlJywge3Bhc3NpdmU6IGZhbHNlfSkuc3Vic2NyaWJlKCgpID0+IHRoaXMucHV0QmFjaygpKSk7XG4gICAgfVxuICAgIHRoaXMuZHJhZ2dpbmdTdWIuYWRkKGZyb21FdmVudChkb2N1bWVudCwgJ3RvdWNoZW5kJywgeyBwYXNzaXZlOiBmYWxzZSB9KS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5wdXRCYWNrKCkpKTtcbiAgICB0aGlzLmRyYWdnaW5nU3ViLmFkZChmcm9tRXZlbnQoZG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIHsgcGFzc2l2ZTogZmFsc2UgfSkuc3Vic2NyaWJlKCgpID0+IHRoaXMucHV0QmFjaygpKSk7XG4gIH1cblxuICBwcml2YXRlIHVuc3Vic2NyaWJlRXZlbnRzKCkge1xuICAgIHRoaXMuZHJhZ2dpbmdTdWIudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmRyYWdnaW5nU3ViID0gbnVsbDtcbiAgfVxuXG4gIGJvdW5kc0NoZWNrKCkge1xuICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgbGV0IGJvdW5kYXJ5ID0gdGhpcy5ib3VuZHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBsZXQgZWxlbSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICd0b3AnOiB0aGlzLm91dE9mQm91bmRzLnRvcCA/IHRydWUgOiBib3VuZGFyeS50b3AgPCBlbGVtLnRvcCxcbiAgICAgICAgJ3JpZ2h0JzogdGhpcy5vdXRPZkJvdW5kcy5yaWdodCA/IHRydWUgOiBib3VuZGFyeS5yaWdodCA+IGVsZW0ucmlnaHQsXG4gICAgICAgICdib3R0b20nOiB0aGlzLm91dE9mQm91bmRzLmJvdHRvbSA/IHRydWUgOiBib3VuZGFyeS5ib3R0b20gPiBlbGVtLmJvdHRvbSxcbiAgICAgICAgJ2xlZnQnOiB0aGlzLm91dE9mQm91bmRzLmxlZnQgPyB0cnVlIDogYm91bmRhcnkubGVmdCA8IGVsZW0ubGVmdFxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMuaW5Cb3VuZHMpIHtcbiAgICAgICAgaWYgKCFyZXN1bHQudG9wKSB7XG4gICAgICAgICAgdGhpcy50ZW1wVHJhbnMueSAtPSAoZWxlbS50b3AgLSBib3VuZGFyeS50b3ApIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzdWx0LmJvdHRvbSkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnkgLT0gKGVsZW0uYm90dG9tIC0gYm91bmRhcnkuYm90dG9tKSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc3VsdC5yaWdodCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnggLT0gKGVsZW0ucmlnaHQgLSBib3VuZGFyeS5yaWdodCkgLyB0aGlzLnNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXN1bHQubGVmdCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnggLT0gKGVsZW0ubGVmdCAtIGJvdW5kYXJ5LmxlZnQpIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldCBjdXJyZW50IG9mZnNldCAqL1xuICBnZXRDdXJyZW50T2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJUcmFucy52YWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgcHV0QmFjaygpIHtcbiAgICBpZiAodGhpcy5fekluZGV4KSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3otaW5kZXgnLCB0aGlzLl96SW5kZXgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy56SW5kZXhNb3ZpbmcpIHtcbiAgICAgIGlmICh0aGlzLm9sZFpJbmRleCkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3otaW5kZXgnLCB0aGlzLm9sZFpJbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3otaW5kZXgnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5tb3ZpbmcpIHtcbiAgICAgIHRoaXMuc3RvcHBlZC5lbWl0KHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG5cbiAgICAgIC8vIFJlbW92ZSB0aGUgaGVscGVyIGRpdjpcbiAgICAgIHRoaXMuX2hlbHBlckJsb2NrLnJlbW92ZSgpO1xuXG4gICAgICBpZiAodGhpcy5uZWVkVHJhbnNmb3JtKSB7XG4gICAgICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbih0aGlzLnBvc2l0aW9uKSkge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMuc2V0KHRoaXMucG9zaXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICAgIHRoaXMubmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5ib3VuZHMpIHtcbiAgICAgICAgdGhpcy5lZGdlLmVtaXQodGhpcy5ib3VuZHNDaGVjaygpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuZW5kT2Zmc2V0LmVtaXQodGhpcy5jdXJyVHJhbnMudmFsdWUpO1xuXG4gICAgICBpZiAodGhpcy50cmFja1Bvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMub2xkVHJhbnMuYWRkKHRoaXMudGVtcFRyYW5zKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcblxuICAgICAgaWYgKCF0aGlzLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBGaXggcGVyZm9ybWFuY2UgaXNzdWU6XG4gICAgICAgKiBodHRwczovL2dpdGh1Yi5jb20veGlleml5dS9hbmd1bGFyMi1kcmFnZ2FibGUvaXNzdWVzLzExMlxuICAgICAgICovXG4gICAgICB0aGlzLnVuc3Vic2NyaWJlRXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tIYW5kbGVUYXJnZXQodGFyZ2V0OiBFdmVudFRhcmdldCwgZWxlbWVudDogRWxlbWVudCkge1xuICAgIC8vIENoZWNrcyBpZiB0aGUgdGFyZ2V0IGlzIHRoZSBlbGVtZW50IGNsaWNrZWQsIHRoZW4gY2hlY2tzIGVhY2ggY2hpbGQgZWxlbWVudCBvZiBlbGVtZW50IGFzIHdlbGxcbiAgICAvLyBJZ25vcmVzIGJ1dHRvbiBjbGlja3NcblxuICAgIC8vIElnbm9yZSBlbGVtZW50cyBvZiB0eXBlIGJ1dHRvblxuICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT09ICdCVVRUT04nKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHRhcmdldCB3YXMgZm91bmQsIHJldHVybiB0cnVlIChoYW5kbGUgd2FzIGZvdW5kKVxuICAgIGlmIChlbGVtZW50ID09PSB0YXJnZXQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIFJlY3Vyc2l2ZWx5IGl0ZXJhdGUgdGhpcyBlbGVtZW50cyBjaGlsZHJlblxuICAgIGZvciAobGV0IGNoaWxkIGluIGVsZW1lbnQuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuLmhhc093blByb3BlcnR5KGNoaWxkKSkge1xuICAgICAgICBpZiAodGhpcy5jaGVja0hhbmRsZVRhcmdldCh0YXJnZXQsIGVsZW1lbnQuY2hpbGRyZW5bY2hpbGRdKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHdhcyBub3QgZm91bmQgaW4gdGhpcyBsaW5lYWdlXG4gICAgLy8gTm90ZTogcmV0dXJuIGZhbHNlIGlzIGlnbm9yZSB1bmxlc3MgaXQgaXMgdGhlIHBhcmVudCBlbGVtZW50XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcigndG91Y2hzdGFydCcsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICAgIC8vIDEuIHNraXAgcmlnaHQgY2xpY2s7XG4gICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCAmJiBldmVudC5idXR0b24gPT09IDIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gMi4gaWYgaGFuZGxlIGlzIHNldCwgdGhlIGVsZW1lbnQgY2FuIG9ubHkgYmUgbW92ZWQgYnkgaGFuZGxlXG4gICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50O1xuICAgIGlmICh0aGlzLmhhbmRsZSAhPT0gdW5kZWZpbmVkICYmICF0aGlzLmNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldCwgdGhpcy5oYW5kbGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gMy4gaWYgYWxsb3cgZHJhZyBpcyBzZXQgdG8gZmFsc2UsIGlnbm9yZSB0aGUgbW91c2Vkb3duXG4gICAgaWYgKHRoaXMuYWxsb3dEcmFnID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByZXZlbnREZWZhdWx0RXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLm9yaWduYWwgPSBQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQsIHRoaXMuZ2V0RHJhZ0VsKCkpO1xuICAgIHRoaXMucGlja1VwKCk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpIHtcbiAgICBpZiAodGhpcy5tb3ZpbmcgJiYgdGhpcy5hbGxvd0RyYWcpIHtcbiAgICAgIGlmICh0aGlzLnByZXZlbnREZWZhdWx0RXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBhIHRyYW5zcGFyZW50IGhlbHBlciBkaXY6XG4gICAgICB0aGlzLl9oZWxwZXJCbG9jay5hZGQoKTtcbiAgICAgIHRoaXMubW92ZVRvKFBvc2l0aW9uLmZyb21FdmVudChldmVudCwgdGhpcy5nZXREcmFnRWwoKSkpO1xuICAgIH1cbiAgfVxufVxuIl19