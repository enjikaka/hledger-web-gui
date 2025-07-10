import './components/journal-preview.js';

import { parseJournalFile } from './parse-journal-file.js';
import { addAccount, addAlias, addTransaction, default as store } from './store.js';

let journalData = '';
let accounts = [];
let aliases = [];
let accountSelects = [];

// File upload handling
document.getElementById('journalFile').addEventListener('change', async function (event) {
    const file = event.target.files[0];
    
    if (file) {
        for await (const item of parseJournalFile(file)) {
            switch (item.type) {
                case 'account':
                    store.dispatch(addAccount(item.data));
                    accounts.push(item.data.name);
                    break;
                case 'alias':
                    store.dispatch(addAlias(item.data));
                    aliases.push(item.data);
                    break;
                case 'transaction':
                    store.dispatch(addTransaction(item.data));
                    console.log(item);
                    break;
            }
        }

        parseAccounts();
        showSections();
    }
});

// Parse accounts and aliases from journal file
function parseAccounts() {
    accounts = [];
    aliases = [];
    const lines = journalData.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        // Look for account definitions (lines starting with "account ")
        if (trimmedLine.startsWith('account ')) {
            const accountName = trimmedLine.substring(8).trim();
            if (accountName && !accounts.includes(accountName)) {
                accounts.push(accountName);
            }
        }
        // Look for alias definitions (lines starting with "alias ")
        else if (trimmedLine.startsWith('alias ')) {
            const aliasContent = trimmedLine.substring(6).trim();
            // Parse alias format: alias PATTERN = REPLACEMENT
            const aliasMatch = aliasContent.match(/^(.+?)\s*=\s*(.+)$/);
            if (aliasMatch) {
                const pattern = aliasMatch[1].trim();
                const replacement = aliasMatch[2].trim();
                aliases.push({ pattern, replacement });
            }
        }
    }

    // Sort accounts alphabetically
    accounts.sort();
}

// Show relevant sections after file upload
function showSections() {
    document.getElementById('accountsSection').classList.remove('hidden');
    document.getElementById('transactionForm').classList.remove('hidden');
    document.getElementById('journalPreview').classList.remove('hidden');

    // Populate accounts grid with hierarchy
    populateAccountsGrid();

    // Populate account selects
    updateAccountSelects();
}

// Populate accounts grid with hierarchical structure
function populateAccountsGrid() {
    const accountsGrid = document.getElementById('accountsGrid');
    accountsGrid.innerHTML = '';

    // Group accounts by hierarchy
    const accountHierarchy = buildAccountHierarchy(accounts);

    // Render accounts with hierarchy
    renderAccountHierarchy(accountsGrid, accountHierarchy, 0);

    // Add aliases section
    if (aliases.length > 0) {
        // Add separator
        const separator = document.createElement('div');
        separator.className = 'account-item';
        separator.style.backgroundColor = '#f8f9fa';
        separator.style.borderBottom = '2px solid #dee2e6';
        separator.style.fontWeight = 'bold';
        separator.style.textAlign = 'center';
        separator.textContent = 'Aliases';
        accountsGrid.appendChild(separator);

        // Add aliases
        aliases.forEach(alias => {
            const aliasItem = document.createElement('div');
            aliasItem.className = 'account-item';
            aliasItem.style.backgroundColor = '#e3f2fd';
            aliasItem.style.borderLeft = '3px solid #2196f3';
            aliasItem.textContent = `${alias.pattern} → ${alias.replacement}`;
            accountsGrid.appendChild(aliasItem);
        });
    }
}

// Build account hierarchy from flat account list
function buildAccountHierarchy(accountList) {
    const hierarchy = {};

    accountList.forEach(account => {
        const parts = account.split(':');
        let current = hierarchy;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!current[part]) {
                current[part] = { children: {}, isAccount: i === parts.length - 1 };
            }
            current = current[part].children;
        }
    });

    return hierarchy;
}

// Render account hierarchy recursively
function renderAccountHierarchy(container, hierarchy, level) {
    const sortedKeys = Object.keys(hierarchy).sort();

    sortedKeys.forEach(key => {
        const node = hierarchy[key];
        const accountItem = document.createElement('div');
        accountItem.className = 'account-item';

        // Add indentation based on level
        accountItem.style.paddingLeft = `${20 + (level * 20)}px`;

        // Add visual hierarchy indicators
        if (level > 0) {
            accountItem.style.borderLeft = '2px solid #dee2e6';
            accountItem.style.marginLeft = '10px';
        }

        // Different styling for leaf nodes (actual accounts) vs parent nodes
        if (node.isAccount) {
            accountItem.style.fontWeight = '600';
            accountItem.style.backgroundColor = '#f8f9fa';
        } else {
            accountItem.style.fontWeight = 'bold';
            accountItem.style.backgroundColor = '#e9ecef';
            accountItem.style.color = '#495057';
        }

        accountItem.textContent = key;
        container.appendChild(accountItem);

        // Recursively render children
        if (Object.keys(node.children).length > 0) {
            renderAccountHierarchy(container, node.children, level + 1);
        }
    });
}

