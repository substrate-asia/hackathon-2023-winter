import Symb from '../../assets/whale_avatar5.png';

export default function TokensTable() {

    const tokens = [
        { id: 1, name: 'Bitcoin', symbol: 'BTC', price: '$22,961.52', priceChange: '-3.43%', marketCap: '$438,425,394,440', volume: '1,204,174 BTC' },
        { id: 2, name: 'Litecoin', symbol: 'LTC', price: '$22,961.52', priceChange: '-3.43%', marketCap: '$438,425,394,440', volume: '1,204,174 BTC' },
        { id: 3, name: 'Ethereum', symbol: 'ETH', price: '$22,961.52', priceChange: '-3.43%', marketCap: '$438,425,394,440', volume: '1,204,174 BTC' },
        { id: 4, name: 'Binance', symbol: 'BNB', price: '$22,961.52', priceChange: '-3.43%', marketCap: '$438,425,394,440', volume: '1,204,174 BTC' },
        // Add more token data here...
    ];
  
    return (
        <div className="w-full backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 text-dark-color dark:text-light-color">
        <div className="overflow-x-auto">
          <table className="table-auto font-open w-full">
            <thead>
              <tr className="text-left bg-gradient-to-b from-transparent to-light2-color dark:to-dark2-color border-2 border-secondary-color rounded">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Share</th>
                <th className="px-4 py-2">24H %</th>
                <th className="px-4 py-2">7D %</th>
                <th className="px-4 py-2">Market Cap</th>
                <th className="px-4 py-2">Volume (24H)</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.id} className="h-16 items-center">
                    <td className="px-4 py-2 font-bold">{token.id}</td>
                    <td className="flex flex-row py-2 items-center"><img src={Symb} alt={token.name} className='h-12 p-2'/><div className="px-2 py-2">{token.name} {token.symbol}</div></td>
                    <td className="px-4 py-2">{token.price}</td>
                    <td className="px-4 py-2">
                        {/* Placeholder for price chart */}
                    </td>
                    <td className="px-4 py-2">{token.priceChange}</td>
                    <td className="px-4 py-2">{/* 7D % Placeholder */}</td>
                    <td className="px-4 py-2">{token.marketCap}</td>
                    <td className="px-4 py-2">{token.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};
  