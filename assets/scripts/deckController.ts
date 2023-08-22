import { _decorator, Component, Node, director, view, screen, Sprite, SpriteFrame, resources, Texture2D, UITransform} from 'cc';
import { CardController } from './cardController';
import { addComponentNoDup } from '../Utils'
import { SeatController } from './seatController';
const { ccclass, property } = _decorator;

@ccclass('DeckController')
export class DeckController extends Component {
    @property
    private cards: Node[];
    private options: number[] = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8 ,8, 9, 9, 9, 9]
    private readonly normalCardNum: 36;
    // private readonly specialCardNum: 4;
    protected onLoad(): void {
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
        // When DECK is generated also generate CARD for it
        this.generateCards((err) => {
            console.log(err);
            console.log(this.cards);
        });

    }
    start() {
        
    }

    update(deltaTime: number) {
        
    }
    
    dealCard(seat: Node[], callback: (err: Error | null) => void): void{
        try{
            for (let i = 0; i < seat.length; i++) {
                const handcars: Node[] = [];
                for (let j = 0; j < 3; j++){
                    const randomIndex: number = Math.floor(Math.random() * this.cards.length);
                    handcars.push(this.cards[randomIndex]);
                    this.cards = this.cards.splice(randomIndex, randomIndex + 1);
                }
                seat[i].getComponent(SeatController).getCard(handcars, (err) =>{
                    return callback(err);
                });
            }
        }
        catch(err){
            console.log(err)
            callback(err);
        }
    }
    generateCards(callback: (err: Error | null) => void): void{
        try{
            const cards: Node[] = [];
            const count: number = this.options.length;
            for (let i = 0; i < count; i++) {
                console.log(i);
                const cardNode: Node = new Node("CARD");
                cardNode.name = "card" + String(i);
                const cardComponent: CardController = cardNode.addComponent(CardController);
                let randomIndex: number = Math.floor(Math.random() * this.options.length);
                cardComponent.generatedCard(this.options[randomIndex]);
                this.options = this.options.splice(randomIndex, randomIndex + 1);
                this.cards.push(cardNode);
                console.log(cards);
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

