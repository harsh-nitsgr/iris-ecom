// Shared product catalog — used by listing, detail, and homepage sections
export interface ProductSize {
  size: string;
  countInStock: number;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  brand: { name: string };
  images: string[];   // First image is primary / thumbnail
  sizes: ProductSize[];
  isNew?: boolean;
  tag?: string;
}

export const PRODUCTS: Product[] = [
  {
    _id: '1',
    name: 'Hand-embroidered Linen Dress',
    price: 4500,
    category: 'Dresses',
    description:
      'A beautifully crafted western silhouette dress made from handwoven linen. Features delicate traditional Chikankari hand-embroidery along the neckline and seams. Breathable fabric, ideal for warm summer evenings or casual brunches.',
    brand: { name: 'Iris' },
    images: ['/products/prod4.jpg', '/products/prod1.jpg'],
    sizes: [
      { size: 'XS', countInStock: 2 },
      { size: 'S', countInStock: 5 },
      { size: 'M', countInStock: 0 },
      { size: 'L', countInStock: 3 },
    ],
    isNew: true,
    tag: 'New',
  },
  {
    _id: '2',
    name: 'Minimalist Cotton Co-ord',
    price: 3200,
    category: 'Co-ords',
    description:
      'A matching two-piece co-ord set in soft breathable cotton. Subtle Chikankari embroidery at the cuffs and hem adds an elegant artisan touch to this everyday modern silhouette.',
    brand: { name: 'Iris' },
    images: ['/products/prod5.jpg', '/products/prod2.jpg'],
    sizes: [
      { size: 'S', countInStock: 10 },
      { size: 'M', countInStock: 8 },
      { size: 'L', countInStock: 4 },
    ],
    isNew: false,
    tag: '',
  },
  {
    _id: '3',
    name: 'Elegant Chikankari Top',
    price: 2800,
    category: 'Tops',
    description:
      'A flowy, lightweight top with signature Chikankari embroidery across the front panel. Pair it with high-waisted trousers or denim for an effortlessly elevated look.',
    brand: { name: 'Iris' },
    images: ['/products/prod6.jpg', '/products/prod3.jpg'],
    sizes: [
      { size: 'XS', countInStock: 6 },
      { size: 'S', countInStock: 4 },
      { size: 'M', countInStock: 7 },
      { size: 'L', countInStock: 0 },
    ],
    isNew: true,
    tag: 'Bestseller',
  },
  {
    _id: '4',
    name: 'Pleated Evening Gown',
    price: 8200,
    category: 'Party Wear',
    description:
      'A showstopping evening gown featuring floor-length pleated fabric adorned with fine Chikankari floral motifs. Designed to make a statement at any occasion.',
    brand: { name: 'Iris' },
    images: ['/products/prod7.jpg', '/products/prod8.jpg'],
    sizes: [
      { size: 'S', countInStock: 2 },
      { size: 'M', countInStock: 3 },
      { size: 'L', countInStock: 1 },
    ],
    isNew: false,
    tag: '',
  },
  {
    _id: '5',
    name: 'Block Print Maxi',
    price: 5400,
    category: 'Dresses',
    description:
      'A relaxed fit maxi dress with traditional block-print patterns blended with delicate Chikankari embroidery. The perfect fusion of craft and contemporary style.',
    brand: { name: 'Iris' },
    images: ['/products/prod8.jpg', '/products/prod4.jpg'],
    sizes: [
      { size: 'S', countInStock: 5 },
      { size: 'M', countInStock: 5 },
      { size: 'L', countInStock: 3 },
      { size: 'XL', countInStock: 2 },
    ],
    isNew: false,
    tag: '',
  },
  {
    _id: '6',
    name: 'Floral Thread Kurta Set',
    price: 3900,
    category: 'Co-ords',
    description:
      'A classic Chikankari kurta set with delicate floral thread work. The set comes with a matching bottom for a coordinated look with western sensibilities.',
    brand: { name: 'Iris' },
    images: ['/products/prod9.jpg', '/products/prod5.jpg'],
    sizes: [
      { size: 'XS', countInStock: 3 },
      { size: 'S', countInStock: 6 },
      { size: 'M', countInStock: 4 },
    ],
    isNew: true,
    tag: 'New',
  },
  {
    _id: '7',
    name: 'Ivory Embroidered Midi',
    price: 5900,
    category: 'Dresses',
    description:
      'An ivory midi dress with all-over fine Chikankari embroidery. The subtle sheerness and flowing silhouette make it ideal for both day and evening occasions.',
    brand: { name: 'Iris' },
    images: ['/products/prod1.jpg', '/products/prod6.jpg'],
    sizes: [
      { size: 'XS', countInStock: 0 },
      { size: 'S', countInStock: 3 },
      { size: 'M', countInStock: 5 },
      { size: 'L', countInStock: 2 },
    ],
    isNew: true,
    tag: 'New',
  },
  {
    _id: '8',
    name: 'Structured Chikankari Top',
    price: 3100,
    category: 'Tops',
    description:
      'A semi-structured cropped top with dimensional Chikankari embroidery. Designed to be the centrepiece of any outfit — pair with palazzos or wide-leg trousers.',
    brand: { name: 'Iris' },
    images: ['/products/prod2.jpg', '/products/prod9.jpg'],
    sizes: [
      { size: 'XS', countInStock: 5 },
      { size: 'S', countInStock: 8 },
      { size: 'M', countInStock: 3 },
    ],
    isNew: false,
    tag: '',
  },
  {
    _id: '9',
    name: 'Heritage Wrap Dress',
    price: 6700,
    category: 'Dresses',
    description:
      'A timeless wrap-style dress inspired by mughal art heritage. Dense floral Chikankari embroidery frames the waist and hem. A collector-worthy piece.',
    brand: { name: 'Iris' },
    images: ['/products/prod3.jpg', '/products/prod7.jpg'],
    sizes: [
      { size: 'S', countInStock: 4 },
      { size: 'M', countInStock: 4 },
      { size: 'L', countInStock: 3 },
      { size: 'XL', countInStock: 1 },
    ],
    isNew: false,
    tag: 'Bestseller',
  },
];
