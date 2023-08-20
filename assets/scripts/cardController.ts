import { _decorator, Component, Node, director, view, screen, Sprite, SpriteFrame, resources, Texture2D, UITransform} from 'cc';
import { addComponentNoDup } from '../Utils'
const { ccclass, property } = _decorator;

@ccclass('cardController')
export class CardController extends Component {
    @property
    private card_face: number;

    protected onLoad(): void {
        console.log(this.card_face);
        this._name = "card" + this.card_face;
        resources.load("image/cardback/spriteFrame", SpriteFrame, (err, spriteFrame) => {
            // Load cardback image
            let matchSprite: Sprite = addComponentNoDup(this.node, Sprite);
            matchSprite.spriteFrame = spriteFrame;
            matchSprite.type = Sprite.Type.SIMPLE;
            // Calculate the scale and adaptively modify the scale
            const drSize = view.getDesignResolutionSize();
            this.node.setPosition(10, 10);
            this.node.getComponent(UITransform).setContentSize(drSize.height / 10, drSize.width / 10)
        });
    }
    start() {
    }

    update(deltaTime: number) {
        
    }

    generatedCard(num: number): number{
        this.card_face = num
        return this.card_face
    }
}

