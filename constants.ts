

import { Product } from './types';
import { SHILAJIT_IMAGE_URL } from './assets';

export const HERO_SLIDES = [
  {
    imageUrl: 'https://picsum.photos/id/10/1800/800',
    title: 'Discover the Power of Shilajit',
    subtitle: 'Harvested from the pristine Himalayan peaks for ultimate purity and potency.',
    buttonText: 'Explore Shilajit',
  },
  {
    imageUrl: 'https://picsum.photos/id/1015/1800/800',
    title: 'Pure, Cold-Pressed Organic Oils',
    subtitle: 'Nourish your body from the inside out with our range of natural oils.',
    buttonText: 'Shop Oils',
  },
  {
    imageUrl: 'https://picsum.photos/id/1080/1800/800',
    title: 'Sun-Kissed Dry Fruits & Nuts',
    subtitle: 'A healthy, delicious snack packed with energy and nutrients.',
    buttonText: 'Discover Snacks',
  },
  {
    imageUrl: 'https://picsum.photos/id/219/1800/800',
    title: 'Join The Organic Movement',
    subtitle: 'Experience nature\'s finest, delivered right to your doorstep.',
    buttonText: 'Shop All Products',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Premium Shilajit Resin',
    category: 'Supplements',
    price: 2499,
    originalPrice: 3500,
    rating: 5,
    imageUrl: SHILAJIT_IMAGE_URL,
    imageUrls: [SHILAJIT_IMAGE_URL, 'https://picsum.photos/id/1018/800/800', 'https://picsum.photos/id/1074/800/800', 'https://picsum.photos/id/103/800/800'],
    description: 'Harvested from the highest altitudes of the Himalayas, our Premium Shilajit Resin is a potent and pure mineral pitch. It is known for its rejuvenating properties and has been used in Ayurvedic medicine for centuries. This natural substance is rich in fulvic acid and over 84 minerals, offering a wide range of health benefits.',
    benefits: ['Boosts energy and stamina', 'Enhances cognitive function', 'Supports immune system', 'Promotes healthy aging'],
  },
  {
    id: 2,
    name: 'Organic Face Scrub',
    category: 'Skincare',
    price: 1999,
    originalPrice: 2700,
    rating: 4,
    imageUrl: 'https://picsum.photos/id/106/400/400',
    imageUrls: ['https://picsum.photos/id/106/800/800', 'https://picsum.photos/id/379/800/800', 'https://picsum.photos/id/1080/800/800', 'https://picsum.photos/id/219/800/800'],
    description: 'Gently exfoliate and revitalize your skin with our Organic Face Scrub. Made with finely ground apricot shells, soothing aloe vera, and nourishing essential oils, this scrub removes dead skin cells, unclogs pores, and leaves your face feeling soft, smooth, and radiant.',
    benefits: ['Removes dead skin cells', 'Brightens complexion', 'Unclogs pores', 'Nourishes and moisturizes'],
  },
  {
    id: 3,
    name: 'Natural Extracted Edible Oil',
    category: 'Groceries',
    price: 25,
    originalPrice: 34,
    rating: 4,
    imageUrl: 'https://picsum.photos/id/431/400/400',
    imageUrls: ['https://picsum.photos/id/431/800/800', 'https://picsum.photos/id/292/800/800', 'https://picsum.photos/id/494/800/800', 'https://picsum.photos/id/1043/800/800'],
    description: 'Our Natural Extracted Edible Oil is cold-pressed from the finest quality seeds, ensuring that it retains all its natural nutrients and flavor. Perfect for cooking, baking, or as a dressing, it is a healthy addition to any kitchen.',
    benefits: ['Rich in healthy fats', 'High in antioxidants', 'Retains natural nutrients', 'Versatile for all cooking needs'],
  },
  {
    id: 4,
    name: 'Assorted Organic Coffee',
    category: 'Groceries',
    price: 35,
    rating: 5,
    imageUrl: 'https://picsum.photos/id/312/400/400',
    imageUrls: ['https://picsum.photos/id/312/800/800', 'https://picsum.photos/id/225/800/800', 'https://picsum.photos/id/1060/800/800', 'https://picsum.photos/id/1025/800/800'],
    description: 'Start your day with our rich and aromatic Assorted Organic Coffee. Sourced from fair-trade farms, these beans are carefully roasted to perfection to bring out their unique flavor profiles. This pack includes a variety of blends to suit every coffee lover.',
    benefits: ['Rich, full-bodied flavor', 'Sustainably and ethically sourced', 'Certified organic beans', 'Boosts mental alertness'],
  },
  {
    id: 5,
    name: 'Sun-Dried Apricots',
    category: 'Dry Fruits',
    price: 599,
    originalPrice: 950,
    rating: 5,
    imageUrl: 'https://picsum.photos/id/69/400/400',
    imageUrls: ['https://picsum.photos/id/69/800/800', 'https://picsum.photos/id/788/800/800', 'https://picsum.photos/id/1080/800/800', 'https://picsum.photos/id/832/800/800'],
    description: 'Enjoy the sweet, natural taste of our Sun-Dried Apricots. These succulent fruits are dried naturally without any added sugars or preservatives. They are a great source of fiber, vitamins, and minerals, making for a perfect healthy snack.',
    benefits: ['High in fiber and vitamins', 'Natural energy booster', 'No added sugar or preservatives', 'Supports digestive health'],
  },
  {
    id: 6,
    name: 'Himalayan Pink Salt',
    category: 'Groceries',
    price: 150,
    rating: 4,
    imageUrl: 'https://picsum.photos/id/1021/400/400',
    imageUrls: ['https://picsum.photos/id/1021/800/800', 'https://picsum.photos/id/106/800/800', 'https://picsum.photos/id/28/800/800', 'https://picsum.photos/id/16/800/800'],
    description: 'Mined from ancient sea salt deposits in the Himalayan mountains, our pink salt is unrefined and free from additives. Its rich mineral content gives it a unique flavor and beautiful pink hue. A healthy alternative to regular table salt.',
    benefits: ['Contains over 84 trace minerals', 'Balances body’s pH levels', 'Improves hydration', 'Natural and unrefined'],
  },
  {
    id: 7,
    name: 'Cold-Pressed Almond Oil',
    category: 'Oils',
    price: 899,
    rating: 5,
    imageUrl: 'https://picsum.photos/id/102/400/400',
    imageUrls: ['https://picsum.photos/id/102/800/800', 'https://picsum.photos/id/431/800/800', 'https://picsum.photos/id/219/800/800', 'https://picsum.photos/id/1043/800/800'],
    description: 'Our Cold-Pressed Almond Oil is a versatile oil that can be used for skin, hair, and cooking. It is rich in Vitamin E and antioxidants, making it an excellent moisturizer for skin and a nourishing treatment for hair. Its light, nutty flavor also makes it great for salads.',
    benefits: ['Excellent for skin and hair', 'Rich in Vitamin E', 'Supports heart health', 'Light and nutty flavor'],
  },
  {
    id: 8,
    name: 'Organic Walnuts',
    category: 'Dry Fruits',
    price: 750,
    originalPrice: 1000,
    rating: 4,
    imageUrl: 'https://picsum.photos/id/788/400/400',
    imageUrls: ['https://picsum.photos/id/788/800/800', 'https://picsum.photos/id/495/800/800', 'https://picsum.photos/id/1015/800/800', 'https://picsum.photos/id/832/800/800'],
    description: 'Packed with omega-3 fatty acids, antioxidants, and protein, our Organic Walnuts are a true superfood. Sourced from organic farms, these walnuts have a crisp, buttery flavor that is perfect for snacking, baking, or adding to your favorite dishes.',
    benefits: ['Excellent source of Omega-3s', 'Rich in antioxidants', 'Supports brain health', 'Great for heart health'],
  },
];

