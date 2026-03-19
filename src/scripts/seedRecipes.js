import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'
import { Recipe } from '../models/recipes.model.js'

dotenv.config({ path: './.env' })

const recipes = [
  {
    title: 'Classic Avocado Toast',
    description: 'A quick, healthy breakfast packed with healthy fats and fibre.',
    image: { url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600', public_id: '' },
    ingredients: ['2 slices whole grain bread', '1 ripe avocado', 'Red pepper flakes', 'Sea salt', '1 lemon wedge'],
    process: ['Toast the bread until golden brown.', 'Mash avocado with lemon juice and salt.', 'Spread over toast.', 'Garnish with red pepper flakes.'],
    calories: 280,
    macros: { protein: '8g', carbs: '24g', fats: '18g' },
    category: 'Breakfast'
  },
  {
    title: 'Grilled Chicken Salad',
    description: 'High-protein salad perfect for a post-workout lunch.',
    image: { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', public_id: '' },
    ingredients: ['200g chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil dressing'],
    process: ['Season and grill chicken for 6 mins each side.', 'Slice and place over greens.', 'Add vegetables and drizzle dressing.'],
    calories: 450,
    macros: { protein: '35g', carbs: '12g', fats: '20g' },
    category: 'Lunch'
  },
  {
    title: 'Overnight Oats',
    description: 'Prep the night before for a hassle-free nutritious breakfast.',
    image: { url: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600', public_id: '' },
    ingredients: ['80g rolled oats', '200ml milk', '1 tbsp chia seeds', 'Banana', 'Honey'],
    process: ['Mix oats, milk and chia seeds.', 'Refrigerate overnight.', 'Top with sliced banana and honey.'],
    calories: 380,
    macros: { protein: '12g', carbs: '60g', fats: '8g' },
    category: 'Breakfast'
  },
  {
    title: 'Salmon with Quinoa',
    description: 'Omega-3 rich dinner that supports muscle recovery.',
    image: { url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', public_id: '' },
    ingredients: ['180g salmon fillet', '100g quinoa', 'Broccoli', 'Garlic', 'Lemon juice'],
    process: ['Cook quinoa per packet instructions.', 'Pan-sear salmon 4 mins each side.', 'Steam broccoli.', 'Plate and finish with lemon juice.'],
    calories: 520,
    macros: { protein: '40g', carbs: '38g', fats: '18g' },
    category: 'Dinner'
  },
  {
    title: 'Protein Smoothie',
    description: 'Quick post-workout recovery shake.',
    image: { url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600', public_id: '' },
    ingredients: ['1 scoop whey protein', '1 banana', '200ml almond milk', '1 tbsp peanut butter', 'Ice'],
    process: ['Add all ingredients to blender.', 'Blend until smooth.', 'Serve immediately.'],
    calories: 320,
    macros: { protein: '30g', carbs: '32g', fats: '8g' },
    category: 'Snack'
  },
  {
    title: 'Egg White Omelette',
    description: 'Light, high-protein breakfast for fat-loss phases.',
    image: { url: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600', public_id: '' },
    ingredients: ['4 egg whites', 'Spinach', 'Mushrooms', 'Salt & pepper', 'Olive oil spray'],
    process: ['Whisk egg whites with seasoning.', 'Sauté vegetables.', 'Pour eggs over veg, fold when set.'],
    calories: 160,
    macros: { protein: '22g', carbs: '4g', fats: '4g' },
    category: 'Breakfast'
  },
  {
    title: 'Turkey & Rice Bowl',
    description: 'Lean protein with complex carbs — ideal bulking meal.',
    image: { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600', public_id: '' },
    ingredients: ['200g ground turkey', '150g brown rice', 'Bell pepper', 'Onion', 'Soy sauce'],
    process: ['Cook rice.', 'Brown turkey with onion and pepper.', 'Season with soy sauce.', 'Serve turkey over rice.'],
    calories: 490,
    macros: { protein: '38g', carbs: '52g', fats: '10g' },
    category: 'Lunch'
  },
  {
    title: 'Greek Yoghurt Parfait',
    description: 'A protein-rich snack ready in 2 minutes.',
    image: { url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600', public_id: '' },
    ingredients: ['200g Greek yoghurt', 'Mixed berries', 'Granola', 'Honey'],
    process: ['Layer yoghurt in a glass.', 'Top with berries.', 'Add granola and drizzle honey.'],
    calories: 270,
    macros: { protein: '18g', carbs: '34g', fats: '5g' },
    category: 'Snack'
  },
  {
    title: 'Chickpea Stir-Fry',
    description: 'Plant-based dinner loaded with fibre and protein.',
    image: { url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600', public_id: '' },
    ingredients: ['400g canned chickpeas', 'Spinach', 'Tomatoes', 'Cumin', 'Olive oil'],
    process: ['Heat oil, add cumin.', 'Add chickpeas and tomatoes, cook 5 mins.', 'Stir in spinach until wilted.'],
    calories: 360,
    macros: { protein: '16g', carbs: '48g', fats: '10g' },
    category: 'Dinner'
  },
  {
    title: 'Cottage Cheese Bowl',
    description: 'Simple high-protein snack perfect before bed.',
    image: { url: 'https://images.unsplash.com/photo-1571167530149-c1105da4c2e9?w=600', public_id: '' },
    ingredients: ['200g low-fat cottage cheese', 'Pineapple chunks', 'Flax seeds', 'Cinnamon'],
    process: ['Scoop cottage cheese into bowl.', 'Add pineapple.', 'Sprinkle flax seeds and cinnamon.'],
    calories: 210,
    macros: { protein: '24g', carbs: '18g', fats: '4g' },
    category: 'Snack'
  },
]

async function seed() {
  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
  await Recipe.deleteMany({})
  await Recipe.insertMany(recipes)
  console.log(`✅  Seeded ${recipes.length} recipes`)
  await mongoose.disconnect()
}

seed().catch((e) => { console.error(e); process.exit(1) })
