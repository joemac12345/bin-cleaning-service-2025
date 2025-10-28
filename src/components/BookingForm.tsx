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
  postcode: string;
  onBack: () => void;
}

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const SERVICE_TYPES = [
  { id: 'regular', name: 'Regular Clean', description: 'Ongoing scheduled cleaning service', popular: true, serviceCharge: 0 },
  { id: 'oneoff', name: 'One-off Clean', description: 'Single cleaning service', serviceCharge: 10 }
];

const BIN_TYPES = [
  { id: 'wheelie', name: 'Wheelie Bin (Large)', price: 5, description: 'Standard household wheelie bin' },
  { id: 'food', name: 'Food Waste Bin', price: 3, description: 'Small food waste bin' },
  { id: 'recycling', name: 'Recycling Bin', price: 4, description: 'Recycling wheelie bin' },
  { id: 'garden', name: 'Garden Waste Bin', price: 6, description: 'Green garden waste bin' }
];

const COLLECTION_DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

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
  const [formData, setFormData] = useState({
    // Step 1: Service Type
    serviceType: 'regular',
    
    // Step 2: Contact Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    contactPermission: 'yes', // Default to yes for better UX
    
    // Step 3: Address
    address: '',
    useCurrentLocation: false,
    
    // Step 4: Bin Selection with quantities
    binQuantities: {
      wheelie: 0,
      food: 0,
      recycling: 0,
      garden: 0
    } as Record<string, number>,
    
    // Step 5: Collection Days
    collectionDays: [] as string[],
    
    // Step 6: Special Instructions
    // Step 7: Payment Method
    // Step 8: Final Details & Summary
    
    // Additional
    specialInstructions: '',
    paymentMethod: 'card',
    agreeToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Form tracking integration
  const { trackFieldChange, markAsSubmitted } = useFormTracking({
    trackingId: `booking-form-${Date.now()}`,
    onAbandon: (formData) => {
      console.log('📊 Form abandoned with data:', formData);
    }
  });

  // Track form data changes
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

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'agreeToTerms' ? value === 'true' : value 
    }));
  };

  const updateBinQuantity = (binId: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      binQuantities: {
        ...prev.binQuantities,
        [binId]: Math.max(0, quantity) // Ensure minimum quantity is 0
      }
    }));
  };

  const selectCollectionDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      collectionDays: [day] // Only one day can be selected
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark form as submitted to stop abandonment tracking
    markAsSubmitted();
    
    setIsSubmitting(true);

    try {
      // Create booking object with all necessary data
      const bookingData = {
        serviceType: formData.serviceType,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          postcode: postcode,
          contactPermission: formData.contactPermission
        },
        binSelection: formData.binQuantities,
        collectionDay: formData.collectionDays[0],
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions,
        pricing: {
          binTotal: binTotal,
          serviceCharge: serviceCharge,
          totalPrice: totalPrice
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
        bookingId: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      // Save to API endpoint
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
      
      // Show success message with booking ID
      alert(`Booking confirmed! Your booking ID is ${result.bookingId}. We'll send you a confirmation email shortly. You'll now be redirected to manage your booking.`);
      
      // Redirect to customer area with booking ID in URL for easy lookup
      window.location.href = `/customer?booking=${result.bookingId}`;
      
    } catch (error) {
      console.error('Booking submission error:', error);
      
      // More specific error messages
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

  // Calculate total price based on bin quantities and service charge
  const binTotal = Object.entries(formData.binQuantities).reduce((total, [binId, quantity]) => {
    const bin = BIN_TYPES.find(b => b.id === binId);
    return total + (bin ? bin.price * quantity : 0);
  }, 0);
  
  const serviceCharge = SERVICE_TYPES.find(s => s.id === formData.serviceType)?.serviceCharge || 0;
  const totalPrice = binTotal + serviceCharge;

  // Calculate total bins selected
  const totalBinsSelected = Object.values(formData.binQuantities).reduce((total, quantity) => total + quantity, 0);

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
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 leading-tight">Let's get you a price</h2>
                      <h3 className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">for your bin cleaning!</h3>
                    </div>
                  </div>
                  
                  {/* Information we'll need */}
                  <div className="text-left" style={{ maxWidth: '28rem' }}>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
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
                className="w-full py-4 text-base md:text-lg font-medium"
              >
                Let's get started
              </Button>
            </ButtonGroup>
          </>
        )}

        {/* Step 2: Service Type Selection */}
        {currentStep === 2 && (
          <>
            <FormSection>
              <h3 className="text-base font-semibold mb-2 flex items-center space-x-2">
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

        {/* Step 3: Contact Details */}
        {currentStep === 3 && (
          <>
            <FormSection>
              <h3 className="text-base font-semibold mb-2 flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Your Contact Details</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">We'll use these details to contact you about your booking</p>
              <div className="border-b border-gray-200 mb-6"></div>

              <div className="grid grid-cols-2 gap-4">
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

              <InputField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                required
              />

              <InputField
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                required
              />

              {/* Contact Permission */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Are you happy for us to contact you?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactPermission"
                      value="yes"
                      checked={formData.contactPermission === 'yes'}
                      onChange={(e) => handleInputChange('contactPermission', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Yes, please contact me</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactPermission"
                      value="no"
                      checked={formData.contactPermission === 'no'}
                      onChange={(e) => handleInputChange('contactPermission', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">No, do not contact me</span>
                  </label>
                </div>
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

        {/* Step 4: Address */}
        {currentStep === 4 && (
          <>
            <FormSection>
              <h3 className="text-base font-semibold mb-2 flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Your Address</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">Where should we come to clean your bins?</p>
              <div className="border-b border-gray-200 mb-6"></div>

              <TextareaField
                label="Full Address"
                value={formData.address}
                onChange={(value) => handleInputChange('address', value)}
                placeholder={`Please provide your full address in ${postcode}...`}
                rows={3}
                required
              />

              <div className="mt-4">
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

        {/* Step 5: Bin Selection */}
        {currentStep === 5 && (
          <>
            <FormSection>
              <h3 className="text-base font-semibold mb-2 flex items-center space-x-2">
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

        {/* Step 6: Collection Days */}
        {currentStep === 6 && (
          <>
            <FormSection>
              <h3 className="text-base font-semibold mb-2 flex items-center space-x-2">
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

        {/* Step 7: Special Instructions */}
        {currentStep === 7 && (
          <>
            <FormSection>
              <h3 className="text-base font-semibold mb-2 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Special Instructions</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">Any additional instructions or special requirements? (Optional)</p>
              <div className="border-b border-gray-200 mb-6"></div>

              <TextareaField
                label="Special Instructions"
                value={formData.specialInstructions}
                onChange={(value) => handleInputChange('specialInstructions', value)}
                placeholder="e.g., Gate access code, bin location details, preferred cleaning time, keys under doormat, any specific requirements..."
                rows={4}
              />
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

        {/* Step 8: Payment Method */}
        {currentStep === 8 && (
          <>
            <FormSection>
              <h3 className="text-base font-semibold mb-2 flex items-center space-x-2">
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
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-blue-800 flex items-start">
                    <CreditCard className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">Secure card payment:</span> You'll be able to pay securely with your card when we contact you to confirm your booking.</span>
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'cash' && (
                <div className="bg-green-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-green-800 flex items-start">
                    <Banknote className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">Cash payment:</span> Please have the exact amount ready (£{totalPrice}) for the cleaner on service day.</span>
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'bank_transfer' && (
                <div className="bg-purple-50 p-4 rounded-lg mt-4">
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

        {/* Step 9: Final Summary & Confirmation */}
        {currentStep === 9 && (
          <>
            <FormSection>
              <h3 className="text-base font-semibold mb-2 flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Review & Confirm Booking</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">Please review your details and confirm your booking</p>
              <div className="border-b border-gray-200 mb-6"></div>

              {/* Final Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
                <h4 className="font-bold text-lg mb-4">Booking Summary</h4>
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
              <div className="mt-6">
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
