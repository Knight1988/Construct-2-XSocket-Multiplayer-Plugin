declare var xsockets: any;

class Client {
    connection: any;
    connectionUrl: string;
    controller: any;
    me: Player;
    serverVersion: string;

    connect(url: string, name: string, controllerName: string = "player") {
        const self = this;
        const $self = $(this);
        // ReSharper disable once InconsistentNaming
        self.connection = new xsockets.client(self.connectionUrl = url);
        self.connection.setParameters({ name: name });
        self.controller = self.connection.controller(controllerName);

        self.connection.onOpen = (e:Event) => {
            $self.trigger("onOpen", e);
        };

        self.connection.onClose = (e: Event) => {
            $self.trigger("onClose", e);
        };

        self.connection.onError = (e: Event) => {
            $self.trigger("onError", e);
        };

        self.controller.on("connected", (data) => {
            self.me = data.me;
            self.serverVersion = data.serverVersion;
            $self.trigger("onConnected");
        });

        self.connection.open();
    }

    disconnect() {
        this.connection.close();
    }

    onOpen(action: Function) {
        $(this).on("onOpen", (e, data) => {
            if (typeof (action) == "function") action(data);
        });
    }

    onClose(action: Function) {
        $(this).on("onClose", (e, data) => {
            if (typeof (action) == "function") action(data);
        });
    }

    onError(action: Function) {
        $(this).on("onError", (e, data) => {
            if (typeof (action) == "function") action(data);
        });
    }

    onConnected(action: Function) {
        $(this).on("onConnected", () => {
            if (typeof (action) == "function") action();
        });
    }
}