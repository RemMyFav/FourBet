import { _decorator, Component, Node, director, view, screen, Sprite, SpriteFrame, resources, Texture2D, UITransform, Event} from 'cc';
import { PlayerController } from './playerController';
import { DeckController } from './deckController';
import { addComponentNoDup, MyEvent, Pair, ThreeKind, Flush, HighCard, HandType } from '../Utils'
import { SeatController } from './seatController';
import { CardController } from './cardController'
const { ccclass, property } = _decorator;

@ccclass('matchController')
export class matchController extends Component {
    // @property
    // private winner: playerController;
    // @property
    // private players: [playerController, playerController, playerController, playerController, playerController, playerController];
    // private _blind: playerController;
    // private _pool: number;
    // private _progress: Progress;
    private deck: Node;
    private seats: Node[];
    private seatNum: number = 6;
    onLoad(): void {
        this._name = "match";
        // this.node.name = "MATCH";
        /** 
         * Add a sprite component to matchNode and set the sprite.spriteFrame to image bg.png as background
         * Adaptively modify the background scale to make sure the background image covers the whole visable area
         * https://blog.csdn.net/qq_26069551/article/details/129813471
        */
        resources.load("image/bg/spriteFrame", SpriteFrame, (err, spriteFrame) => {
            // Load background image
            let matchSprite: Sprite = addComponentNoDup(this.node, Sprite);
            matchSprite.spriteFrame = spriteFrame;
            matchSprite.type = Sprite.Type.SIMPLE;
            // Calculate the scale and adaptively modify the scale
            const drSize = view.getDesignResolutionSize();
            const bgSize = this.node.getComponent(UITransform).contentSize;
            const widthAdaptScale = drSize.width/bgSize.width;
            const heightAdaptScale = drSize.height/bgSize.height;
            const adaptScale = widthAdaptScale > heightAdaptScale ? widthAdaptScale : heightAdaptScale;
            this.node.setScale(adaptScale, adaptScale);
        });
        // When the MATCH begins generate one DECK for it
        this.generateDeck().then((deck)=>{
        }).catch((err) => {
            console.log(err);
        })
        // When the MATCH begins generate SEATs for it
        this.generateSeat().then((seat)=>{
            // console.log(seat)
            this.seats = seat;
        }).catch((err) => {
            console.log(err);
        })
    }

    start() {
        this.begin(this.seats).then(()=>{
            this.winner(this.seats)
        }).catch((err) => {
            console.log(err);
        })
    }

    update(deltaTime: number) {
        
    }

    /**
     * After all element in the game is generated, the game shall begins
     * the first step is to deal card
     * @returns Promise<void>
     */
    private async begin(seats: Node[]): Promise<void>{
        this.deck.getComponent(DeckController).deckBegin(seats);
        return await new Promise((reslove, reject) =>{
            reslove();
        })
    }
    
    /**
     * Given an array of SEATS which has the attribute CARDS, find which
     * SEAT wins the MATCH. Return it
     * @param seats 
     * @returns Promise<Node>
     */
    // private async winner(seats: Node[]): Promise<Node[]>{
    //     let handTypes: HandType[] = [];
    //     let ordering : HandType[] = [];
    //     let winner: Node[] = [];
    //     seats.forEach((seat) => {
    //         this.cardValArray(seat).then((cardsArray) => {
    //             this.getType(cardsArray).then((handType) =>{
    //                 handTypes.push(handType);
    //             })
    //         });
    //     })
    //     console.log(handTypes);
    //     handTypes.forEach((handtype) =>{
    //         if(ordering.length === 0){
    //             ordering.push(handtype);
    //         }
    //         else{
    //             for(let i = 0; i < ordering.length; i++){
    //                 if(ordering[i].level < handtype.level){
    //                     ordering.splice(i, 0, handtype);
    //                     break;
    //                 }
    //                 else if(ordering[i].level === handtype.level){
    //                     if(ordering[i].val < handtype.val){
    //                         ordering.splice(i, 0, handtype);
    //                         break;
    //                     }
    //                     else if(ordering[i].val === handtype.val){
    //                         ordering.splice(i, 0, handtype);
    //                         break;
    //                     }
    //                     else{
    //                         ordering.splice(i + 1, 0, handtype);
    //                         break;
    //                     }
    //                 }
    //                 else{
    //                     ordering.splice(i + 1, 0, handtype);
    //                     break;
    //                 }
    //             }
    //         }
    //     })
    //     console.log(ordering);
    //     const biggest: HandType = ordering[0];
    //     handTypes.forEach((handType) =>{
    //         if(handType.level === biggest.level && handType.type === biggest.type && handType.val === biggest.val){
    //             winner.push(seats[handTypes.indexOf(handType)]);
    //         }
    //     });
    //     return await new Promise((reslove, reject) =>{
    //         reslove(winner);
    //     })
    // }
    private async winner(seats: Node[]): Promise<Node[]>{
        let winner: Node[] = [];
        this.getHandTypes(seats).then((htArray) => {
            this.order(htArray);
        })
        // this.getHandTypes(seats).then((handTypes) =>{
        //     this.order(handTypes)
        //     .then((order) =>{
        //         console.log(order)
        //         const biggest: HandType = order[0];
        //         // handTypes.forEach((handType) =>{
        //         //     if(handType.level === biggest.level && handType.type === biggest.type && handType.val === biggest.val){
        //         //         winner.push(seats[handTypes.indexOf(handType)]);
        //         //     }
        //         // });
        //     })})

        
        return await new Promise((reslove, reject) =>{
            reslove(winner);
        })
    }
    
