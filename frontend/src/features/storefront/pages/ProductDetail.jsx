import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Instagram } from 'lucide-react';
import { apiService } from '../../../services/api';
import { useCart } from '../../../context/CartContext';
import { useTranslation } from 'react-i18next';
import TransformedImage from '../../../components/product/TransformedImage';
import AddToCartDialog from '../../../components/modals/AddToCartDialog';
import LoadingScreen from '../../../components/common/LoadingScreen';
import CartView from '../../../components/layout/CartView';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { cartCount } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
    const [isCartViewOpen, setIsCartViewOpen] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await apiService.getProduct(id);
                setProduct(response.data);
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
        return <LoadingScreen />;
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
            <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                        <img src="/logo.png" alt="AzharStore Logo" className="h-12 sm:h-16" />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <a
                            href="https://www.instagram.com/azharstore"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 h-10 px-3 sm:px-5 border border-border-gray bg-white text-text-gray rounded-md hover:bg-soft-hover hover:border-brand-purple transition-all duration-200"
                        >
                            <span className="hidden sm:inline text-sm font-medium">Instagram</span>
                            <Instagram className="h-4 w-4" />
                        </a>

                        <button
                            onClick={() => setIsCartViewOpen(true)}
                            className="relative inline-flex items-center justify-center gap-2 h-10 px-3 sm:px-5 border border-border-gray bg-white text-text-gray rounded-md hover:bg-soft-hover hover:border-brand-purple transition-all duration-200"
                        >
                            <span className="hidden sm:inline text-sm font-medium">{t('common.cart')}</span>
                            <ShoppingCart className="h-4 w-4" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>
            <CartView isOpen={isCartViewOpen} onClose={() => setIsCartViewOpen(false)} />

            <main className="container mx-auto px-3 py-8 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
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

                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-text-dark mb-1">{product.name}</h1>

                        {product.description && (
                            <p className="text-sm text-text-light leading-relaxed mb-2">{product.description}</p>
                        )}

                        <div className="text-2xl font-bold text-brand-purple mb-2">{product.price} د.ب</div>

                        <div className="text-sm text-text-light mb-2">
                            {totalStock > 0 ? (
                                <span className="text-green-600">متوفر في المخزون ({totalStock} قطعة)</span>
                            ) : (
                                <span className="text-red-600">غير متوفر حالياً</span>
                            )}
                        </div>

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

                        <div className="space-y-3 mt-6">
                            <button
                                onClick={() => setIsCartDialogOpen(true)}
                                className="w-full bg-brand-purple text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-brand-purple/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/20"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span>إضافة إلى السلة</span>
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-transparent border border-gray-200 text-text-dark font-normal text-sm py-2.5 px-4 rounded-lg hover:border-brand-purple hover:text-brand-purple hover:bg-brand-purple/5 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>العودة للمتجر</span>
                            </button>
                        </div>
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
