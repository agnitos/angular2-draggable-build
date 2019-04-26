/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export class ResizeHandle {
    /**
     * @param {?} parent
     * @param {?} renderer
     * @param {?} type
     * @param {?} css
     * @param {?} onMouseDown
     */
    constructor(parent, renderer, type, css, onMouseDown) {
        this.parent = parent;
        this.renderer = renderer;
        this.type = type;
        this.css = css;
        this.onMouseDown = onMouseDown;
        // generate handle div
        /** @type {?} */
        let handle = renderer.createElement('div');
        renderer.addClass(handle, 'ng-resizable-handle');
        renderer.addClass(handle, css);
        // add default diagonal for se handle
        if (type === 'se') {
            renderer.addClass(handle, 'ng-resizable-diagonal');
        }
        // append div to parent
        if (this.parent) {
            parent.appendChild(handle);
        }
        // create and register event listener
        this._onResize = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => { onMouseDown(event, this); });
        handle.addEventListener('mousedown', this._onResize, { passive: false });
        handle.addEventListener('touchstart', this._onResize, { passive: false });
        // done
        this._handle = handle;
    }
    /**
     * @return {?}
     */
    dispose() {
        this._handle.removeEventListener('mousedown', this._onResize);
        this._handle.removeEventListener('touchstart', this._onResize);
        if (this.parent) {
            this.parent.removeChild(this._handle);
        }
        this._handle = null;
        this._onResize = null;
    }
    /**
     * @return {?}
     */
    get el() {
        return this._handle;
    }
}
if (false) {
    /**
     * @type {?}
     * @protected
     */
    ResizeHandle.prototype._handle;
    /**
     * @type {?}
     * @private
     */
    ResizeHandle.prototype._onResize;
    /**
     * @type {?}
     * @protected
     */
    ResizeHandle.prototype.parent;
    /**
     * @type {?}
     * @protected
     */
    ResizeHandle.prototype.renderer;
    /** @type {?} */
    ResizeHandle.prototype.type;
    /** @type {?} */
    ResizeHandle.prototype.css;
    /**
     * @type {?}
     * @private
     */
    ResizeHandle.prototype.onMouseDown;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplLWhhbmRsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS8iLCJzb3VyY2VzIjpbImxpYi93aWRnZXRzL3Jlc2l6ZS1oYW5kbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE1BQU0sT0FBTyxZQUFZOzs7Ozs7OztJQUl2QixZQUNZLE1BQWUsRUFDZixRQUFtQixFQUN0QixJQUFZLEVBQ1osR0FBVyxFQUNWLFdBQWdCO1FBSmQsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUNmLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDdEIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFDVixnQkFBVyxHQUFYLFdBQVcsQ0FBSzs7O1lBR3BCLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztRQUMxQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2pELFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLHFDQUFxQztRQUNyQyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDakIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztTQUNwRDtRQUVELHVCQUF1QjtRQUN2QixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVCO1FBRUQscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTOzs7O1FBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQztRQUMxRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN6RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUUxRSxPQUFPO1FBQ1AsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDeEIsQ0FBQzs7OztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRS9ELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN2QztRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLENBQUM7Ozs7SUFFRCxJQUFJLEVBQUU7UUFDSixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztDQUNGOzs7Ozs7SUFoREMsK0JBQTJCOzs7OztJQUMzQixpQ0FBa0I7Ozs7O0lBR2hCLDhCQUF5Qjs7Ozs7SUFDekIsZ0NBQTZCOztJQUM3Qiw0QkFBbUI7O0lBQ25CLDJCQUFrQjs7Ozs7SUFDbEIsbUNBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBjbGFzcyBSZXNpemVIYW5kbGUge1xuICBwcm90ZWN0ZWQgX2hhbmRsZTogRWxlbWVudDtcbiAgcHJpdmF0ZSBfb25SZXNpemU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHBhcmVudDogRWxlbWVudCxcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nLFxuICAgIHB1YmxpYyBjc3M6IHN0cmluZyxcbiAgICBwcml2YXRlIG9uTW91c2VEb3duOiBhbnlcbiAgKSB7XG4gICAgLy8gZ2VuZXJhdGUgaGFuZGxlIGRpdlxuICAgIGxldCBoYW5kbGUgPSByZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByZW5kZXJlci5hZGRDbGFzcyhoYW5kbGUsICduZy1yZXNpemFibGUtaGFuZGxlJyk7XG4gICAgcmVuZGVyZXIuYWRkQ2xhc3MoaGFuZGxlLCBjc3MpO1xuXG4gICAgLy8gYWRkIGRlZmF1bHQgZGlhZ29uYWwgZm9yIHNlIGhhbmRsZVxuICAgIGlmICh0eXBlID09PSAnc2UnKSB7XG4gICAgICByZW5kZXJlci5hZGRDbGFzcyhoYW5kbGUsICduZy1yZXNpemFibGUtZGlhZ29uYWwnKTtcbiAgICB9XG5cbiAgICAvLyBhcHBlbmQgZGl2IHRvIHBhcmVudFxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGFuZCByZWdpc3RlciBldmVudCBsaXN0ZW5lclxuICAgIHRoaXMuX29uUmVzaXplID0gKGV2ZW50KSA9PiB7IG9uTW91c2VEb3duKGV2ZW50LCB0aGlzKTsgfTtcbiAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fb25SZXNpemUsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gICAgaGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblJlc2l6ZSwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcblxuICAgIC8vIGRvbmVcbiAgICB0aGlzLl9oYW5kbGUgPSBoYW5kbGU7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuX2hhbmRsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vblJlc2l6ZSk7XG4gICAgdGhpcy5faGFuZGxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblJlc2l6ZSk7XG5cbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMuX2hhbmRsZSk7XG4gICAgfVxuICAgIHRoaXMuX2hhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5fb25SZXNpemUgPSBudWxsO1xuICB9XG5cbiAgZ2V0IGVsKCkge1xuICAgIHJldHVybiB0aGlzLl9oYW5kbGU7XG4gIH1cbn1cbiJdfQ==