    private async order(ht1: HandType[]): Promise<HandType[]>{

        console.log(ht1)
        console.log(ht1[0])
        let ordering: HandType[] = [];
        // handTypes.forEach((ht) =>{console.log(ht)})
        // handTypes.forEach((handtype) =>{
        //     console.log(handtype);
        //     if(ordering.length === 0){
        //         console.log(ordering.length)
        //         ordering.push(handtype);
        //     }
        //     else{
        //         for(let i = 0; i < ordering.length; i++){
        //             if(ordering[i].level < handtype.level){
        //                 ordering.splice(i, 0, handtype);
        //                 break;
        //             }
        //             else if(ordering[i].level === handtype.level){
        //                 if(ordering[i].val < handtype.val){
        //                     ordering.splice(i, 0, handtype);
        //                     break;
        //                 }
        //                 else if(ordering[i].val === handtype.val){
        //                     ordering.splice(i, 0, handtype);
        //                     break;
        //                 }
        //                 else{
        //                     ordering.splice(i + 1, 0, handtype);
        //                     break;
        //                 }
        //             }
        //             else{
        //                 ordering.splice(i + 1, 0, handtype);
        //                 break;
        //             }
        //         }
        //     }
        // })
        return await new Promise((reslove, reject) =>{
            reslove(ordering);
        })
    }

    private async getHandTypes(seats: Node[]): Promise<HandType[]>{
        let handTypes: HandType[] = [];
        seats.forEach((seat) => {
            this.cardValArray(seat).then((cardsArray) => {
                console.log(cardsArray)
                this.getType(cardsArray).then((handType) =>{
                    console.log(handType)
                    handTypes.push(handType);
                })
            });
        })
        return await new Promise((reslove, reject) =>{
            reslove(handTypes);
        })
    }

    private async getType(cardsArray: number[]): Promise<HandType>{
        // const cardMap: Map<number, number> = await this.cardsArrayToMap(cardsArray);
        return await this.cardsArrayToMap(cardsArray).then(async (cardMap) =>{
            const threeKindOrPair: HandType = this.isThreeKindOrPair(cardMap);
            if(threeKindOrPair){
                return await new Promise((reslove, reject) =>{
                    // check if the DECK node is successfully generated
                    if(threeKindOrPair.val === 0){
                        reject(new Error("ThreeKindOrPair generate Failed"))
                    }
                    reslove(threeKindOrPair);
                })
            }
            const flush: HandType = this.isFlush(cardMap);
            if(flush){
                return await new Promise((reslove, reject) =>{
                    // check if the DECK node is successfully generated
                    if(flush.val === 0 || flush.val > 8){
                        reject(new Error("Flush generate Failed"))
                    }
                    reslove(threeKindOrPair);
                })
            }
            const highCard = new HighCard();
            highCard.val = Math.max(...cardsArray);
            return await new Promise((reslove, reject) =>{
                // check if the DECK node is successfully generated
                if(highCard.val === 0){
                    reject(new Error("HighCard generate Failed"))
                }
                reslove(highCard);
            })
        })
    }
    
    // private async getType(cardsArray: number[]): Promise<HandType>{
    //     const cardMap: Map<number, number> = await this.cardsArrayToMap(cardsArray);
    //     const threeKindOrPair: HandType = this.isThreeKindOrPair(cardMap);
    //     const flush: HandType = this.isFlush(cardMap);
    //     if(threeKindOrPair){
    //         return await new Promise((reslove, reject) =>{
    //             // check if the DECK node is successfully generated
    //             if(threeKindOrPair.val === 0){
    //                 reject(new Error("ThreeKindOrPair generate Failed"))
    //             }
    //             reslove(threeKindOrPair);
    //         })
    //     }
    //     else if(flush){
    //         return await new Promise((reslove, reject) =>{
    //             // check if the DECK node is successfully generated
    //             if(flush.val === 0 || flush.val > 8){
    //                 reject(new Error("Flush generate Failed"))
    //             }
    //             reslove(threeKindOrPair);
    //         })
    //     }
    //     const highCard = new HighCard();
    //     highCard.val = Math.max(...cardsArray);
    //     return await new Promise((reslove, reject) =>{
    //         // check if the DECK node is successfully generated
    //         if(highCard.val === 0){
    //             reject(new Error("HighCard generate Failed"))
    //         }
    //         reslove(highCard);
    //     })
    // }

