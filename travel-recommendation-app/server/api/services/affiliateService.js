require('dotenv').config();

class AffiliateService {
  constructor() {
    this.bookingAffiliateId = process.env.BOOKING_AFFILIATE_ID;
    this.expediaAffiliateId = process.env.EXPEDIA_AFFILIATE_ID;
  }

  generateBookingLink(hotelId, checkIn, checkOut) {
    // Format: YYYY-MM-DD
    return `https://www.booking.com/hotel.html?aid=${this.bookingAffiliateId}&hotelid=${hotelId}&checkin=${checkIn}&checkout=${checkOut}`;
  }

  generateExpediaLink(hotelId, checkIn, checkOut) {
    return `https://www.expedia.com/hotel?hotelID=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}&affid=${this.expediaAffiliateId}`;
  }
  
  // Add more affiliate link generators as needed
}

module.exports = new AffiliateService();