import { Container, Sprite, Text, TextStyle, Graphics } from 'pixi.js';
import gsap from 'gsap';

export class PixiCard extends Container {
  private bg: Graphics;
  private image: Sprite;
  private costText: Text;
  private valueText: Text;
  private nameText: Text;

  constructor(public id: number, public cardData: any) {
    super();

    // Background
    this.bg = new Graphics();
    this.bg.roundRect(0, 0, 180, 250, 12);
    this.bg.fill({ color: 0x1e293b }); // slate-800
    this.bg.stroke({ color: cardData.type === 'attack' ? 0xef4444 : cardData.type === 'defend' ? 0x3b82f6 : 0xa855f7, width: 4 });
    this.addChild(this.bg);

    // Image
    let aliasStr = cardData.name.toLowerCase().replace(' ', '');
    if (aliasStr === 'darkbible') aliasStr = 'darkBible';
    if (aliasStr === 'tropicalfruit') aliasStr = 'tropicalFruit';
    const imgAlias = `card_${aliasStr}`;

    try {
      this.image = Sprite.from(imgAlias);
      this.image.width = 160;
      this.image.height = 140;
      this.image.x = 10;
      this.image.y = 30;
      this.addChild(this.image);
    } catch (e) {
      console.warn('Missing asset:', imgAlias);
    }

    // Cost
    const textStyle = new TextStyle({ fill: '#ffffff', fontSize: 18, fontWeight: 'bold' });
    this.costText = new Text({ text: `${cardData.cost} MP`, style: textStyle });
    this.costText.x = 10;
    this.costText.y = 5;
    this.addChild(this.costText);

    // Value
    this.valueText = new Text({ text: `${cardData.value}`, style: textStyle });
    this.valueText.x = 150;
    this.valueText.y = 5;
    this.addChild(this.valueText);

    // Name
    this.nameText = new Text({ text: cardData.name, style: { fill: '#ffffff', fontSize: 16 } });
    this.nameText.x = 10;
    this.nameText.y = 180;
    this.addChild(this.nameText);
    
    this.pivot.set(90, 125);
  }

  public animateDraw(delay: number) {
    this.y += 200;
    this.scale.set(0.8);
    this.alpha = 0;
    gsap.to(this, { y: this.y - 200, alpha: 1, duration: 0.48, delay, ease: 'back.out(1.7)' });
    gsap.to(this.scale, { x: 1, y: 1, duration: 0.48, delay, ease: 'back.out(1.7)' });
  }

  public animateDiscard(delay: number) {
    gsap.to(this, { y: this.y - 200, alpha: 0, duration: 0.42, delay, ease: 'power2.in' });
  }
}
