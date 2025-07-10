# Hledger Journal Manager

A vanilla web application for managing hledger journal files. Upload your journal file and easily add new transactions using only the accounts defined in your file.

## Features

- 📁 **File Upload**: Upload your `.journal` file via drag & drop or file picker
- 📋 **Account Discovery**: Automatically extracts and displays all accounts defined in your journal file
- ➕ **Transaction Form**: Easy-to-use form for adding new transactions
- ⚖️ **Balance Validation**: Ensures your transactions balance (sum to zero)
- 📄 **Live Preview**: See your journal file content in real-time
- 🎨 **Modern UI**: Beautiful, responsive design that works on desktop and mobile

## How to Use

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

4. **Upload your journal file** by clicking "Choose Journal File" and selecting your `.journal` file

5. **View available accounts** - the app will automatically extract all accounts defined in your file

6. **Add transactions**:
   - Set the transaction date
   - Enter a description
   - Add postings by selecting accounts from the dropdown (only shows accounts from your file)
   - Enter amounts and currency
   - Add more postings if needed
   - The app will validate that postings balance to zero

7. **Preview your journal** - see the updated content in real-time

## File Format Support

The app supports standard hledger journal files with:
- Account definitions (`account accountname`)
- Transactions with postings
- Comments (lines starting with `;`)
- Standard hledger syntax

## Example Transaction

When you add a transaction like:
- Date: 2025-01-15
- Description: "Coffee purchase"
- Postings:
  - `expenses:food` + 25.00 SEK
  - `assets:bank` - 25.00 SEK

The app will format it as:
```
2025-01-15 Coffee purchase
    expenses:food   25.00 SEK
    assets:bank  -25.00 SEK
```

## Technical Details

- **TypeScript** - Type-safe development with modern JavaScript features
- **Vite** - Fast development server and build tool
- **Webact** - Lightweight web components library
- **Preact Signals** - Reactive state management
- **Responsive design** - works on desktop, tablet, and mobile
- **File parsing** - client-side parsing of journal files
- **Validation** - ensures transactions balance and all fields are filled
- **Modern CSS** - uses CSS Grid, Flexbox, and modern styling

## Development

This project uses Vite for the development server and build process.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run server` - Serve the built application

### Project Structure

```
src/
├── js/
│   ├── components/     # Webact components
│   ├── signals.ts      # Preact signals for state
│   ├── parse-journal-file.ts  # Journal file parser
│   └── app.ts          # Main application logic
├── css/
│   └── style.css       # Application styles
└── index.html          # Main HTML file
```

## Browser Compatibility

Works in all modern browsers that support:
- File API
- ES6+ JavaScript
- CSS Grid and Flexbox
- Web Components
- Constructable Stylesheets 