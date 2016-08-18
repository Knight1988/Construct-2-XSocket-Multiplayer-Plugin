class LingCorClient extends GameClient {
    message: any;

    connect(url: string, name: string) {
        super.connect(url, name);
        const self = this;
        const $self = $(this);
        self.controller.on("updateobjectinfo", (data) => {
            $self.trigger("onUpdateObjectInfo", JSON.stringify(data));
        });
        self.controller.on("updateobjectvariable", (data) => {
            $self.trigger("onUpdateObjectVariable", JSON.stringify(data));
        });
        self.controller.on("destroyObjects", (data) => {
            $self.trigger("onDestroyObjects", JSON.stringify(data));
        });
        self.controller.on("playermessage", (data) => {
            self.message = data;
            $self.trigger("onPlayerMessage", JSON.stringify(data));
        });
    }

    updateObjectInfo(objs: Array<ObjectInfo>) {
        this.controller.invoke("updateobjectinfo", objs);
    }

    updateObjectVariable(objs: Array<any>) {
        this.controller.invoke("updateobjectvariable", objs);
    }

    destroyObjects(objs: Array<number>) {
        this.controller.invoke("destroyObjects", objs);
    }

    broadcastMessage(tag: string, value: any) {
        this.controller.invoke("playermessage", { tag, value });
    }

    onUpdateObjectInfo(action: Function) {
        $(this).on("onUpdateObjectInfo", (e, data) => {
            if (typeof (action) == "function") action(JSON.parse(data));
        });
    }

    onUpdateObjectVariable(action: Function) {
        $(this).on("onUpdateObjectVariable", (e, data) => {
            if (typeof (action) == "function") action(JSON.parse(data));
        });
    }

    onDestroyObjects(action: Function) {
        $(this).on("onDestroyObjects", (e, data) => {
            if (typeof (action) == "function") action(JSON.parse(data));
        });
    }

    onPlayerMessage(action: Function) {
        $(this).on("onPlayerMessage", (e, data) => {
            if (typeof (action) == "function") action(JSON.parse(data));
        });
    }
}