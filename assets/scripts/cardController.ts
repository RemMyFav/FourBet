import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('cardController')
export class CardController extends Component {
    @property
    private card_face: number;

    protected onLoad(): void {
        console.log(this.card_face);
        this._name = "card" + this.card_face;
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

