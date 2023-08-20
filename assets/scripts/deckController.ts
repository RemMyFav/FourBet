import { _decorator, Component, Node, director, view, screen, Sprite, SpriteFrame, resources, Texture2D, UITransform} from 'cc';
import { CardController } from './cardController';
import { addComponentNoDup } from '../Utils'
const { ccclass, property } = _decorator;

@ccclass('DeckController')
export class DeckController extends Component {
    @property
    private cards: CardController[];
    private options: number[] = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8 ,8, 9, 9, 9, 9]
    private readonly normalCardNum: 36;
    // private readonly specialCardNum: 4;
    protected onLoad(): void {
        this._name = "deck"
        resources.load("image/ferrule/spriteFrame", SpriteFrame, (err, spriteFrame) => {
            // Load cardback image
            let matchSprite: Sprite = addComponentNoDup(this.node, Sprite);
            matchSprite.spriteFrame = spriteFrame;
            matchSprite.type = Sprite.Type.SIMPLE;
            // Calculate the scale and adaptively modify the scale
            const drSize = view.getDesignResolutionSize();
            this.node.setPosition(0, 0);
            this.node.getComponent(UITransform).setContentSize(drSize.height / 10, drSize.width / 10)
        });
    }
    start() {
        this.generateCards((err) => {
            console.log(err);
            console.log(this.cards);
        });
    }

    update(deltaTime: number) {
        
    }
    generateCards(callback: (err: Error | null) => void): void{
        try{
            const cards: CardController[] = [];
            const count: number = this.options.length;
            for (let i = 0; i < count; i++) {
                const cardNode: Node = new Node();
                cardNode.name = "card" + String(i);
                const cardComponent: CardController = cardNode.addComponent(CardController);
                const randomIndex: number = Math.floor(Math.random() * this.options.length);
                cardComponent.generatedCard(this.options[randomIndex]);
                this.options.splice(randomIndex, 1);
                cards.push(cardComponent);
                this.node.addChild(cardNode);
            }
            this.cards = cards;
            return callback(null);
        }
        catch(err){
            return callback(err);
        }
    }
}

