"use client"
import {useAppContext} from "@/providers/context-provider";
import Image from "next/image";

export default function ProductOverview() {
    const {state, dispatch} = useAppContext()
    if (!state.selectedProduct)
        return null
    const product = state.selectedProduct
    const id = product.id
    const cartItem = state.cart.get(id)
    const images = product.images.map((image, index) =>
        <Image className="product-photo" key={index} src={image.src} alt={image.alt || product.name} width={200} height={200}/> // Добавлен alt и размеры
    )
    if (images.length === 0)
        images.push(<Image className="product-photo" key={0} src="/no-image.png" alt="no image" width={200} height={200}/>) // Добавлен alt и размеры

    return (
        <div className={`product-overview ${cartItem ? "selected" : ""}`}>
            <div className="product-photos">
                {images}
            </div>
            <div className="product-label">
                <span className="product-title">{product.name}</span>
                <span className="product-price" dangerouslySetInnerHTML={{ __html: product.price_html }}></span>
            </div>
            <div className="product-counter">{cartItem?.count || 0}</div>
            <div className="store-product-buttons">
                <button className="store-product-decr-button"
                        onClick={() => dispatch({type: "dec", product})}
                >
                </button>
                <button className="store-product-incr-button"
                        onClick={() => dispatch({type: "inc", product})}
                >
                    <span className="button-item-label">Add</span>
                </button>
            </div>
            <div className='product-description' dangerouslySetInnerHTML={{ __html: product.description }}></div>
        </div>
    )
}
