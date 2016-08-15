var Client = (function () {
    function Client() {
        this.me = new Player();
    }
    Client.prototype.connect = function (url, name) {
        var self = this;
        var $self = $(this);
        // ReSharper disable once InconsistentNaming
        self.connection = new xsockets.client(self.connectionUrl = url);
        self.connection.setParameters({ name: name });
        self.controller = self.connection.controller("lingcor");
        self.connection.onOpen = function (e) {
            $self.trigger("onOpen", e);
        };
        self.connection.onClose = function (e) {
            $self.trigger("onClose", e);
        };
        self.connection.onError = function (e) {
            $self.trigger("onError", e);
        };
        self.controller.on("connected", function (data) {
            self.me = data.me;
            self.serverVersion = data.serverVersion;
            $self.trigger("onConnected");
        });
        self.connection.open();
    };
    Client.prototype.disconnect = function () {
        this.connection.close();
    };
    Client.prototype.onOpen = function (action) {
        $(this).on("onOpen", function (e, data) {
            if (typeof (action) == "function")
                action(data);
        });
    };
    Client.prototype.onClose = function (action) {
        $(this).on("onClose", function (e, data) {
            if (typeof (action) == "function")
                action(data);
        });
    };
    Client.prototype.onError = function (action) {
        $(this).on("onError", function (e, data) {
            if (typeof (action) == "function")
                action(data);
        });
    };
    Client.prototype.onConnected = function (action) {
        $(this).on("onConnected", function () {
            if (typeof (action) == "function")
                action();
        });
    };
    return Client;
}());
//# sourceMappingURL=client.js.map