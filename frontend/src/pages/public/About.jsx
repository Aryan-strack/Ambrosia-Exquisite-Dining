import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaAward, FaLeaf, FaUsers } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-brand-gray overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 bg-brand-black overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 transform scale-110">
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Restaurant Detail"
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0, tracking: '0em' }}
            animate={{ opacity: 1, tracking: '0.4em' }}
            className="text-brand-gold uppercase text-sm font-bold mb-4 block"
          >
            Est. 1995
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
          >
            Our <span className="text-brand-gold italic">Legacy</span>
          </motion.h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed">
            A journey of passion, flavors, and the relentless pursuit of culinary perfection.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-display font-bold text-brand-black mb-8 relative">
              Our Story
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-brand-gold"></span>
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>
                Founded in the heart of the city, <span className="text-brand-gold font-bold">Ambrosia</span> began as a small family-run bistro with a single vision: to serve food that nourishes the soul.
              </p>
              <p>
                Over the decades, we have evolved into a sanctuary for food lovers, blending traditional recipes passed down through generations with avant-garde culinary techniques. Our commitment to excellence remains unchanged.
              </p>
              <p>
                Every plate we serve is a testament to our history, a blend of carefully selected local ingredients and global inspiration.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-brand-gold/10 rounded-2xl transform rotate-3"></div>
            <img
              src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Chef in Action"
              className="relative rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            { icon: <FaHeart />, title: "Passion", desc: "Love for hospitality in every gesture." },
            { icon: <FaAward />, title: "Excellence", desc: "Striking for perfection in every dish." },
            { icon: <FaLeaf />, title: "Organic", desc: "Sourcing only the freshest local produce." },
            { icon: <FaUsers />, title: "Community", desc: "Creating space for shared memories." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all group"
            >
              <div className="text-3xl text-brand-gold mb-6 group-hover:scale-110 transition-transform inline-block">
                {item.icon}
              </div>
              <h3 className="text-xl font-display font-bold mb-4">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Chef Section */}
        <div className="bg-brand-black rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/3">
              <img
                src="/chef.jpg"
                alt="Chef de Cuisine"
                className="rounded-full w-64 h-64 lg:w-80 lg:h-80 object-cover border-4 border-brand-gold p-2"
              />
            </div>
            <div className="lg:w-2/3 text-white">
              <h3 className="text-brand-gold uppercase tracking-widest font-bold mb-4">The Master Mind</h3>
              <h2 className="text-4xl font-display font-bold mb-6 italic">Chef Julian Thorne</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                "Cooking is a conversation between nature and culture. My goal is to let the ingredients speak while providing the vocabulary through heat, spice, and technique."
              </p>
              <div className="flex gap-12">
                <div>
                  <p className="text-4xl font-display font-bold text-brand-gold">15+</p>
                  <p className="text-sm text-gray-500 uppercase tracking-widest">Global Awards</p>
                </div>
                <div>
                  <p className="text-4xl font-display font-bold text-brand-gold">20yr</p>
                  <p className="text-sm text-gray-500 uppercase tracking-widest">Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
