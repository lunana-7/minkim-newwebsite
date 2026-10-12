# Dessert shop careers

## Enter a workplace

Cloud Scoop and Honeycrumb have walk-in doors on the Berry Market trail. Coco and Honey stand beside their shops. Stand in front of a door and press **Enter** to walk inside; the toolbar can take you directly to either workplace. The workbench, orders, and job application appear inside that shop. **Back to the world** returns Mini to that shop's door. Click **Apply for the job**, then **Start customer order**. Ingredients and equipment are provided free.

## Make an order

Follow the customer ticket. Pick one of three measured bases, vanilla/strawberry/chocolate flavor, and cherry with cream/cookies/sprinkles.

1. Choose and pour measured ingredients.
2. Whisk ice cream base or fold cake batter six times. Use the action button or click the pixel workbench.
3. Set the machine temperature. Churning takes eight seconds; baking takes ten. The ideal game settings are −6°C and 175°C. Wait for the bar, then finish processing.
4. Add three scoops or pipe three layers of cream. Choose a topping before the final decoration action.
5. Serve once to earn farm coins, general points and career XP. Level increases every 100 career XP. The next ticket rotates to a new flavor and topping.

The generated interior artwork shows separate ice cream and bakery rooms. The workstation uses generated bowls, tools, machines, cones and cakes; Mini wears the player's saved appearance. These are game recipes and compressed preparation times, not a real cooking tutorial.

Quality combines recipe/order accuracy (60%) and machine setting (40%). Wages are 12 plus 25% of quality rounded to coins; XP is 10 plus 15%. Each career stores hired status, completed orders, XP and best score. Current order stage, ingredients, mixing count, decorating count, temperature and process start timestamp are persisted in profile schema 8. An unfinished order must be finished or discarded before starting work at the other shop. Discarding gives no reward. Guest saves use the existing browser player profile; cloud schema rules are prepared but not deployed while Firebase setup awaits terms approval.

Shop scenes and tools are generated bitmap assets registered in `public/game-art/items/manifest.json`. The original atlases and prompts are under `artwork/mini/items/`. Source code is included in the scoped MIT game archive; artwork remains separately licensed.
