import React from 'react';

const CategorySlider = ({
    categories = [],
    selectedCategory = 'all',
    onCategoryClick = () => { },
    loading = false
}) => {
    if (loading) {
        return <div className="text-sm text-text-light">جاري التحميل...</div>;
    }

    return (
        <>
            {/* All Products button */}
            <button
                onClick={() => onCategoryClick('all')}
                className={`inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-sm font-bold transition-all duration-200 ${selectedCategory === 'all'
                        ? 'bg-brand-purple text-white hover:bg-brand-purple/90'
                        : 'border border-border-gray bg-white text-text-gray hover:bg-soft-hover hover:border-brand-purple'
                    }`}
            >
                جميع المنتجات
            </button>

            {/* Category buttons */}
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onCategoryClick(category.id)}
                    className={`inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-sm font-bold transition-all duration-200 ${selectedCategory === category.id
                            ? 'bg-brand-purple text-white hover:bg-brand-purple/90'
                            : 'border border-border-gray bg-white text-text-gray hover:bg-soft-hover hover:border-brand-purple'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </>
    );
};

export default CategorySlider;
