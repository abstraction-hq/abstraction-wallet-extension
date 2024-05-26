import React from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

const cryptoData = {
    USDT: {
        name: "Tether USD",
        amount: "1,012.32",
        transactions: [
            { type: 'Send', amount: '12.30', date: 'Feb 12, 2023', to: '0x7c1....eca60' },
            { type: 'Receive', amount: '15,362.31', date: 'Feb 10, 2023', from: '0x96a....786b' },
            { type: 'Receive', amount: '6,642.00', date: 'Jan 5, 2023', from: '0x8e0....ed59a' },
            { type: 'Send', amount: '45.91', date: 'Dec 24, 2022', to: '0xEEd....dc84' },
            { type: 'Receive', amount: '3,995.26', date: 'Dec 21, 2022', from: '0x73b....0a35b' }
        ]
    }
};

const CryptoDetail = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const crypto = cryptoData[symbol as keyof typeof cryptoData];

    if (!crypto) return <div>Cryptocurrency not found</div>;

    return (
        <div className="crypto-detail">
            <div className="crypto-header">
                <img src={`path/to/${symbol}.png`} alt={crypto.name} className="crypto-icon" />
                <h1>{crypto.name}</h1>
                <p>{symbol}</p>
            </div>
            <div className="crypto-balance">
                <h2>{crypto.amount} {symbol}</h2>
            </div>
            <div className="transaction-list">
                {crypto.transactions.map((transaction, index) => (
                    <div key={index} className="transaction-item">
                        <span>{transaction.type}</span>
                        <span>{transaction.amount} {symbol}</span>
                        <span>{transaction.date}</span>
                        {transaction.to && <span>To: {transaction.to}</span>}
                        {transaction.from && <span>From: {transaction.from}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CryptoDetail;
