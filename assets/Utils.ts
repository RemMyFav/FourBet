import { Event, _decorator, Component, Node, director, view, screen, Sprite, SpriteFrame, resources, Texture2D,  __private} from 'cc';

/**
 * Check if this node has the component that you wan to add on. If so, return it. Else, create one and return
 * @param node The node that you want to add component to
 * @param type The type of the component that you want to add
 * @returns The component that is being added
 */
function addComponentNoDup<T extends Component>(node: Node, type: __private._types_globals__Constructor<T> | __private._types_globals__AbstractedConstructor<T>): T | null{
    if(!node.getComponent(type)){
        return node.addComponent(type)
    }
    return node.getComponent(type)
}

/**
 * The implementation of custom Event which allows to add extra infos when creating
 */
class MyEvent extends Event {
    constructor(name: string, bubbles?: boolean, detail?: any){
        super(name, bubbles);
        this.detail = detail;
    }
    public detail: any = null;  // Custom property
}

export { addComponentNoDup , MyEvent}