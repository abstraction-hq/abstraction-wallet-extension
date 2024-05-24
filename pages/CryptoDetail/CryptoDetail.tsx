import React from 'react';
import { useParams } from 'react-router-dom';
import './CryptoDetail.css';

// Sample transaction data for Tether (This would typically come from a database or API)
const transactions = [
    { type: 'Send', amount: '12.30 USDT', date: 'Feb 12, 2023', address: '0x7c1...eca60' },
    { type: 'Receive', amount: '15,362.31 USDT', date: 'Feb 10, 2023', address: '0x96a...786b' },
    { type: 'Receive', amount: '6,642.00 USDT', date: 'Jan 5, 2023', address: '0x8e0...ed59a' },
    { type: 'Send', amount: '45.91 USDT', date: 'Dec 24, 2022', address: '0xEEd...ac84' },
    { type: 'Receive', amount: '3,995.26 USDT', date: 'Dec 21, 2022', address: '0x73b...0a35b' },
];

const CryptoDetail = () => {
    const { symbol } = useParams<{ symbol: string }>();

    // Find the specific cryptocurrency data (example for Tether, you can extend it for all)
    const crypto = {
        name: "Tether",
        symbol: "USDT",
        amount: "1,012.32",
        uri: 'path/to/tether.png'
    };

    return (
        <div className="crypto-detail">
            <div className="crypto-header">
                <img src={crypto.uri} alt={crypto.name} className="crypto-icon-large" />
                <h1>{crypto.name}</h1>
                <p>{crypto.symbol}</p>
            </div>
            <div className="crypto-balance">
                <h2>{crypto.amount} {crypto.symbol}</h2>
                <p>~1,012.32$</p>
            </div>
            <div className="crypto-actions">
                <button>Send</button>
                <button>Receive</button>
                <button>Swap</button>
            </div>
            <div className="transaction-list">
                {transactions.map((transaction, index) => (
                    <div key={index} className="transaction-item">
                        <div className={`transaction-type ${transaction.type.toLowerCase()}`}>
                            {transaction.type}
                        </div>
                        <div className="transaction-details">
                            <span className="transaction-amount">{transaction.amount}</span>
                            <span className="transaction-date">{transaction.date}</span>
                            <span className="transaction-address">To {transaction.address}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CryptoDetail;