// Update all account select dropdowns
function updateAccountSelects() {
    const selects = document.querySelectorAll('.account-select');
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Account</option>';

        // Build hierarchy for dropdown
        const accountHierarchy = buildAccountHierarchy(accounts);

        // Add accounts with optgroup structure
        populateSelectWithHierarchy(select, accountHierarchy, currentValue);

        // Add aliases
        if (aliases.length > 0) {
            // Add separator
            const separator = document.createElement('option');
            separator.disabled = true;
            separator.textContent = '────────── Aliases ──────────';
            select.appendChild(separator);

            aliases.forEach(alias => {
                const option = document.createElement('option');
                option.value = alias.replacement;
                option.textContent = `${alias.pattern} → ${alias.replacement}`;
                if (alias.replacement === currentValue) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        }
    });
}

// Populate select element with hierarchical optgroup structure
function populateSelectWithHierarchy(select, hierarchy, currentValue) {
    const sortedKeys = Object.keys(hierarchy).sort();

    sortedKeys.forEach(key => {
        const node = hierarchy[key];

        if (node.isAccount) {
            // This is a leaf node (actual account)
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            if (key === currentValue) {
                option.selected = true;
            }
            select.appendChild(option);
        } else {
            // This is a parent node, create optgroup
            const optgroup = document.createElement('optgroup');
            optgroup.label = key;

            // Add all child accounts to this optgroup
            addChildAccountsToOptgroup(optgroup, node.children, currentValue, 1);

            select.appendChild(optgroup);
        }
    });
}

// Recursively add child accounts to optgroup with indentation for deeper levels
function addChildAccountsToOptgroup(optgroup, children, currentValue, level) {
    const sortedKeys = Object.keys(children).sort();

    sortedKeys.forEach(key => {
        const node = children[key];

        if (node.isAccount) {
            // This is a leaf node (actual account)
            const option = document.createElement('option');
            option.value = key;
            // Add indentation for visual hierarchy
            const indent = '  '.repeat(level);
            option.textContent = `${indent}${key}`;
            if (key === currentValue) {
                option.selected = true;
            }
            optgroup.appendChild(option);
        } else {
            // This is a nested parent, add with indentation
            const option = document.createElement('option');
            option.value = key;
            option.disabled = true; // Make parent nodes non-selectable
            option.style.fontWeight = 'bold';
            const indent = '  '.repeat(level);
            option.textContent = `${indent}${key}`;
            optgroup.appendChild(option);

            // Recursively add its children
            addChildAccountsToOptgroup(optgroup, node.children, currentValue, level + 1);
        }
    });
}

// Add new posting row
function addPosting() {
    const container = document.getElementById('postingsContainer');
    const postingRow = document.createElement('div');
    postingRow.className = 'posting-row';
    postingRow.innerHTML = `
                <select class="form-control account-select" required>
                    <option value="">Select Account</option>
                </select>
                <input type="number" class="form-control amount-input" step="0.01" placeholder="Amount" required>
                <input type="text" class="form-control currency-input" placeholder="Currency" value="SEK">
                <button type="button" class="remove-posting" onclick="removePosting(this)">Remove</button>
            `;
    container.appendChild(postingRow);
    updateAccountSelects();
}

// Remove posting row
function removePosting(button) {
    const postingRows = document.querySelectorAll('.posting-row');
    if (postingRows.length > 1) {
        button.closest('.posting-row').remove();
    }
}

// Add transaction to journal
function _addTransaction() {
    const date = document.getElementById('transactionDate').value;
    const description = document.getElementById('transactionDescription').value;

    if (!date || !description) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    const postingRows = document.querySelectorAll('.posting-row');
    const postings = [];
    let totalAmount = 0;

    for (const row of postingRows) {
        const account = row.querySelector('.account-select').value;
        const amount = parseFloat(row.querySelector('.amount-input').value);
        const currency = row.querySelector('.currency-input').value;

        if (!account || isNaN(amount)) {
            showMessage('Please fill in all posting details.', 'error');
            return;
        }

        postings.push({ account, amount, currency });
        totalAmount += amount;
    }

    // Check if postings balance (sum should be 0)
    if (Math.abs(totalAmount) > 0.01) {
        showMessage('Postings must balance (sum should be 0).', 'error');
        return;
    }

    // Format the new transaction
    const newTransaction = formatTransaction(date, description, postings);

    // Add to journal data
    journalData += '\n' + newTransaction;

    // Update preview
    updateJournalPreview();

    // Clear form
    clearForm();

    showMessage('Transaction added successfully!', 'success');
}

// Format transaction for journal
function formatTransaction(date, description, postings) {
    let transaction = `${date} ${description}\n`;
    postings.forEach(posting => {
        const sign = posting.amount >= 0 ? ' ' : '';
        transaction += `    ${posting.account}  ${sign}${posting.amount.toFixed(2)} ${posting.currency}\n`;
    });
    return transaction;
}

// Clear the form
function clearForm() {
    document.getElementById('transactionDate').value = '';
    document.getElementById('transactionDescription').value = '';

    // Reset postings to one row
    const container = document.getElementById('postingsContainer');
    container.innerHTML = `
                <div class="posting-row">
                    <select class="form-control account-select" required>
                        <option value="">Select Account</option>
                    </select>
                    <input type="number" class="form-control amount-input" step="0.01" placeholder="Amount" required>
                    <input type="text" class="form-control currency-input" placeholder="Currency" value="SEK">
                    <button type="button" class="remove-posting" onclick="removePosting(this)">Remove</button>
                </div>
            `;
    updateAccountSelects();
}

// Show message
function showMessage(message, type) {
    const messagesContainer = document.getElementById('formMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Set default date to today
document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];