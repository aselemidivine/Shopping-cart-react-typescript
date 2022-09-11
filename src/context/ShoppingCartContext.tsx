import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingCart } from "../component/ShoppingCart";
import { useLocalStorage } from "../hooks/UseLocalStorage";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: number
    quantity: number
}

// we need different functions
type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void
    getItemQuantity: ( id: number ) => number
    increaseCartQuantity: ( id: number ) => void
    decreaseCartQuantity: ( id: number ) => void
    removeFromCart: ( id: number) => void
    cartQuantity: number
    cartItems: CartItem[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)


// Here we are gonna export a custom hook known as a useShoppingCart
export function useShoppingCart() {
    return (
        useContext(ShoppingCartContext)
        )
    }
    
    
export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart", [])  //  creating different state variables to implement this
    const [isOpen, setIsOpen] = useState(false)

    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0 ) 

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)
    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    function increaseCartQuantity(id: number ) {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id) == null) {
                return [...currItems, {id, quantity: 1 }]
            } else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return {...item, quantity: item.quantity + 1 }
                    } else {
                        return item 
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id: number ) {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id)?.quantity == null) {
                return currItems.filter(item => item.id !== id)
            } else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return {...item, quantity: item.quantity - 1 }
                    } else {
                        return item 
                    }
                })
            }
        })
    }

    function removeFromCart(id: number ) {
        setCartItems(currItems => {
            return currItems.filter(item => item.id !== id)
        })
    }

    return ( 
    <ShoppingCartContext.Provider
     value={{
            getItemQuantity,
            increaseCartQuantity,
            decreaseCartQuantity,
            removeFromCart,
            openCart, 
            closeCart,
            cartItems,
            cartQuantity 
        }}
        >    
        {children}
        <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
    )
}