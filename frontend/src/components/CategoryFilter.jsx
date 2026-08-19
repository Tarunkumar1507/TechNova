import React from 'react';

const CategoryFilter = ({ activeCategory, onSelectCategory }) => {
  const categories = ['All', 'Smartphones', 'Laptops', 'Audio', 'Accessories'];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = activeCategory === (category === 'All' ? '' : category);
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category === 'All' ? '' : category)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
              isActive
                ? 'bg-sky-500/10 border-sky-500 text-sky-400 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
