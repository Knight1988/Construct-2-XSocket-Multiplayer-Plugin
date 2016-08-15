class LingCorClient extends GameClient {
    connect(url: string, name: string) {
        super.connect(url, name);
        const self = this;
        const $self = $(this);
        self.controller.on("updateobjectinfo", (data) => {
            $self.trigger("onUpdateObjectInfo", JSON.stringify(data));
        });
        self.controller.on("destroyObjects", (data) => {
            $self.trigger("onDestroyObjects", JSON.stringify(data));
        });
    }

    updateObjectInfo(objs: Array<ObjectInfo>) {
        this.controller.invoke("updateobjectinfo", objs);
    }

    destroyObjects(objs: Array<number>) {
        this.controller.invoke("destroyObjects", objs);
    }

    onUpdateObjectInfo(action: Function) {
        $(this).on("onUpdateObjectInfo", (e, data) => {
            if (typeof (action) == "function") action(JSON.parse(data));
        });
    }

    onDestroyObjects(action: Function) {
        $(this).on("onDestroyObjects", (e, data) => {
            if (typeof (action) == "function") action(JSON.parse(data));
        });
    }
}