import { registerComponent, Component } from 'webact';
import { store } from '../store.js';
import { signal, computed } from '@preact/signals-core';

class JournalPreview extends Component {
    constructor(props) {
        super(props);

        const transactions = signal(store.getState().transactions);

        store.subscribe(() => {
            transactions.value = store.getState().transactions;
        });

        this.transactionsText = computed(() => JSON.stringify(transactions.value, null, 2));

        this.transactionsText.subscribe(() => {
            this.render();
        });
    }

    render() {
        return `<div>
            <h1>Journal Preview</h1>
            <pre>${this.transactionsText.value}</pre>
        </div>`;
    }
}

export default registerComponent(JournalPreview, {
    name: 'journal-preview',
});