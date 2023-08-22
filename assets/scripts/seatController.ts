import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('seatController')
export class SeatController extends Component {
    private isAI: boolean;
    private isFold: boolean;
    private isBlind: boolean;
    private hand: Node[];
    start() {
        console.log(this.hand)
    }

    update(deltaTime: number) {
        
    }
    getCard(cards: Node[], callback: (err: Error | null) => void): void{
        this.hand = cards;
    }
    
}

