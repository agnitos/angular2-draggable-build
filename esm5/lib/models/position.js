/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function IPosition() { }
if (false) {
    /** @type {?} */
    IPosition.prototype.x;
    /** @type {?} */
    IPosition.prototype.y;
}
var Position = /** @class */ (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * @param {?} e
     * @param {?=} el
     * @return {?}
     */
    Position.fromEvent = /**
     * @param {?} e
     * @param {?=} el
     * @return {?}
     */
    function (e, el) {
        if (el === void 0) { el = null; }
        if (e instanceof MouseEvent) {
            return new Position(e.clientX, e.clientY);
        }
        else {
            if (el === null || e.changedTouches.length === 1) {
                return new Position(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
            /**
             * Fix issue: Multiple phone draggables at the same time
             * https://github.com/xieziyu/angular2-draggable/issues/128
             */
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].target === el) {
                    return new Position(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                }
            }
        }
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    Position.isIPosition = /**
     * @param {?} obj
     * @return {?}
     */
    function (obj) {
        return !!obj && ('x' in obj) && ('y' in obj);
    };
    /**
     * @param {?} el
     * @return {?}
     */
    Position.getCurrent = /**
     * @param {?} el
     * @return {?}
     */
    function (el) {
        /** @type {?} */
        var pos = new Position(0, 0);
        if (window) {
            /** @type {?} */
            var computed = window.getComputedStyle(el);
            if (computed) {
                /** @type {?} */
                var x = parseInt(computed.getPropertyValue('left'), 10);
                /** @type {?} */
                var y = parseInt(computed.getPropertyValue('top'), 10);
                pos.x = isNaN(x) ? 0 : x;
                pos.y = isNaN(y) ? 0 : y;
            }
            return pos;
        }
        else {
            console.error('Not Supported!');
            return null;
        }
    };
    /**
     * @param {?} p
     * @return {?}
     */
    Position.copy = /**
     * @param {?} p
     * @return {?}
     */
    function (p) {
        return new Position(0, 0).set(p);
    };
    Object.defineProperty(Position.prototype, "value", {
        get: /**
         * @return {?}
         */
        function () {
            return { x: this.x, y: this.y };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @template THIS
     * @this {THIS}
     * @param {?} p
     * @return {THIS}
     */
    Position.prototype.add = /**
     * @template THIS
     * @this {THIS}
     * @param {?} p
     * @return {THIS}
     */
    function (p) {
        (/** @type {?} */ (this)).x += p.x;
        (/** @type {?} */ (this)).y += p.y;
        return (/** @type {?} */ (this));
    };
    /**
     * @template THIS
     * @this {THIS}
     * @param {?} p
     * @return {THIS}
     */
    Position.prototype.subtract = /**
     * @template THIS
     * @this {THIS}
     * @param {?} p
     * @return {THIS}
     */
    function (p) {
        (/** @type {?} */ (this)).x -= p.x;
        (/** @type {?} */ (this)).y -= p.y;
        return (/** @type {?} */ (this));
    };
    /**
     * @param {?} n
     * @return {?}
     */
    Position.prototype.multiply = /**
     * @param {?} n
     * @return {?}
     */
    function (n) {
        this.x *= n;
        this.y *= n;
    };
    /**
     * @param {?} n
     * @return {?}
     */
    Position.prototype.divide = /**
     * @param {?} n
     * @return {?}
     */
    function (n) {
        this.x /= n;
        this.y /= n;
    };
    /**
     * @template THIS
     * @this {THIS}
     * @return {THIS}
     */
    Position.prototype.reset = /**
     * @template THIS
     * @this {THIS}
     * @return {THIS}
     */
    function () {
        (/** @type {?} */ (this)).x = 0;
        (/** @type {?} */ (this)).y = 0;
        return (/** @type {?} */ (this));
    };
    /**
     * @template THIS
     * @this {THIS}
     * @param {?} p
     * @return {THIS}
     */
    Position.prototype.set = /**
     * @template THIS
     * @this {THIS}
     * @param {?} p
     * @return {THIS}
     */
    function (p) {
        (/** @type {?} */ (this)).x = p.x;
        (/** @type {?} */ (this)).y = p.y;
        return (/** @type {?} */ (this));
    };
    return Position;
}());
export { Position };
if (false) {
    /** @type {?} */
    Position.prototype.x;
    /** @type {?} */
    Position.prototype.y;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpb24uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvIiwic291cmNlcyI6WyJsaWIvbW9kZWxzL3Bvc2l0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSwrQkFHQzs7O0lBRkMsc0JBQVU7O0lBQ1Ysc0JBQVU7O0FBR1o7SUFDRSxrQkFBbUIsQ0FBUyxFQUFTLENBQVM7UUFBM0IsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUFTLE1BQUMsR0FBRCxDQUFDLENBQVE7SUFBSSxDQUFDOzs7Ozs7SUFFNUMsa0JBQVM7Ozs7O0lBQWhCLFVBQWlCLENBQTBCLEVBQUUsRUFBYztRQUFkLG1CQUFBLEVBQUEsU0FBYztRQUN6RCxJQUFJLENBQUMsWUFBWSxVQUFVLEVBQUU7WUFDM0IsT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMzQzthQUFNO1lBQ0wsSUFBSSxFQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDaEQsT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQy9FO1lBRUQ7OztlQUdHO1lBQ0gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNoRCxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEVBQUUsRUFBRTtvQkFDckMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENB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QUNYLE9BQU8sbUJBQUEsSUFBSSxFQUFBLENBQUM7SUFDZCxDQUFDOzs7Ozs7O0lBRUQsc0JBQUc7Ozs7OztJQUFILFVBQUksQ0FBWTtRQUNkLG1CQUFBLElBQUksRUFBQSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2IsbUJBQUEsSUFBSSxFQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDYixPQUFPLG1CQUFBLElBQUksRUFBQSxDQUFDO0lBQ2QsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBdEZELElBc0ZDOzs7O0lBckZhLHFCQUFnQjs7SUFBRSxxQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIElQb3NpdGlvbiB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgUG9zaXRpb24gaW1wbGVtZW50cyBJUG9zaXRpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgeDogbnVtYmVyLCBwdWJsaWMgeTogbnVtYmVyKSB7IH1cblxuICBzdGF0aWMgZnJvbUV2ZW50KGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50LCBlbDogYW55ID0gbnVsbCkge1xuICAgIGlmIChlIGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlbCA9PT0gbnVsbCB8fCBlLmNoYW5nZWRUb3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uKGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCwgZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBGaXggaXNzdWU6IE11bHRpcGxlIHBob25lIGRyYWdnYWJsZXMgYXQgdGhlIHNhbWUgdGltZVxuICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy8xMjhcbiAgICAgICAqL1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlLmNoYW5nZWRUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChlLmNoYW5nZWRUb3VjaGVzW2ldLnRhcmdldCA9PT0gZWwpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uKGUuY2hhbmdlZFRvdWNoZXNbaV0uY2xpZW50WCwgZS5jaGFuZ2VkVG91Y2hlc1tpXS5jbGllbnRZKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpc0lQb3NpdGlvbihvYmopOiBvYmogaXMgSVBvc2l0aW9uIHtcbiAgICByZXR1cm4gISFvYmogJiYgKCd4JyBpbiBvYmopICYmICgneScgaW4gb2JqKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDdXJyZW50KGVsOiBFbGVtZW50KSB7XG4gICAgbGV0IHBvcyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcblxuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICAgIGxldCB4ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnbGVmdCcpLCAxMCk7XG4gICAgICAgIGxldCB5ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgndG9wJyksIDEwKTtcbiAgICAgICAgcG9zLnggPSBpc05hTih4KSA/IDAgOiB4O1xuICAgICAgICBwb3MueSA9IGlzTmFOKHkpID8gMCA6IHk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcG9zO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdOb3QgU3VwcG9ydGVkIScpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGNvcHkocDogSVBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIG5ldyBQb3NpdGlvbigwLCAwKS5zZXQocCk7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogSVBvc2l0aW9uIHtcbiAgICByZXR1cm4geyB4OiB0aGlzLngsIHk6IHRoaXMueSB9O1xuICB9XG5cbiAgYWRkKHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCArPSBwLng7XG4gICAgdGhpcy55ICs9IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN1YnRyYWN0KHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCAtPSBwLng7XG4gICAgdGhpcy55IC09IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG11bHRpcGx5KG46IG51bWJlcikge1xuICAgIHRoaXMueCAqPSBuO1xuICAgIHRoaXMueSAqPSBuO1xuICB9XG5cbiAgZGl2aWRlKG46IG51bWJlcikge1xuICAgIHRoaXMueCAvPSBuO1xuICAgIHRoaXMueSAvPSBuO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0KHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCA9IHAueDtcbiAgICB0aGlzLnkgPSBwLnk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiJdfQ==