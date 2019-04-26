/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ResizeHandle = /** @class */ (function () {
    function ResizeHandle(parent, renderer, type, css, onMouseDown) {
        var _this = this;
        this.parent = parent;
        this.renderer = renderer;
        this.type = type;
        this.css = css;
        this.onMouseDown = onMouseDown;
        // generate handle div
        /** @type {?} */
        var handle = renderer.createElement('div');
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
        function (event) { onMouseDown(event, _this); });
        handle.addEventListener('mousedown', this._onResize, { passive: false });
        handle.addEventListener('touchstart', this._onResize, { passive: false });
        // done
        this._handle = handle;
    }
    /**
     * @return {?}
     */
    ResizeHandle.prototype.dispose = /**
     * @return {?}
     */
    function () {
        this._handle.removeEventListener('mousedown', this._onResize);
        this._handle.removeEventListener('touchstart', this._onResize);
        if (this.parent) {
            this.parent.removeChild(this._handle);
        }
        this._handle = null;
        this._onResize = null;
    };
    Object.defineProperty(ResizeHandle.prototype, "el", {
        get: /**
         * @return {?}
         */
        function () {
            return this._handle;
        },
        enumerable: true,
        configurable: true
    });
    return ResizeHandle;
}());
export { ResizeHandle };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplLWhhbmRsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS8iLCJzb3VyY2VzIjpbImxpYi93aWRnZXRzL3Jlc2l6ZS1oYW5kbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBO0lBSUUsc0JBQ1ksTUFBZSxFQUNmLFFBQW1CLEVBQ3RCLElBQVksRUFDWixHQUFXLEVBQ1YsV0FBZ0I7UUFMMUIsaUJBNkJDO1FBNUJXLFdBQU0sR0FBTixNQUFNLENBQVM7UUFDZixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ3RCLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQ1YsZ0JBQVcsR0FBWCxXQUFXLENBQUs7OztZQUdwQixNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDMUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUNqRCxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUUvQixxQ0FBcUM7UUFDckMsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ2pCLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLHVCQUF1QixDQUFDLENBQUM7U0FDcEQ7UUFFRCx1QkFBdUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QjtRQUVELHFDQUFxQztRQUNyQyxJQUFJLENBQUMsU0FBUzs7OztRQUFHLFVBQUMsS0FBSyxJQUFPLFdBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQztRQUMxRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN6RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUUxRSxPQUFPO1FBQ1AsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDeEIsQ0FBQzs7OztJQUVELDhCQUFPOzs7SUFBUDtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFL0QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQUVELHNCQUFJLDRCQUFFOzs7O1FBQU47WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQzs7O09BQUE7SUFDSCxtQkFBQztBQUFELENBQUMsQUFqREQsSUFpREM7Ozs7Ozs7SUFoREMsK0JBQTJCOzs7OztJQUMzQixpQ0FBa0I7Ozs7O0lBR2hCLDhCQUF5Qjs7Ozs7SUFDekIsZ0NBQTZCOztJQUM3Qiw0QkFBbUI7O0lBQ25CLDJCQUFrQjs7Ozs7SUFDbEIsbUNBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBjbGFzcyBSZXNpemVIYW5kbGUge1xuICBwcm90ZWN0ZWQgX2hhbmRsZTogRWxlbWVudDtcbiAgcHJpdmF0ZSBfb25SZXNpemU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHBhcmVudDogRWxlbWVudCxcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nLFxuICAgIHB1YmxpYyBjc3M6IHN0cmluZyxcbiAgICBwcml2YXRlIG9uTW91c2VEb3duOiBhbnlcbiAgKSB7XG4gICAgLy8gZ2VuZXJhdGUgaGFuZGxlIGRpdlxuICAgIGxldCBoYW5kbGUgPSByZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByZW5kZXJlci5hZGRDbGFzcyhoYW5kbGUsICduZy1yZXNpemFibGUtaGFuZGxlJyk7XG4gICAgcmVuZGVyZXIuYWRkQ2xhc3MoaGFuZGxlLCBjc3MpO1xuXG4gICAgLy8gYWRkIGRlZmF1bHQgZGlhZ29uYWwgZm9yIHNlIGhhbmRsZVxuICAgIGlmICh0eXBlID09PSAnc2UnKSB7XG4gICAgICByZW5kZXJlci5hZGRDbGFzcyhoYW5kbGUsICduZy1yZXNpemFibGUtZGlhZ29uYWwnKTtcbiAgICB9XG5cbiAgICAvLyBhcHBlbmQgZGl2IHRvIHBhcmVudFxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGFuZCByZWdpc3RlciBldmVudCBsaXN0ZW5lclxuICAgIHRoaXMuX29uUmVzaXplID0gKGV2ZW50KSA9PiB7IG9uTW91c2VEb3duKGV2ZW50LCB0aGlzKTsgfTtcbiAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fb25SZXNpemUsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gICAgaGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblJlc2l6ZSwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcblxuICAgIC8vIGRvbmVcbiAgICB0aGlzLl9oYW5kbGUgPSBoYW5kbGU7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuX2hhbmRsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vblJlc2l6ZSk7XG4gICAgdGhpcy5faGFuZGxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblJlc2l6ZSk7XG5cbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMuX2hhbmRsZSk7XG4gICAgfVxuICAgIHRoaXMuX2hhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5fb25SZXNpemUgPSBudWxsO1xuICB9XG5cbiAgZ2V0IGVsKCkge1xuICAgIHJldHVybiB0aGlzLl9oYW5kbGU7XG4gIH1cbn1cbiJdfQ==