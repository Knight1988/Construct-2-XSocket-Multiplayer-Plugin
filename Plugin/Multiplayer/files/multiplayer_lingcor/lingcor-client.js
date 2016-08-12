var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LingCorClient = (function (_super) {
    __extends(LingCorClient, _super);
    function LingCorClient() {
        _super.apply(this, arguments);
    }
    LingCorClient.prototype.connect = function (url, name, controllerName) {
        if (controllerName === void 0) { controllerName = "lingcor"; }
        _super.prototype.connect.call(this, url, name, controllerName);
        var self = this;
        var $self = $(this);
        self.controller.on("updateobjectinfo", function (data) {
            $self.trigger("onUpdateObjectInfo", JSON.stringify(data));
        });
        self.controller.on("destroyObjects", function (data) {
            $self.trigger("onDestroyObjects", JSON.stringify(data));
        });
    };
    LingCorClient.prototype.updateObjectInfo = function (objs) {
        this.controller.invoke("updateobjectinfo", objs);
    };
    LingCorClient.prototype.destroyObjects = function (objs) {
        this.controller.invoke("destroyObjects", objs);
    };
    LingCorClient.prototype.onUpdateObjectInfo = function (action) {
        $(this).on("onUpdateObjectInfo", function (e, data) {
            if (typeof (action) == "function")
                action(JSON.parse(data));
        });
    };
    LingCorClient.prototype.onDestroyObjects = function (action) {
        $(this).on("onDestroyObjects", function (e, data) {
            if (typeof (action) == "function")
                action(JSON.parse(data));
        });
    };
    return LingCorClient;
}(GameClient));
//# sourceMappingURL=lingcor-client.js.map