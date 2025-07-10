import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  accounts: [],
  aliases: [],
  transactions: [],
};

export const addAccount = (account) => ({
    type: 'ADD_ACCOUNT',
    payload: account,
});

export const addAlias = (alias) => ({
    type: 'ADD_ALIAS',
    payload: alias,
});

export const addTransaction = (transaction) => ({
    type: 'ADD_TRANSACTION',
    payload: transaction,
});

const accountsReducer = (state = initialState.accounts, action) => {
    switch (action.type) {
        case 'ADD_ACCOUNT':
            return [...state, action.payload];
        default:
            return state;
    }
};  
const aliasesReducer = (state = initialState.aliases, action) => {
    switch (action.type) {
        case 'ADD_ALIAS':
            return [...state, action.payload];
        default:
            return state;
    }
};

const transactionsReducer = (state = initialState.transactions, action) => {
    switch (action.type) {
        case 'ADD_TRANSACTION':
            return [...state, action.payload];
        default:
            return state;
    }
};

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    aliases: aliasesReducer,
    transactions: transactionsReducer,
  },
  preloadedState: initialState,
});

export default store;