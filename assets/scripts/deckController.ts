import { _decorator, Component, Node, director, view, screen, Sprite, SpriteFrame, resources, Texture2D, UITransform} from 'cc';
import { CardController } from './cardController';
import { addComponentNoDup, MyEvent} from '../Utils'
import { SeatController } from './seatController';
const { ccclass, property } = _decorator;

@ccclass('DeckController')
export class DeckController extends Component {
    @property
    private cards: Node[];
    private handSize: number;
    private options: number[] = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8 ,8, 9, 9, 9, 9]
    private readonly normalCardNum: 36;
    // private readonly specialCardNum: 4;
    onLoad(): void {
        this.handSize = 3;
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
        this.generateCards().then((cards) => {
            this.cards = cards;
        }).catch((err) => {
            console.log(err);
        })

    }
    start() {
        
    }

    update(deltaTime: number) {
        
    }

    // /**
    //  * When MATCH begins this method is the begining of what the DECK suppose to do
    //  * @param seat The array of SEATs that this MATCH has
    //  */
    // public deckBegin(seat: Node[]): Promise<void>{
    //     this.dealCard(seat).then((seat) => {
    //         console.log(seat)
    //     }).catch((err) => {
    //         console.log(err);
    //     })
    //     return new Promise((resolve, reject) => {
    //         resolve();
    //     })
    // }

    /**
     * This this the method used to deal CARDs to every SEAT
     * @param seat The array of SEATs that this MATCH has
     * @returns 
     */
    public async dealCard(seat: Node[]): Promise<number>{
        let copy = this.cards.slice();
        let count = 0;
        for (let i = 0; i < seat.length; i++) {
            const handcards = await this.promiseDealCard(copy, i);
            // console.log(handcards)
            seat[i].getComponent(SeatController).setCard(handcards);
            count += handcards.length
        }
        return new Promise((resolve, reject) => {
            // check if the number of CARDs that has being dealed is correct
            if (copy.length !== (this.options.length - count)) {
                reject(new Error("Card number left in deck is not correct"));
            }
            console.log("done")
            resolve(count);
        });
    }
    
    private promiseDealCard(seat: Node[], i: number): Promise<Node[]>{
        const handcars: Node[] = [];
        for (let j = 0; j < this.handSize; j++){
            const index = i * this.handSize + j;
            handcars.push(this.cards[index]);
            seat.splice(index, 1);
        }
        return new Promise((resolve, reject) => {
            // check if the number of CARDs that has being dealed is correct
            resolve(handcars);
            });
        }
    

    /**
     * Generate all CARDs for the DECK, the CARDs can be modified depending on the game
     * @returns Promise<Node[]>
     */
    private async generateCards(): Promise<Node[]> {
        const cards: Node[] = [];
        const count: number = this.options.length;
        const shuffledOptions = this.shuffleArray(this.options.slice()); // Make a copy and shuffle it    
        for (const i of shuffledOptions) {
            const cardNode: Node = new Node("CARD");
            cardNode.name = "card" + String(i);
            const cardComponent: CardController = addComponentNoDup(cardNode, CardController)
            cardComponent.generatedCard(i);
            cards.push(cardNode);
            this.node.addChild(cardNode);
        }
        return await new Promise((resolve, reject) => {
            // check if the number of CARDs that has been generated is correct
            if (cards.length !== count) {
                reject(new Error("Card number is not correct"));
            }
            resolve(cards);
        });
    }
    
    /**
     * This method is used to randomly shuffle cards
     * @param array The array of all CARDs that will be occured in this game
     * @returns any[]
     */
    private shuffleArray(array: any[]): any[] {
        const shuffled = array.slice(); // Create a copy of the array
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
        }
        return shuffled;
    }

    getHandSize(): number{
        return this.handSize;
    }
}