export const FAQS = [
  {
    id: 1,
    question: "What is Shilajit and what are its primary benefits?",
    answer: "Shilajit is a natural, tar-like substance found in the Himalayan mountains. It's rich in fulvic acid and over 84 minerals. Its primary benefits include boosting energy and stamina, enhancing cognitive function, supporting the immune system, and promoting healthy aging by providing the body with essential nutrients."
  },
  {
    id: 2,
    question: "Are your products certified organic?",
    answer: "Yes, all our products are sourced from certified organic farms and suppliers who adhere to strict sustainable and ethical practices. We are committed to providing 100% natural and pure products, free from pesticides, herbicides, and harmful chemicals."
  },
  {
    id: 3,
    question: "Where do you source your products from?",
    answer: "Our flagship products, like Shilajit and Himalayan Pink Salt, are sourced directly from the pristine, high-altitude regions of Skardu, Gilgit-Baltistan. Other organic items are sourced from trusted local farmers who share our commitment to quality and sustainability."
  },
  {
    id: 4,
    question: "What is your shipping policy?",
    answer: "We offer free shipping on all orders over Rs 2000 within Pakistan. For orders below this amount, a standard shipping fee is applied. Orders are typically processed within 1-2 business days and delivered within 5-7 business days."
  },
  {
    id: 5,
    question: "How should I store the products to maintain freshness?",
    answer: "For our Shilajit resin, we recommend storing it in a cool, dark place away from direct sunlight. Dry fruits and nuts should be kept in an airtight container in a cool, dry place. Our organic oils should also be stored away from heat and light to preserve their potency."
  },
  {
    id: 6,
    question: "What is your return policy?",
    answer: "We have a 14-day return policy for unopened and unused products. If you are not satisfied with your purchase, please contact our customer support with your order details to initiate a return. For more details, you can visit our Refund Policy page."
  },
];
