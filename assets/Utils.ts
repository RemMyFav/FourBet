import { Event, _decorator, Component, Node, director, view, screen, Sprite, SpriteFrame, resources, Texture2D,  __private} from 'cc';
function addComponentNoDup<T extends Component>(node: Node, type: __private._types_globals__Constructor<T> | __private._types_globals__AbstractedConstructor<T>): T | null{
    if(!node.getComponent(type)){
        return node.addComponent(type)
    }
    return node.getComponent(type)
}
class MyEvent extends Event {
    constructor(name: string, bubbles?: boolean, detail?: any){
        super(name, bubbles);
        this.detail = detail;
    }
    public detail: any = null;  // Custom property
}

export { addComponentNoDup , MyEvent}