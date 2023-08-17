import { _decorator, Component, Node, random, Scene } from 'cc';
import { CardController } from './cardController';
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
    }
    start() {
        
    }

    update(deltaTime: number) {
        
    }
    generateCards(): void{
        let cards: CardController[] = [];
        let count: number = this.options.length;
        for (let i = 0; i < count; i++) {
            let cardNode: Node = new Node();
            let cardComponent: CardController = cardNode.addComponent(CardController);
            let randomIndex: number = Math.floor(Math.random() * this.options.length);
            cardComponent.generatedCard(this.options[randomIndex]);
            this.options.splice(randomIndex, 1);
            cards.push(cardComponent);
        }
        this.cards = cards;
    }
}

