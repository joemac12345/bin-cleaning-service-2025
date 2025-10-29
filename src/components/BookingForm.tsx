/**
 * BOOKING FORM COMPONENT - Multi-Step Service Booking System
 * ===========================================================
 * 
 * This is a comprehensive multi-step booking form for the bin cleaning service.
 * It guides customers through a 9-step process to complete their booking with pricing.
 * 
 * Business Purpose:
 * - Capture complete customer information and booking preferences
 * - Calculate dynamic pricing based on service type and bin selections
 * - Store booking data in Supabase database
 * - Send confirmation emails to customers
 * - Enable form abandonment tracking for marketing follow-up
 * 
 * User Journey (9 Steps):
 * 1. Welcome/Introduction - Explain what information is needed
 * 2. Service Type - Regular or one-off cleaning
 * 3. Contact Details - Name, email, phone, contact permission
 * 4. Address - Full service address with location detection
 * 5. Bin Selection - Choose which bins and quantities (prices update dynamically)
 * 6. Collection Days - When customer's bins are collected (Mon-Fri only)
 * 7. Special Instructions - Optional gate codes, location details, preferences
 * 8. Payment Method - Choose card, cash, or bank transfer
 * 9. Final Review - Confirm all details before submission
 * 
 * Key Features:
 * - Responsive mobile-first design
 * - Auto-location detection with geolocation API
 * - Dynamic pricing calculation
 * - Form abandonment tracking (tracks user data if they leave)
 * - Validation at each step (Next button disabled until step is complete)
 * - Professional UI with Tailwind CSS and Lucide icons
 * - Error handling and user-friendly alerts
 * 
 * Data Stored in Database:
 * - Customer name, email, phone, address, postcode
 * - Service type and bin selection with quantities
 * - Collection day and payment method
 * - Special instructions and pricing breakdown
 * - Booking ID (for customer reference)
 * - Timestamp and status (pending/confirmed/completed)
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, User, CreditCard, MapPin, Trash2, Phone, Mail, Home, Clock, MessageSquare, DollarSign, Banknote, Building2 } from 'lucide-react';
import { 
  FormContainer, 
  FormHeader, 
  FormContent, 
  FormSection,
  InputField,
  TextareaField,
  SelectField,
  Button,
  ButtonGroup
} from './ui/Form';
import { useFormTracking } from '@/hooks/useFormTracking';

interface BookingFormProps {
  postcode: string;  // Postcode passed from parent (PostcodeChecker validated this)
  onBack: () => void; // Callback to navigate back to postcode checker
}

// ============================================================================
// CONFIGURATION CONSTANTS - Form Options and Pricing
// ============================================================================

// Available time slots for service appointments (not currently used in form but available for future feature)
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

// Service type options - Regular service vs one-time clean
// Regular = no service charge (free), One-off = £10 additional charge
const SERVICE_TYPES = [
  { id: 'regular', name: 'Regular Clean', description: 'Ongoing scheduled cleaning service', popular: true, serviceCharge: 0 },
  { id: 'oneoff', name: 'One-off Clean', description: 'Single cleaning service', serviceCharge: 10 }
];

// Bin types available for selection with pricing per unit
// Customer can select multiple bins and quantities
const BIN_TYPES = [
  { id: 'wheelie', name: 'Wheelie Bin (Large)', price: 5, description: 'Standard household wheelie bin' },
  { id: 'food', name: 'Food Waste Bin', price: 3, description: 'Small food waste bin' },
  { id: 'recycling', name: 'Recycling Bin', price: 4, description: 'Recycling wheelie bin' },
  { id: 'garden', name: 'Garden Waste Bin', price: 6, description: 'Green garden waste bin' }
];

// Bin collection days - Only Monday to Friday (Saturday removed)
// This matches typical UK household bin collection schedules
const COLLECTION_DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

// Payment method options - Three different ways customers can pay
// Card: Payment taken during booking confirmation
// Cash: Customer pays cleaner on service day
// Bank Transfer: Payment requested after service is completed
const PAYMENT_METHODS = [
  { 
    id: 'card', 
    name: 'Card Payment', 
    description: 'Pay securely by card (Visa, Mastercard, etc.)',
    icon: CreditCard,
    popular: true 
  },
  { 
    id: 'cash', 
    name: 'Cash Payment', 
    description: 'Pay cash to the cleaner on service day',
    icon: Banknote 
  },
  { 
    id: 'bank_transfer', 
    name: 'Bank Transfer', 
    description: 'Direct bank transfer after service completion',
    icon: Building2 
  }
];

export default function BookingForm({ postcode, onBack }: BookingFormProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Main form data object - stores all customer input across all 9 steps
  // Reset on page refresh; persisted temporarily while user navigates steps
  const [formData, setFormData] = useState({
    // Step 1: Not captured (just intro screen)
    
    // Step 2: Service Type Selection
    serviceType: 'regular', // 'regular' or 'oneoff'
    
    // Step 3: Contact Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    contactPermission: 'yes', // GDPR compliance: user confirms we can contact them
    
    // Step 4: Address
    address: '',
    useCurrentLocation: false, // Flag for location detection success message
    
    // Step 5: Bin Selection with quantities
    binQuantities: {
      wheelie: 0,
      food: 0,
      recycling: 0,
      garden: 0
    } as Record<string, number>,
    
    // Step 6: Collection Days
    collectionDays: [] as string[], // Array but only one day can be selected (radio button behavior)
    
    // Step 7: Special Instructions
    specialInstructions: '',
    
    // Step 8: Payment Method
    paymentMethod: 'card', // 'card', 'cash', or 'bank_transfer'
    
    // Step 9: Terms Agreement
    agreeToTerms: false // GDPR/Legal: user must agree before submission
  });

  // UI state for form submission and navigation
  const [isSubmitting, setIsSubmitting] = useState(false);     // Show spinner on Complete Booking button
  const [currentStep, setCurrentStep] = useState(1);           // Current form step (1-9)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false); // Show spinner on location button

  // ============================================================================
  // FORM TRACKING - Analytics & Abandonment Detection
  // ============================================================================
  // Tracks form progress even if user leaves (abandonment tracking for marketing)
  const { trackFieldChange, markAsSubmitted } = useFormTracking({
    trackingId: `booking-form-${Date.now()}`, // Unique ID for this form session
    onAbandon: (formData) => {
      console.log('📊 Form abandoned with data:', formData); // Could send to Supabase for email retargeting
    }
  });

  // Track all form changes
  useEffect(() => {
    trackFieldChange('formData', formData);
  }, [formData, trackFieldChange]);

  useEffect(() => {
    trackFieldChange('currentStep', currentStep);
  }, [currentStep, trackFieldChange]);

  useEffect(() => {
    trackFieldChange('postcode', postcode);
  }, [postcode, trackFieldChange]);



  // Auto-detect contact details from device
  const detectContactDetails = async () => {
    try {
      // Try to get contact info from browser (if available)
      if ('contacts' in navigator && 'ContactsManager' in window) {
        // @ts-ignore - Contacts API is experimental
        const contacts = await navigator.contacts.select(['name', 'email', 'tel']);
        if (contacts.length > 0) {
          const contact = contacts[0];
          setFormData(prev => ({
            ...prev,
            firstName: contact.name?.[0]?.split(' ')[0] || '',
            lastName: contact.name?.[0]?.split(' ').slice(1).join(' ') || '',
            email: contact.email?.[0] || '',
            phone: contact.tel?.[0] || ''
          }));
        }
      }
    } catch (error) {
      console.log('Contact detection not available:', error);
    }
  };

  // Auto-detect location
  const detectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      if ('geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
        });
        
        // Use a free geocoding service to get full address with postcode
        try {
          // Try Nominatim (OpenStreetMap) first - it's free
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          
          if (data && data.display_name) {
            // Format the address nicely
            const address = data.address;
            let formattedAddress = '';
            
            // Build address string with house number, street, city, postcode
            if (address.house_number) formattedAddress += address.house_number + ' ';
            if (address.road) formattedAddress += address.road + ', ';
            if (address.suburb || address.neighbourhood) formattedAddress += (address.suburb || address.neighbourhood) + ', ';
            if (address.city || address.town || address.village) formattedAddress += (address.city || address.town || address.village) + ', ';
            if (address.postcode) formattedAddress += address.postcode;
            
            // Remove trailing comma and space if no postcode
            formattedAddress = formattedAddress.replace(/,\s*$/, '');
            
            setFormData(prev => ({
              ...prev,
              address: formattedAddress || data.display_name,
              useCurrentLocation: true
            }));
          } else {
            throw new Error('No address found');
          }
        } catch (geocodeError) {
          // Fallback: Just use coordinates and ask user to complete
          setFormData(prev => ({
            ...prev,
            address: `Location detected (${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}) - Please complete your full address including postcode`,
            useCurrentLocation: true
          }));
        }
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    } catch (error) {
      console.log('Location detection failed:', error);
      alert('Location detection failed. Please ensure location permissions are enabled and try again, or enter your address manually.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (0) for service availability
      if (date.getDay() !== 0) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-GB', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })
        });
      }
    }
    return dates;
  };

  // ============================================================================
  // FORM INPUT HANDLERS - Managing state updates
  // ============================================================================
  
  // Generic handler for all basic form input changes (text, email, phone, checkbox, radio)
  // Updates formData state with new value for given field
  // Special handling for agreeToTerms (converts string to boolean)
  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'agreeToTerms' ? value === 'true' : value 
    }));
  };

  // Specialized handler for bin quantity updates
  // Manages binQuantities object independently
  // Ensures quantity never goes below 0 (can't have negative bins)
  // Called by +/- buttons on each bin type
  const updateBinQuantity = (binId: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      binQuantities: {
        ...prev.binQuantities,
        [binId]: Math.max(0, quantity) // Ensure minimum quantity is 0
      }
    }));
  };

  // Specialized handler for collection day selection
  // Implements radio-button behavior: only ONE day can be selected at a time
  // When user selects a day, replaces entire array with single-item array
  // If user selects same day again, it stays selected (replace with same)
  const selectCollectionDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      collectionDays: [day] // Only one day can be selected
    }));
  };

  // ============================================================================
  // FORM SUBMISSION HANDLER
  // ============================================================================
  // Handles the final booking submission after user completes all 9 steps
  // Validates data, creates booking record in database, sends confirmation email, and redirects to thank-you page
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark form as submitted to stop abandonment tracking
    // This prevents the form from appearing as abandoned if user completes it
    markAsSubmitted();
    
    setIsSubmitting(true);

    try {
      // Step 1: Assemble booking object with all necessary data from form
      // This gets saved to Supabase and used to generate the email and customer portal
      const bookingData = {
        serviceType: formData.serviceType,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          postcode: postcode,
          contactPermission: formData.contactPermission // GDPR: Customer consent to contact
        },
        binSelection: formData.binQuantities,
        collectionDay: formData.collectionDays[0], // Only one day selected (radio behavior)
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions,
        pricing: {
          binTotal: binTotal,              // Sum of all bin prices
          serviceCharge: serviceCharge,    // Extra charge for one-off service
          totalPrice: totalPrice           // Grand total
        },
        status: 'pending', // New bookings start as pending (awaiting customer payment)
        createdAt: new Date().toISOString(),
        bookingId: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Unique ID for this booking
      };

      // Step 2: POST booking data to API endpoint
      // This endpoint (api/bookings) handles:
      // - Saving to Supabase database
      // - Generating and sending confirmation email via Gmail SMTP
      // - Creating customer portal access
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Response:', errorData);
        throw new Error(`Failed to save booking: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Step 3: Show success message and redirect to customer portal
      // Customer can track their booking and make modifications
      alert(`Booking confirmed! Your booking ID is ${result.bookingId}. We'll send you a confirmation email shortly. You'll now be redirected to manage your booking.`);
      
      // Redirect to customer area with booking ID in URL for easy lookup
      // The thank-you page will show comprehensive booking summary and next steps
      window.location.href = `/booking/thank-you?booking=${result.bookingId}`;
      
    } catch (error) {
      console.error('Booking submission error:', error);
      
      // Provide specific error messages to help customers troubleshoot
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (error instanceof TypeError && errorMessage.includes('fetch')) {
        alert('Network error: Please check your internet connection and try again.');
      } else if (errorMessage.includes('Failed to save booking')) {
        alert(`Server error: ${errorMessage}. Please try again or contact support.`);
      } else {
        alert('Sorry, there was an error processing your booking. Please check all fields are filled correctly and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // PRICE CALCULATION LOGIC
  // ============================================================================
  // These values are displayed in the pricing summary and included in the final booking
  
  // Calculate total bin cost by summing up: (bin price × quantity) for each bin type
  // Example: 2 wheelie bins @ £5 each = £10
  const binTotal = Object.entries(formData.binQuantities).reduce((total, [binId, quantity]) => {
    const bin = BIN_TYPES.find(b => b.id === binId);
    return total + (bin ? bin.price * quantity : 0);
  }, 0);
  
  // Service charge depends on service type:
  // - Regular service: £0 (no extra charge for standard cleaning)
  // - One-off service: £10 (extra charge for additional/urgent jobs)
  const serviceCharge = SERVICE_TYPES.find(s => s.id === formData.serviceType)?.serviceCharge || 0;
  
  // Grand total = bin costs + service charge
  // This is what the customer will be asked to pay
  const totalPrice = binTotal + serviceCharge;

  // Count total individual bins selected (for display purposes)
  // Used in pricing summary to show "You have selected 3 bins"
  const totalBinsSelected = Object.values(formData.binQuantities).reduce((total, quantity) => total + quantity, 0);

  // ============================================================================
  // FORM FLOW OVERVIEW (9 STEPS)
  // ============================================================================
  // This multi-step form guides customers through a seamless booking experience:
  //
  // Step 1: Welcome Screen
  //   - Explains what information will be needed
  //   - Sets expectations (2-3 minute completion time)
  //   - No data collection (just intro)
  //
  // Step 2: Service Type Selection
  //   - Radio buttons for Regular or One-off service
  //   - Regular: Recurring cleaning service (£0 base charge)
  //   - One-off: Single additional clean (£10 charge)
  //
  // Step 3: Contact Details
  //   - First Name, Last Name, Email, Phone
  //   - Auto-detect location button (tries to access device contacts)
  //   - GDPR contact permission checkbox (user consents to contact)
  //
  // Step 4: Service Address
  //   - Address input field with manual entry
  //   - "Detect Location" button uses browser geolocation
  //   - Fetches full address from OpenStreetMap API and postcode
  //   - Shows success message on detection
  //
  // Step 5: Bin Selection
  //   - Select which types of bins need cleaning
  //   - Increase/decrease quantities with +/- buttons
  //   - Real-time price calculation displayed
  //   - Available bin types: Wheelie, Food Waste, Recycling, Garden
  //
  // Step 6: Collection Days
  //   - Choose preferred collection day (Monday-Friday only)
  //   - Radio button group (only one day can be selected)
  //   - Saturday/Sunday excluded for business operations
  //
  // Step 7: Special Instructions
  //   - Optional text area for any special requests
  //   - Examples: gate codes, pet warnings, best time to call
  //
  // Step 8: Payment Method
  //   - Three payment options: Card, Cash, Bank Transfer
  //   - Card: Online payment via Stripe (secure)
  //   - Cash: Pay the cleaner on service day
  //   - Bank Transfer: Invoice sent after service
  //
  // Step 9: Final Summary & Confirmation
  //   - Review all booking details
  //   - Display total price breakdown
  //   - Final terms agreement checkbox (legal compliance)
  //   - Complete Booking button submits to database
  //
  // KEY FEATURES:
  // - Real-time price calculation updates as user selects bins
  // - Progress indicator shows current step and total steps
  // - Previous button allows navigation backward
  // - Mobile-optimized responsive design
  // - Form data persisted in state across steps
  // - Geolocation and contact auto-detection (with fallbacks)
  // - GDPR compliant with explicit consent checkboxes
  // ============================================================================

  return (
    <FormContainer fullWidthOnMobile={true} className="bg-transparent">
      <FormContent>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 space-y-6">
        {/* Step 1: Welcome */}
        {currentStep === 1 && (
          <>
            <FormSection>
              <div className="text-left py-4 md:py-8">
                <div className="mb-8 md:mb-6">
                  <div className="flex items-start mb-6 md:mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-gray-800 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                      <Trash2 className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-xl md:text-2xl font-bold mb-1 leading-tight">Let's get you a price</h2>
                      <h3 className="text-lg sm:text-lg md:text-lg text-gray-600 leading-relaxed">for your bin cleaning!</h3>
                    </div>
                  </div>
                  
                  {/* Information we'll need */}
                  <div className="text-left" style={{ maxWidth: '28rem' }}>
                    <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      To provide accurate pricing, we'll need:
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start">
                        <CreditCard className="w-4 h-4 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">What type of service you prefer (regular or one-off)</span>
                      </li>
                      <li className="flex items-start">
                        <User className="w-4 h-4 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">Your contact details and service address</span>
                      </li>
                      <li className="flex items-start">
                        <Trash2 className="w-4 h-4 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">Which bins need cleaning and how many</span>
                      </li>
                      <li className="flex items-start">
                        <Calendar className="w-4 h-4 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">Your bin collection days</span>
                      </li>
                    </ul>
                    <div className="mt-6 text-sm text-gray-600 p-4 border border-gray-200 rounded-lg flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span><span className="font-medium">Takes just 2-3 minutes</span> - Get your instant quote!</span>
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>
            
            <ButtonGroup stickyBottom={true} withBackground={true} withDivider={true} className="block">
              <Button
                onClick={() => setCurrentStep(2)}
                variant="primary"
                className="w-full py-4 text-base font-medium"
              >
                Let's get started
              </Button>
            </ButtonGroup>
          </>
        )}

        {/* Step 2: Service Type Selection
            WHAT HAPPENS HERE:
            - User selects between "Regular" (ongoing) or "One-off" (single clean) service
            - This choice affects the final price (£0 base vs £10 premium)
            - Stored in formData.serviceType as either 'regular' or 'oneoff'
            
            USER DECISIONS:
            - Regular service: For customers wanting recurring weekly/monthly cleans
            - One-off service: For customers wanting a one-time deep clean
            
            VALIDATION:
            - Service type is required before proceeding
            - Defaults to 'regular' if not explicitly changed
        */}
        {currentStep === 2 && (
          <>
            <FormSection>
              <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>What type of service do you need?</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">Choose between regular ongoing service or a one-time clean</p>
              <div className="border-b border-gray-200 mb-6"></div>
              <div className="grid gap-4">
                {SERVICE_TYPES.map((service) => (
                  <label key={service.id} className="relative">
                    <input
                      type="radio"
                      name="serviceType"
                      value={service.id}
                      checked={formData.serviceType === service.id}
                      onChange={(e) => handleInputChange('serviceType', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-5 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.serviceType === service.id 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{service.name}</h4>
                            {service.popular && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                Most Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        </div>
                        <div className="ml-4 text-right">
                          {service.serviceCharge > 0 && (
                            <p className="text-xs text-gray-500">
                              Service charge applies
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </FormSection>
            
            <ButtonGroup stickyBottom={true} withBackground={true} withDivider={true}>
              <Button
                onClick={() => setCurrentStep(3)}
                variant="primary"
                className="w-full py-4 text-base font-medium"
              >
                Next
              </Button>
            </ButtonGroup>
          </>
        )}

        {/* Step 3: Contact Details
            WHAT HAPPENS HERE:
            - Collects customer's name, email, and phone number
            - These are required fields (validation prevents proceeding without them)
            - Contact Permission checkbox: GDPR compliance - user must consent to be contacted
            - Optional auto-detect feature attempts to pull contacts from device
            
            COLLECTED DATA:
            - firstName: Customer's first name (required, validation enforced)
            - lastName: Customer's last name (required, validation enforced)
            - email: Contact email for booking confirmation and updates (required, must be valid email)
            - phone: Phone number for cleaner to contact on service day (required)
            - contactPermission: GDPR consent checkbox (required for compliance)
            
            VALIDATION RULES:
            - All fields required (firstName, lastName, email, phone)
            - Email must be valid format (handled by HTML5 email input type)
            - Contact permission must be checked to proceed
            - Next button disabled until all validations pass
            
            BUSINESS IMPACT:
            - Email used for booking confirmation and payment processing
            - Phone used by cleaner for coordination on service day
            - Contact permission enables follow-up marketing and customer service
        */}
        {currentStep === 3 && (
          <>
            <FormSection>
              <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Your Contact Details</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">We'll use these details to contact you about your booking</p>
              <div className="border-b border-gray-200 mb-6"></div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(value) => handleInputChange('firstName', value)}
                  required
                />
                <InputField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(value) => handleInputChange('lastName', value)}
                  required
                />
              </div>

              <div className="mb-4">
                <InputField
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  required
                />
              </div>

              <div className="mb-4">
                <InputField
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  required
                />
              </div>

              {/* Contact Permission */}
              <div className="mt-6">
                <label className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.contactPermission === 'yes'}
                    onChange={(e) => handleInputChange('contactPermission', e.target.checked ? 'yes' : 'no')}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    formData.contactPermission === 'yes'
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.contactPermission === 'yes'
                          ? 'border-black bg-black'
                          : 'border-gray-300'
                      }`}>
                        {formData.contactPermission === 'yes' && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        I'm happy for you to contact me about this booking via email, phone, or SMS
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </FormSection>

            <ButtonGroup stickyBottom={true} withBackground={true} withDivider={true}>
              <Button
                onClick={() => setCurrentStep(2)}
                variant="outline"
                className="flex-1 py-4"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(4)}
                disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.contactPermission}
                variant="primary"
                className="flex-1 py-4"
              >
                Next
              </Button>
            </ButtonGroup>
          </>
        )}

        {/* Step 4: Address
            WHAT HAPPENS HERE:
            - Collects the full service address within the confirmed postcode
            - User can manually enter their address OR use "Detect Location" button
            - Geolocation detection uses browser GPS + OpenStreetMap API for reverse geocoding
            - Shows success message when location is successfully detected
            
            COLLECTED DATA:
            - address: Full street address including house number (required)
            - useCurrentLocation: Flag showing if location was auto-detected (for UX messaging)
            
            GEOLOCATION FLOW (if user clicks "Detect Location"):
            1. Browser requests permission to access device location
            2. Gets latitude/longitude from GPS/network triangulation
            3. Sends to OpenStreetMap Nominatim API for reverse geocoding
            4. Formats returned data into readable address format
            5. Populates address field and shows success message
            6. If API fails, shows coordinates as fallback and prompts manual entry
            
            VALIDATION RULES:
            - Address field required (cannot be empty)
            - Must contain enough detail for cleaner to locate property
            - Postcode already confirmed on previous page
            
            ERROR HANDLING:
            - If geolocation disabled: Shows alert prompting manual entry
            - If API fails: Shows coordinates with fallback message
            - If browser unsupported: Graceful fallback to manual entry
            
            BUSINESS IMPACT:
            - Address used to dispatch cleaner to correct location
            - Combined with postcode for full service area verification
        */}
        {currentStep === 4 && (
          <>
            <FormSection>
              <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Your Address</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">Where should we come to clean your bins?</p>
              <div className="border-b border-gray-200 mb-6"></div>

              <div className="mb-4">
                <TextareaField
                  label="Full Address"
                  value={formData.address}
                  onChange={(value) => handleInputChange('address', value)}
                  placeholder={`Please provide your full address in ${postcode}...`}
                  rows={3}
                  required
                />
              </div>

              <div className="mb-4">
                <Button
                  onClick={detectLocation}
                  variant="outline"
                  className="w-full"
                  loading={isDetectingLocation}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Use my current location
                </Button>
              </div>

              {formData.useCurrentLocation && (
                <div className="bg-green-50 p-3 rounded-lg text-sm text-green-800 mt-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location detected successfully
                  </div>
                  <div className="mt-2 text-green-700 flex items-start">
                    <MessageSquare className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    Please verify the address above is correct, especially the house number and postcode
                  </div>
                </div>
              )}
            </FormSection>

            <ButtonGroup stickyBottom={true} withBackground={true} withDivider={true}>
              <Button
                onClick={() => setCurrentStep(3)}
                variant="outline"
                className="flex-1 py-4"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(5)}
                disabled={!formData.address}
                variant="primary"
                className="flex-1 py-4"
              >
                Next
              </Button>
            </ButtonGroup>
          </>
        )}

        {/* Step 5: Bin Selection
            WHAT HAPPENS HERE:
            - User selects which bin types need cleaning and quantities
            - Price updates in real-time as quantities change
            - At least 1 bin must be selected to proceed
            - Each bin type has its own individual price
            
            AVAILABLE BIN TYPES & PRICING:
            - Wheelie Bin (£5): Standard residential bin, most common
            - Food Waste Bin (£3): Smaller food composting bin
            - Recycling Bin (£4): Mixed recyclables container
            - Garden Waste Bin (£6): Leaf/garden waste container
            
            COLLECTED DATA:
            - binQuantities: Object tracking quantity for each bin type
              { wheelie: 1, food: 0, recycling: 2, garden: 1 } = 4 bins total
            
            PRICE CALCULATION (REAL-TIME):
            - binTotal calculated from: Sum of (bin price × quantity) for each bin
            - Example: 1 wheelie (£5) + 2 recycling (£4×2=£8) = £13
            - Real-time calculation provides instant transparency
            - Final binTotal used in Step 9 summary and booking submission
            
            VALIDATION RULES:
            - At least 1 bin must be selected (totalBinsSelected > 0)
            - Quantities managed with +/- buttons (cannot go negative)
            - No upper limit on quantities (customer can select 5, 10, etc.)
            
            BUSINESS IMPACT:
            - Each bin type requires specific cleaning approach
            - Pricing structure covers equipment, labor, waste disposal costs
            - Quantity selection affects cleaner dispatch scheduling
        */}
        {currentStep === 5 && (
          <>
            <FormSection>
              <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>Which bins need cleaning?</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">Select all the bins you want cleaned and how many of each</p>
              <div className="border-b border-gray-200 mb-6"></div>

              <div className="grid gap-3">
                {BIN_TYPES.map((bin) => (
                  <div key={bin.id} className={`p-3 border-2 rounded-lg transition-all ${
                    formData.binQuantities[bin.id] > 0
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{bin.name}</h4>
                        <p className="text-xs text-gray-600">{bin.description}</p>
                      </div>

                    </div>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">Quantity:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateBinQuantity(bin.id, formData.binQuantities[bin.id] - 1)}
                          disabled={formData.binQuantities[bin.id] <= 0}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-semibold text-sm">{formData.binQuantities[bin.id]}</span>
                        <button
                          type="button"
                          onClick={() => updateBinQuantity(bin.id, formData.binQuantities[bin.id] + 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    

                  </div>
                ))}
              </div>

              {/* Selection Summary */}
              {totalBinsSelected > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg mt-4">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{totalBinsSelected} bin{totalBinsSelected !== 1 ? 's' : ''} selected</span>
                    <span className="text-gray-500 ml-2">• Pricing will be shown at the end</span>
                  </div>
                </div>
              )}
            </FormSection>

            <ButtonGroup stickyBottom={true} withBackground={true} withDivider={true}>
              <Button
                onClick={() => setCurrentStep(4)}
                variant="outline"
                className="flex-1 py-4"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(6)}
                disabled={totalBinsSelected === 0}
                variant="primary"
                className="flex-1 py-4"
              >
                Next
              </Button>
            </ButtonGroup>
          </>
        )}

        {/* Step 6: Collection Days
            WHAT HAPPENS HERE:
            - User selects their bin collection day (the day their council/provider picks up bins)
            - We schedule cleaning for the SAME DAY (after they're collected)
            - Only weekdays available (Monday-Friday) - business operations constraint
            - Radio button behavior (only ONE day can be selected)
            
            AVAILABLE COLLECTION DAYS:
            - Monday, Tuesday, Wednesday, Thursday, Friday
            - Saturday and Sunday NOT available (no weekend collections scheduled)
            - Days stored as strings in formData.collectionDays array (though only 1 selected)
            
            COLLECTED DATA:
            - collectionDays: Array with single string value ['Monday'] or ['Wednesday']
            - Later accessed as: formData.collectionDays[0] when submitting booking
            
            WHY THIS MATTERS:
            - Council collection happens on specific days per postcode
            - Cleaner needs to schedule after collection to clean dirty bins
            - Customer provides day → Our system schedules cleaner for same day
            - Enables efficient route optimization for cleaning team
            
            BUSINESS CONSTRAINTS:
            - No Saturday/Sunday operations (team has weekends off)
            - Customer must know their council collection day before booking
            - If unsure, customer can check council website or ask during booking process
            
            VALIDATION RULES:
            - One day must be selected (cannot proceed without selection)
            - Radio buttons enforce single selection (can't choose multiple days)
        */}
        {currentStep === 6 && (
          <>
            <FormSection>
              <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Bin Collection Days</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">When are your bins collected? We clean them after collection</p>
              <div className="border-b border-gray-200 mb-6"></div>

              <div className="grid grid-cols-2 gap-3">
                {COLLECTION_DAYS.map((day) => (
                  <label key={day} className="relative">
                    <input
                      type="radio"
                      name="collectionDay"
                      value={day}
                      checked={formData.collectionDays.includes(day)}
                      onChange={() => selectCollectionDay(day)}
                      className="sr-only"
                    />
                    <div className={`p-4 sm:p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      formData.collectionDays.includes(day)
                        ? 'border-black bg-gray-50 font-semibold' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      {day}
                    </div>
                  </label>
                ))}
              </div>


            </FormSection>

            <ButtonGroup stickyBottom={true} withBackground={true} withDivider={true}>
              <Button
                onClick={() => setCurrentStep(5)}
                variant="outline"
                className="flex-1 py-4"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(7)}
                disabled={formData.collectionDays.length === 0}
                variant="primary"
                className="flex-1 py-4"
              >
                Next
              </Button>
            </ButtonGroup>
          </>
        )}

        {/* Step 7: Special Instructions
            WHAT HAPPENS HERE:
            - Optional free-text field for customer special requests
            - Completely optional (not required to proceed)
            - Examples: gate access codes, preferred times, pet warnings, etc.
            - Cleaner receives this in booking details before arriving
            
            COLLECTED DATA:
            - specialInstructions: Free text string (can be empty)
            - Displayed to cleaner as part of job briefing
            - Shown in customer's booking portal for reference
            
            COMMON USE CASES:
            - "Gate access code is 1234, bins are behind garage"
            - "Please don't ring doorbell, dog will bark"
            - "Bins are located in alley on left side of property"
            - "Best time to call is after 10am"
            - "Please clean extra carefully, bins have stickers on them"
            - "Access requires key from front left planter"
            
            WHY THIS MATTERS:
            - Provides context that improves cleaner efficiency and safety
            - Reduces missed jobs due to unclear access instructions
            - Prevents misunderstandings about property layout
            - Improves customer satisfaction through attention to detail
            
            VALIDATION:
            - No validation required (completely optional field)
            - Maximum length enforced by textarea (practical limit)
            - Can contain any text relevant to the cleaning job
            
            BUSINESS IMPACT:
            - Better prepared cleaning team = more professional service
            - Fewer callbacks due to clarification questions
            - Shows attention to customer needs
        */}
        {currentStep === 7 && (
          <>
            <FormSection>
              <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Special Instructions</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">Any additional instructions or special requirements? (Optional)</p>
              <div className="border-b border-gray-200 mb-6"></div>

              <div className="mb-4">
                <TextareaField
                  label="Special Instructions"
                  value={formData.specialInstructions}
                  onChange={(value) => handleInputChange('specialInstructions', value)}
                  placeholder="e.g., Gate access code, bin location details, preferred cleaning time, keys under doormat, any specific requirements..."
                  rows={4}
                />
              </div>
            </FormSection>

            <ButtonGroup stickyBottom={true} withBackground={true} withDivider={true}>
              <Button
                onClick={() => setCurrentStep(6)}
                variant="outline"
                className="flex-1 py-4"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(8)}
                variant="primary"
                className="flex-1 py-4"
              >
                Next
              </Button>
            </ButtonGroup>
          </>
        )}

        {/* Step 8: Payment Method
            WHAT HAPPENS HERE:
            - Customer selects how they want to pay for their booking
            - Three payment options available (radio buttons - single selection)
            - Each option has different timing and process
            - Selection stored and used at payment processing stage
            
            PAYMENT OPTIONS:
            1. CARD PAYMENT (Default, Marked as Popular)
               - Visa, Mastercard, American Express accepted
               - Processed securely via Stripe payment gateway
               - Payment collected UPFRONT (before service)
               - Fastest checkout process
               - Best for: Online-savvy customers, quick service
            
            2. CASH PAYMENT
               - Customer pays cleaner directly on service day
               - No upfront payment required
               - Cleaner carries payment terminal or takes exact cash
               - Invoice generated for records
               - Best for: Customers without card, local payment preference
            
            3. BANK TRANSFER
               - Payment via direct bank transfer/BACS
               - Invoice issued after service completion
               - Payment expected within 5-7 working days
               - Best for: Business customers, accounting purposes, preferred method
            
            COLLECTED DATA:
            - paymentMethod: String value - 'card', 'cash', or 'bank_transfer'
            - Stored in booking record for payment processing flow
            - Used to trigger different backend payment workflows
            
            BUSINESS WORKFLOW:
            - Card → Immediate Stripe charge → Service scheduled
            - Cash → Service scheduled → Invoice emailed → Collected on day
            - Bank Transfer → Invoice emailed → Awaiting payment → Service after payment cleared
            
            VALIDATION:
            - One payment method must be selected
            - Defaults to 'card' in initial state
            - Cannot proceed to final summary without selection
        */}
        {currentStep === 8 && (
          <>
            <FormSection>
              <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Payment Method</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">How would you like to pay for your bin cleaning service?</p>
              <div className="border-b border-gray-200 mb-6"></div>

              <div className="grid gap-4">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.id} className="relative">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={formData.paymentMethod === method.id}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-5 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paymentMethod === method.id 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <method.icon className="w-6 h-6 text-gray-700" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold">{method.name}</h4>
                                {method.popular && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    Most Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Payment method specific information */}
              {formData.paymentMethod === 'card' && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800 flex items-start">
                    <CreditCard className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">Secure card payment:</span> You'll be able to pay securely with your card when we contact you to confirm your booking.</span>
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'cash' && (
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-green-800 flex items-start">
                    <Banknote className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">Cash payment:</span> Please have the exact amount ready (£{totalPrice}) for the cleaner on service day.</span>
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'bank_transfer' && (
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-purple-800 flex items-start">
                    <Building2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">Bank transfer:</span> We'll send you our bank details after the service is completed. Payment due within 7 days.</span>
                  </p>
                </div>
              )}
            </FormSection>

            <ButtonGroup stickyBottom={true} withBackground={true} withDivider={true}>
              <Button
                onClick={() => setCurrentStep(7)}
                variant="outline"
                className="flex-1 py-4"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(9)}
                variant="primary"
                className="flex-1 py-4"
              >
                Next
              </Button>
            </ButtonGroup>
          </>
        )}

        {/* Step 9: Final Summary & Confirmation
            WHAT HAPPENS HERE:
            - Customer reviews ALL booking details in one comprehensive summary
            - Price breakdown shows bin costs + service charge = total
            - Final GDPR compliance: Terms & Conditions checkbox
            - "Complete Booking" button submits everything to database
            - This is the point of no return - triggers booking creation
            
            SUMMARY DISPLAYS:
            1. Service Type: "Regular" or "One-off" cleaning
            2. Contact: Customer's name and contact details
            3. Location: Full address and postcode
            4. Bins Selected: Detailed list of all bin types and quantities
            5. Collection Day: The chosen weekday
            6. Special Instructions: Any notes entered (if provided)
            7. Payment Method: How customer will pay
            8. Price Breakdown:
               - Individual bin costs: e.g., "1x Wheelie bin @ £5"
               - Service charge: £0 (regular) or £10 (one-off)
               - Total price: Final amount to pay
            
            PRICE BREAKDOWN CALCULATION:
            - Displayed in real-time as summary
            - Calculated from: binTotal (sum of all bin prices) + serviceCharge
            - Example summary:
              2x Wheelie bin @ £5 = £10
              1x Recycling bin @ £4 = £4
              Service charge = £0
              TOTAL = £14
            
            COLLECTED DATA:
            - agreeToTerms: Boolean checkbox (GDPR/Legal requirement)
              - Must be TRUE to submit (enforced by disabled button)
              - Customer acknowledges T&Cs and data processing
            
            SUBMISSION FLOW:
            1. Customer checks all details match their expectations
            2. Customer reads and checks Terms & Conditions box
            3. Click "Complete Booking" button
            4. handleSubmit() function triggered
            5. All data POSTed to /api/bookings endpoint
            6. Backend: Save to Supabase + Send confirmation email
            7. Success: Show confirmation message + Redirect to thank-you page
            
            ERROR HANDLING:
            - Network error: Alert user and allow retry
            - Validation error: Show specific error message
            - Server error: Display error code and contact support message
            - Form stays on step 9 if submission fails (user can retry)
            
            VALIDATION RULES:
            - agreeToTerms must be TRUE (checkbox must be checked)
            - Cannot complete booking without explicit consent
            - All previous steps validated before this point
            
            BUSINESS IMPACT:
            - Final checkpoint ensures data accuracy
            - Terms checkbox provides legal protection
            - Email confirmation sent immediately after submission
            - Unique booking ID generated for customer reference
            - Booking enters system for cleaner assignment and scheduling
        */}
        {currentStep === 9 && (
          <>
            <FormSection>
              <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Review & Confirm Booking</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">Please review your details and confirm your booking</p>
              <div className="border-b border-gray-200 mb-6"></div>

              {/* Final Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border mb-4">
                <h4 className="text-lg font-bold mb-4">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Service Type:</span>
                    <span className="capitalize">{formData.serviceType} cleaning</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Contact:</span>
                    <span>{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Phone:</span>
                    <span>{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Address:</span>
                    <span className="text-right max-w-xs">{formData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Bins:</span>
                    <span className="text-right">
                      {Object.entries(formData.binQuantities)
                        .filter(([_, quantity]) => quantity > 0)
                        .map(([binId, quantity]) => {
                          const bin = BIN_TYPES.find(b => b.id === binId);
                          return `${quantity}x ${bin?.name}`;
                        })
                        .join(', ')
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Collection Day:</span>
                    <span>{formData.collectionDays[0] || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Payment Method:</span>
                    <span className="capitalize">{PAYMENT_METHODS.find(p => p.id === formData.paymentMethod)?.name || 'Card Payment'}</span>
                  </div>
                  {formData.specialInstructions && (
                    <div className="flex justify-between">
                      <span className="font-medium">Special Instructions:</span>
                      <span className="text-right max-w-xs">{formData.specialInstructions}</span>
                    </div>
                  )}
                  <hr className="my-3" />
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Bins subtotal:</span>
                      <span>£{binTotal}</span>
                    </div>
                    {serviceCharge > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Service charge:</span>
                        <span>£{serviceCharge}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                      <span>Total per clean:</span>
                      <span className="text-green-600">£{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="mb-4">
                <label className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked.toString())}
                    className="sr-only"
                  />
                  <div className={`p-5 sm:p-4 border-2 rounded-lg transition-all ${
                    formData.agreeToTerms
                      ? 'border-black bg-gray-50 font-semibold' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.agreeToTerms
                          ? 'border-black bg-black'
                          : 'border-gray-300'
                      }`}>
                        {formData.agreeToTerms && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </FormSection>

            <ButtonGroup stickyBottom={true} withBackground={true} withDivider={true}>
              <Button
                onClick={() => setCurrentStep(8)}
                variant="outline"
                className="flex-1 py-4"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.agreeToTerms}
                loading={isSubmitting}
                variant="primary"
                className="flex-1 py-4 text-base font-medium"
              >
                Complete Booking
              </Button>
            </ButtonGroup>
          </>
        )}
          </div>
        </form>
      </FormContent>
    </FormContainer>
  );
}
