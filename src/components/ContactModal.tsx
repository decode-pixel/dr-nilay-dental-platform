import React from 'react';
import BookingModal from './booking/BookingModal';

/**
 * ContactModal delegates to the new Sprint 2.2 Premium Booking Engine (BookingModal)
 * while preserving 100% backward compatibility with <ContactModal /> and
 * window.dispatchEvent(new CustomEvent('openContactModal')).
 */
export default function ContactModal() {
  return <BookingModal />;
}
