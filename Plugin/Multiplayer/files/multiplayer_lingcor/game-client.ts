class GameClient extends RoomClient {

    connect(url: string, name: string) {
        super.connect(url, name);
        const self = this;
        const $self = $(this);
        self.controller.on("playermessage", (data) => {
            $self.trigger("onPlayerMessage", JSON.stringify(data));
        });
    }

    sendMessage(tag: string, value: any) {
        this.controller.invoke("playermessage", { tag, value });
    }

    onPlayerMessage(action: Function) {
        $(this).on("onPlayerMessage", (e, data) => {
            if (typeof (action) == "function") action(JSON.parse(data));
        });
    }
}