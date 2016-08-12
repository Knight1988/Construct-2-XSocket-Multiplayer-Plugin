var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameClient = (function (_super) {
    __extends(GameClient, _super);
    function GameClient() {
        _super.apply(this, arguments);
    }
    GameClient.prototype.connect = function (url, name, controllerName) {
        if (controllerName === void 0) { controllerName = "game"; }
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
    GameClient.prototype.updateObjectInfo = function (objs) {
        this.controller.invoke("updateobjectinfo", objs);
    };
    GameClient.prototype.destroyObjects = function (objs) {
        this.controller.invoke("destroyObjects", objs);
    };
    GameClient.prototype.onUpdateObjectInfo = function (action) {
        $(this).on("onUpdateObjectInfo", function (e, data) {
            if (typeof (action) == "function")
                action(JSON.parse(data));
        });
    };
    GameClient.prototype.onDestroyObjects = function (action) {
        $(this).on("onDestroyObjects", function (e, data) {
            if (typeof (action) == "function")
                action(JSON.parse(data));
        });
    };
    return GameClient;
}(RoomClient));
//# sourceMappingURL=game-client.js.map