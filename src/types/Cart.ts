export interface Cart {
    id: string
    items: CartItem[]
}

export interface CartItem {
    id: number
    name: string
    description?: string
    price: number
    pictureUrl?: string
    productBrand?: string
    productType?: string
    quantity: number
}

export interface CartTotals {
    subTotal: number
    deliveryFee: number
    total: number
}