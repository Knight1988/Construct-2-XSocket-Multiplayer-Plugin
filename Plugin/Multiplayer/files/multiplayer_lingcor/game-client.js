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
    GameClient.prototype.connect = function (url, name) {
        _super.prototype.connect.call(this, url, name);
        var self = this;
        var $self = $(this);
        self.controller.on("playermessage", function (data) {
            $self.trigger("onPlayerMessage", JSON.stringify(data));
        });
    };
    GameClient.prototype.sendMessage = function (tag, value) {
        this.controller.invoke("playermessage", { tag: tag, value: value });
    };
    GameClient.prototype.onPlayerMessage = function (action) {
        $(this).on("onPlayerMessage", function (e, data) {
            if (typeof (action) == "function")
                action(JSON.parse(data));
        });
    };
    return GameClient;
}(RoomClient));
//# sourceMappingURL=game-client.js.map