    // private async getType(cardsArray: number[]): Promise<HandType> {
    //     const cardMap: Map<number, number> = await this.cardsArrayToMap(cardsArray);
    //     const threeKindOrPair: HandType = this.isThreeKindOrPair(cardMap);
    //     const flush: HandType = this.isFlush(cardMap);
    
    //     if (threeKindOrPair && threeKindOrPair.val === 0) {
    //         throw new Error("ThreeKindOrPair generate Failed");
    //     } else if (flush && (flush.val === 0 || flush.val > 8)) {
    //         throw new Error("Flush generate Failed");
    //     }
    
    //     const highCard = new HighCard();
    //     highCard.val = Math.max(...cardsArray);
    
    //     if (highCard.val === 0) {
    //         throw new Error("HighCard generate Failed");
    //     }
    
    //     return threeKindOrPair || flush || highCard;
    // }
    
    private async cardsArrayToMap(cardsArray: number[]): Promise<Map<number, number>>{
        console.log(cardsArray);
        const result = new Map();
        let total: number = 0;
        cardsArray.forEach(cardFace =>{
            if(!result.has(cardFace)){
                result.set(cardFace, 1);
                total += 1;
            }
            else{
                result.set(cardFace, result.get(cardFace) + 1);
                total += 1;
            }
        })
        return await new Promise((reslove, reject) =>{
            console.log(result);
            if(total !== this.deck.getComponent(DeckController).getHandSize()){
                reject(new Error("Hand size does not match"));
            }
            reslove(result);
        }
    )};
    
    private isThreeKindOrPair(cardsMap: Map<number, number>): null | HandType{
        let result: HandType;
        cardsMap.forEach((cardFace, num) =>{
            if(num === 3){
                result = new ThreeKind();
                result.val = cardFace;
                return result
            }
            else if(num === 2){
                result = new Pair();
                result.val = cardFace;
                return result
            }
        })
        return null;
    }

    private isFlush(cardsMap: Map<number, number>): null | HandType{
        let result: HandType;
        cardsMap.forEach((cardFace, num) =>{
            if(num === 1){
                const nextOneCard: number = cardFace + 1;
                const nextTwoCard: number = cardFace + 2;
                if(cardsMap.has(nextOneCard) && cardsMap.has(nextTwoCard)){
                    result = new Flush();
                    result.val = cardFace;
                    return result
                }
            }
        })
        return null;
    }


    private async cardValArray(seat: Node): Promise<number[]>{
        const cards: Node[] = seat.getComponent(SeatController).getCards();
        let result: number[] = [];
        cards.forEach(cardNode =>{
            result.push(cardNode.getComponent(CardController).getCardFace());
        })
        return await new Promise((reslove, reject) =>{
            if(result.length !== this.deck.getComponent(DeckController).getHandSize()){
                reject(new Error("Hand size does not match"));
            }
            reslove(result);
        }
    )};

    /**
     * Generate SEATs for this MATCH the number of SEATs depending on the max number of
     * player that one round could be SEATs could be taken by an AI or real player
     * @returns Promise<Node[]>
     */
    private async generateSeat(): Promise<Node[]>{
        const seats: Node[] = [];
        for(let i = 0; i < this.seatNum; i++){
            const seatNode: Node = new Node("SEAT");
            const seatComponent: SeatController= addComponentNoDup(seatNode, SeatController);
            this.node.addChild(seatNode);
            seats.push(seatNode);
        }
        return await new Promise((reslove, reject) =>{
            //check if there are correct number of SEATs are being generated
            if(this.node.getComponentsInChildren(SeatController).length !== this.seatNum){
                reject(new Error("Generate SEAT node Failed"));
            }
            reslove(seats);
        }
    )};
    
    /**
     * Generate the only DECK for this MATCH this DECK contains
     * all the CARDs will be shown in the game and has the method
     * to deal card.
     * @returns Promise<void> 
     */
    async generateDeck(): Promise<void>{
        const deckNode: Node = new Node("DECK");
        const drSize = view.getDesignResolutionSize();
        deckNode.setPosition(drSize.width/ 2, drSize.height / 2);
        const deckComponent: DeckController = addComponentNoDup(deckNode, DeckController);
        this.node.addChild(deckNode)
        this.deck = deckNode;
        return await new Promise((reslove, reject) =>{
            // check if the DECK node is successfully generated
            if(!this.node.getChildByName("DECK")){
                reject(new Error("Generate DECK node Failed"))
            }
            reslove();
        })
    }
}

