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

/**
 * This is the TYPE of ones hand card, a hand card should have
 * format of val + type. Such as 3 pair means a pair of 3,
 * 4 three kind means a three kind of 4, 5 nothing means 5 is 
 * the biggest, 6 flush means hand card with 6, 7, 8
 * type attribute: pair, three kind, flush, nothing
 * val attribute
 */
type HandType = {
    type: String;
    val: number;
    level: number;
}

class ThreeKind implements HandType {
    type = "three kind";
    val = 0;
    level = 3;
}
class Flush implements HandType {
    type = "flush";
    val = 0;
    level = 2;
}
class Pair implements HandType {
    type = "pair";
    val = 0;
    level = 1;
}
class HighCard implements HandType {
    type = "high card";
    val = 0;
    level = 0;
}
export { addComponentNoDup, MyEvent, Pair, ThreeKind, Flush, HighCard };
export type {HandType}