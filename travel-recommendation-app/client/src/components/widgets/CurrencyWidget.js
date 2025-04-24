import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress, Grid, Divider } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

const CurrencyWidget = ({ country }) => {
  const [currencyData, setCurrencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCurrencyData = async () => {
      if (!country) {
        setLoading(false);
        setError('Country information not available');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Mock data for demonstration
        // In a real app, you would call a currency API
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Map countries to currencies (simplified)
        const countryCurrencyMap = {
          'France': { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
          'United States': { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.00 },
          'United Kingdom': { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.75 },
          'Japan': { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110.25 },
          'Australia': { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 },
          'Canada': { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.28 },
          'Switzerland': { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.92 },
          'China': { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45 },
          'India': { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 74.50 },
          'Brazil': { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.20 },
        };
        
        // Default to Euro if country not found
        const currency = countryCurrencyMap[country] || { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 };
        
        setCurrencyData({
          localCurrency: currency,
          exchangeRates: [
            { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 / currency.rate },
            { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 / currency.rate },
            { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.75 / currency.rate },
          ]
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching currency data:', err);
        setError('Could not load currency data');
        setLoading(false);
      }
    };
    
    fetchCurrencyData();
  }, [country]);
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        <CurrencyExchangeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Currency Information
      </Typography>
      
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
          <CircularProgress size={40} />
        </Box>
      )}
      
      {error && (
        <Box textAlign="center" py={2}>
          <Typography color="error">
            {error}
          </Typography>
        </Box>
      )}
      
      {!loading && !error && currencyData && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Local Currency: {currencyData.localCurrency.name} ({currencyData.localCurrency.code})
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Symbol: {currencyData.localCurrency.symbol}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Exchange Rates:
          </Typography>
          
          <Grid container spacing={1}>
            {currencyData.exchangeRates.map((rate) => (
              <Grid item xs={12} key={rate.code}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>
                    1 {currencyData.localCurrency.code} =
                  </Typography>
                  <Typography>
                    {rate.symbol}{rate.rate.toFixed(2)} {rate.code}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'right' }}>
            *Exchange rates are for demonstration purposes
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default CurrencyWidget;