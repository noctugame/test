document.addEventListener('DOMContentLoaded', () => {
  const endDate = new Date('2024-09-31T23:59:59'); // Example end date, update with actual end date
  fetch('https://openapi.dexview.com/latest/dex/tokens/0x7ac822195EAb6C1Ac91389700D7449536b0148fc', {
      headers: {
          'accept': 'application/json'
      }
  })
      .then(response => response.json())
      .then(data => {
          const tokenData = data.pairs[0];
          const tokenPrice = tokenData.priceUsd || '0';
          const totalSupply = tokenData.baseToken.totalSupply || '50,000,000,000';
          const tokenName = tokenData.baseToken.name || 'NoctuGame Token';
          const tokenSymbol = tokenData.baseToken.symbol || 'NXGT';
          const tokenAddress = tokenData.baseToken.address || '0x7ac822195EAb6C1Ac91389700D7449536b0148fc';
          const decimals = tokenData.baseToken.decimal || 9;
          const participants = tokenData.txns.h24.buys + tokenData.txns.h24.sells || 0;

          document.getElementById('tokenPrice').textContent = `${tokenPrice} USDT`;
          document.getElementById('tokensForPresale').textContent = `${totalSupply} ${tokenSymbol}`;
          document.getElementById('targetedRaise').textContent = `1,000,000 USDT`;
          document.getElementById('participants').textContent = `${participants}/10000`;

          const tokenInfoList = document.getElementById('tokenInfoList');
          tokenInfoList.innerHTML = `
              <li>Token Name <span>${tokenName}</span></li>
              <li>Token Symbol <span>${tokenSymbol}</span></li>
              <li>Decimals <span>${decimals}</span></li>
              <li>Address <span><img src="assets/images/project/icon.png" alt="project" />${tokenAddress}</span></li>
              <li>Total Supply <span>${totalSupply} ${tokenSymbol}</span></li>
          `;

          document.getElementById('minBuy').textContent = `100 USDT`;
          document.getElementById('maxBuy').textContent = `50,000 USDT`;
### Updated JavaScript (Continued)
```javascript
          document.getElementById('tokenPriceDetail').textContent = `1 USDT = 5,000 ${tokenSymbol}`;
          document.getElementById('accessType').textContent = `Public`;

          // Timer Calculation
          const updateTimer = () => {
              const now = new Date();
              const timeLeft = endDate - now;

              if (timeLeft <= 0) {
                  document.querySelector('.timer .days').textContent = '0D';
                  document.querySelector('.timer .hours').textContent = '0H';
                  document.querySelector('.timer .minutes').textContent = '0M';
                  document.querySelector('.timer .seconds').textContent = '0S';
                  return;
              }

              const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
              const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

              document.querySelector('.timer .days').textContent = `${days}D`;
              document.querySelector('.timer .hours').textContent = `${hours}H`;
              document.querySelector('.timer .minutes').textContent = `${minutes}M`;
              document.querySelector('.timer .seconds').textContent = `${seconds}S`;
          };

          // Update timer every second
          setInterval(updateTimer, 1000);
          updateTimer();
      })
      .catch(error => {
          console.error('Error fetching token data:', error);
      });
});
