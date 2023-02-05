import { useReducer } from 'react';

import CartContext from "./cart-context";

const defaultCartState = {
    items: [],
    totalAmount: 0
}

const cartReducer = (state, action) => {
    if (action.type === 'ADD_ITEM') {
        const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;

        const existingCartItemIndex = state.items.findIndex(item => item.id === action.item.id);
        const existingCartItem = state.items[existingCartItemIndex];
        let updatedItems;

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                amount: existingCartItem.amount + action.item.amount
            };

            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            updatedItems = state.items.concat(action.item);
        }

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        };
    }

    if (action.type === 'REMOVE_ITEM') {
        let existingItems = [...state.items];
        const removeItemIndex = existingItems.findIndex(item => item.id === action.id);
        const removeItem = existingItems[removeItemIndex];

        if (removeItem.amount > 1) {
            let updatedItem = {
                ...removeItem,
                amount: removeItem.amount - 1
            }

            existingItems[removeItemIndex] = updatedItem;
            let totalAmount = state.totalAmount - removeItem.price;

            return {
                items: existingItems,
                totalAmount: totalAmount
            }
        } else {
            let updatedItems = existingItems.filter(item => item.id !== action.id);
            let totalAmount = state.totalAmount - removeItem.price;

            return {
                items: updatedItems,
                totalAmount: totalAmount
            }
        }
    }

    return defaultCartState;
}

const CartProvider = props => {
    const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);

    const addItemToCartHandler = item => {
        dispatchCartAction({
            type: 'ADD_ITEM',
            item: item
        });
    };

    const removeItemToCartHandler = id => {
        dispatchCartAction({
            type: 'REMOVE_ITEM',
            id: id
        })
    };

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemToCartHandler
    }

    return <CartContext.Provider value={cartContext}>{props.children}</CartContext.Provider>
}

export default CartProvider;