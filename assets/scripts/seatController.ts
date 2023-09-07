import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('seatController')
export class SeatController extends Component {
    private isAI: boolean;
    private isFold: boolean;
    private isBlind: boolean;
    public hand: Node[];
    onLoad(): void{                console.log(this.hand)}
    start() {
        
        // console.log(this.hand)
    }

    update(deltaTime: number) {
        
    }
    setCard(cards: Node[]): Promise<void>{
        this.hand = cards;
        return new Promise((resolve, reject) => {
            // check if the number of CARDs that has being dealed is correct
            if (this.hand !== cards) {
                reject(new Error("Card number left in deck is not correct"));
            }
            resolve();
        });
    }
    getCards(): Node[]{
        return this.hand;
    }
}

