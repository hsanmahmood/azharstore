import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';
import TransformedImage from '../components/TransformedImage';
import AddToCartDialog from '../components/AddToCartDialog';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await apiService.getProduct(id);
                setProduct(response.data);
                // Set default selected image
                if (response.data.primary_image_url) {
                    setSelectedImage(response.data.primary_image_url);
                } else if (response.data.product_images?.length > 0) {
                    const primaryImg = response.data.product_images.find(img => img.is_primary);
                    setSelectedImage(primaryImg?.image_url || response.data.product_images[0].image_url);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant.id);
        if (variant.image_url) {
            setSelectedImage(variant.image_url);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-background flex items-center justify-center">
                <div className="text-text-light">جاري التحميل...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-primary-background flex items-center justify-center">
                <div className="text-text-light">المنتج غير موجود</div>
            </div>
        );
    }

    const productImages = product.product_images || [];
    const variants = product.product_variants || [];
    const variantImages = variants
        .filter(v => v.image_url)
        .map(v => ({
            id: `variant-${v.id}`,
            image_url: v.image_url,
            is_variant: true,
            variant_id: v.id,
        }));
    const allImages = [...productImages, ...variantImages];

    const totalStock = variants.length > 0
        ? variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0)
        : product.stock_quantity || 0;

    return (
        <div className="min-h-screen bg-primary-background">
            {/* Header */}
            <header className="border-b bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-purple/80 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">العودة للمتجر</span>
                    </button>
                </div>
            </header>

            {/* Product Content */}
            <main className="container mx-auto px-3 py-8 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Images Section */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square bg-white rounded-xl border border-soft-border overflow-hidden">
                            {selectedImage ? (
                                <TransformedImage
                                    url={selectedImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <span className="text-sm">لا توجد صورة</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {allImages.map(image => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(image.image_url)}
                                        className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${selectedImage === image.image_url ? 'border-brand-purple' : 'border-soft-border hover:border-brand-purple/50'}`}
                                    >
                                        <TransformedImage
                                            url={image.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-3">
                        {/* Title */}
                        <h1 className="text-3xl font-bold text-text-dark mb-1">{product.name}</h1>

                        {/* Description */}
                        {product.description && (
                            <p className="text-sm text-text-light leading-relaxed mb-2">{product.description}</p>
                        )}

                        {/* Price */}
                        <div className="text-2xl font-bold text-brand-purple mb-2">{product.price} د.ب</div>

                        {/* Stock Info */}
                        <div className="text-sm text-text-light mb-2">
                            {totalStock > 0 ? (
                                <span className="text-green-600">متوفر في المخزون ({totalStock} قطعة)</span>
                            ) : (
                                <span className="text-red-600">غير متوفر حالياً</span>
                            )}
                        </div>

                        {/* Variants */}
                        {variants.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {variants.map(variant => (
                                    <button
                                        key={variant.id}
                                        onClick={() => handleVariantSelect(variant)}
                                        className={`px-3 py-1 text-sm rounded-[12px] border-2 transition-all ${selectedVariant === variant.id ? 'border-brand-purple bg-brand-purple text-white' : 'border-soft-border bg-white text-text-dark hover:border-brand-purple'}`}
                                    >
                                        {variant.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            onClick={() => setIsCartDialogOpen(true)}
                            className="w-full bg-brand-purple text-white font-semibold py-2 px-4 rounded-[12px] hover:bg-brand-purple/90 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span>إضافة إلى السلة</span>
                        </button>
                    </div>
                </div>
            </main>
            {isCartDialogOpen && (
                <AddToCartDialog
                    isOpen={isCartDialogOpen}
                    onClose={() => setIsCartDialogOpen(false)}
                    product={product}
                />
            )}
        </div>
    );
};

export default ProductDetail;
