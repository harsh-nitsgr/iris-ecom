'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const REVIEWS = [
  {
    id: 1,
    name: 'Priya S.',
    location: 'Mumbai',
    text: "The linen dress I bought is exactly what I was looking for. Perfect fit, beautiful embroidery, and the fabric Quality is exceptional.",
    rating: 5,
  },
  {
    id: 2,
    name: 'Anita R.',
    location: 'Delhi',
    text: "I love how Iris blends modern western cuts with traditional craftsmanship. The co-ord set gets me compliments every time I wear it.",
    rating: 5,
  },
  {
    id: 3,
    name: 'Meera D.',
    location: 'Bangalore',
    text: "Fast shipping and sustainable packaging. The co-ord set is stunning, though I wish there were more color options for my size.",
    rating: 4,
  },
];

export default function CustomerReviews() {
  return (
    <section className="py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-gray-900 font-serif mb-4">Loved by you</h2>
          <p className="text-gray-500 font-light text-lg">Real experiences from our customers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden">
          {REVIEWS.map((review, index) => (
            <motion.div 
              key={review.id} 
              initial={{ opacity: 0, x: index === 0 ? -50 : index === 2 ? 50 : 0, y: index === 1 ? 50 : 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <motion.div 
                className="flex space-x-1 mb-6 text-yellow-400"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { scale: 0 },
                      visible: { scale: 1, transition: { type: "spring", stiffness: 300 } }
                    }}
                  >
                    <Star 
                      size={16} 
                      fill={i < review.rating ? 'currentColor' : 'none'} 
                      className={i >= review.rating ? 'text-gray-300' : ''} 
                    />
                  </motion.div>
                ))}
              </motion.div>
              <p className="text-gray-700 font-serif leading-relaxed italic mb-8">
                "{review.text}"
              </p>
              <div>
                <span className="block text-sm font-semibold tracking-wider text-gray-900 uppercase">
                  {review.name}
                </span>
                <span className="block text-xs text-gray-500 mt-1">
                  {review.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
