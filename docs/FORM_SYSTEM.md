# Reusable Form Component System

This project uses a centralized form component system to ensure consistent styling and behavior across all forms.

## Form Components

All form components are located in `/src/components/ui/Form.tsx` and provide a consistent design system.

### Available Components

#### 1. FormContainer
```tsx
<FormContainer maxWidth="2xl" className="">
  {/* Form content */}
</FormContainer>
```
- **maxWidth**: 'sm' | 'md' | 'lg' | 'xl' | '2xl' (default: '2xl')
- **className**: Additional custom classes

#### 2. FormHeader  
```tsx
<FormHeader 
  title="Form Title"
  subtitle="Optional subtitle" 
  onBack={() => router.back()}
>
  {/* Optional children like progress indicator */}
</FormHeader>
```
- **title**: Main form heading
- **subtitle**: Optional secondary text
- **onBack**: Optional back button handler
- **children**: Optional content (like progress indicators)

#### 3. ProgressIndicator
```tsx
<ProgressIndicator currentStep={2} totalSteps={3} />
```
- **currentStep**: Current active step (1-based)
- **totalSteps**: Total number of steps

#### 4. FormContent
```tsx
<FormContent className="p-6">
  {/* Form content */}
</FormContent>
```
- **className**: Custom classes (default: 'p-6')

#### 5. FormSection
```tsx
<FormSection title="Section Title" className="space-y-6">
  {/* Section content */}
</FormSection>
```
- **title**: Optional section heading
- **className**: Custom classes (default: 'space-y-6')

#### 6. InputField
```tsx
<InputField
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  placeholder="Enter email..."
  required
  disabled={false}
/>
```
- **label**: Field label
- **type**: Input type ('text' | 'email' | 'tel' | 'password' | 'number')
- **value**: Current value
- **onChange**: Change handler function
- **placeholder**: Optional placeholder text
- **required**: Whether field is required (default: false)
- **disabled**: Whether field is disabled (default: false)

#### 7. TextareaField
```tsx
<TextareaField
  label="Description"
  value={description}
  onChange={setDescription}
  placeholder="Enter description..."
  rows={3}
  required
/>
```
- **label**: Field label
- **value**: Current value
- **onChange**: Change handler function
- **placeholder**: Optional placeholder text
- **rows**: Number of rows (default: 3)
- **required**: Whether field is required (default: false)

#### 8. SelectField
```tsx
<SelectField
  label="Country"
  value={country}
  onChange={setCountry}
  options={[
    { value: 'uk', label: 'United Kingdom' },
    { value: 'us', label: 'United States' }
  ]}
  placeholder="Select country..."
  required
/>
```
- **label**: Field label
- **value**: Current value
- **onChange**: Change handler function
- **options**: Array of {value, label} objects
- **placeholder**: Optional placeholder text
- **required**: Whether field is required (default: false)

#### 9. Button
```tsx
<Button
  variant="primary"
  size="md"
  fullWidth
  loading={isSubmitting}
  disabled={!isValid}
  onClick={handleSubmit}
  type="submit"
>
  Submit Form
</Button>
```
- **variant**: 'primary' | 'secondary' | 'outline' | 'yellow' (default: 'primary')
- **size**: 'sm' | 'md' | 'lg' (default: 'md')
- **fullWidth**: Whether button takes full width (default: false)
- **loading**: Shows loading spinner (default: false)
- **disabled**: Whether button is disabled (default: false)
- **onClick**: Click handler
- **type**: Button type ('button' | 'submit')

#### 10. ButtonGroup
```tsx
<ButtonGroup className="flex space-x-3">
  <Button variant="outline">Cancel</Button>
  <Button variant="primary">Submit</Button>
</ButtonGroup>
```
- **className**: Custom classes (default: 'flex space-x-3')

## Design System

### Colors
- **Primary**: Black background with white text
- **Secondary**: Gray background with dark text  
- **Outline**: White background with gray border
- **Yellow**: Yellow background for special actions (waitlist)

### Spacing
- **Consistent padding**: All form elements use consistent spacing
- **Form sections**: 24px spacing between sections
- **Input fields**: 16px padding inside inputs
- **Button groups**: 12px spacing between buttons

### Typography
- **Form titles**: text-2xl font-bold
- **Section titles**: text-lg font-semibold  
- **Field labels**: text-sm font-medium text-gray-700
- **Input text**: Standard body text sizing

### Responsive Design
- All components are mobile-first responsive
- Touch-friendly button sizing (minimum 44px height)
- Proper spacing for mobile interactions

## Usage Examples

### Simple Contact Form
```tsx
<FormContainer maxWidth="md">
  <FormHeader title="Contact Us" />
  <FormContent>
    <FormSection>
      <InputField
        label="Name"
        value={name}
        onChange={setName}
        required
      />
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        required
      />
      <TextareaField
        label="Message"
        value={message}
        onChange={setMessage}
        rows={4}
        required
      />
      <Button type="submit" fullWidth>
        Send Message
      </Button>
    </FormSection>
  </FormContent>
</FormContainer>
```

### Multi-Step Form
```tsx
<FormContainer>
  <FormHeader title="Registration" onBack={handleBack}>
    <ProgressIndicator currentStep={currentStep} totalSteps={3} />
  </FormHeader>
  <FormContent>
    <form onSubmit={handleSubmit}>
      {currentStep === 1 && (
        <FormSection title="Personal Information">
          {/* Step 1 fields */}
          <Button onClick={() => setCurrentStep(2)} fullWidth>
            Continue
          </Button>
        </FormSection>
      )}
      {/* Additional steps... */}
    </form>
  </FormContent>
</FormContainer>
```

## Benefits

✅ **Consistent Design**: All forms look and behave the same way
✅ **Easy Maintenance**: Update styles in one place, affects all forms
✅ **Accessibility**: Built-in proper labels, focus states, and ARIA attributes
✅ **Responsive**: Mobile-first design that works on all screen sizes
✅ **Type Safety**: Full TypeScript support with proper interfaces
✅ **Reusable**: Drop-in components for any form use case
✅ **Performance**: Optimized components with minimal re-renders

## Current Form Implementations

1. **BookingForm** (`/src/components/BookingForm.tsx`)
   - 3-step booking process
   - Service selection, scheduling, contact details

2. **WaitlistForm** (`/src/app/waitlist/page.tsx`)
   - Email collection for service expansion
   - Success state with social links

3. **PostcodeChecker** (can be updated to use these components)
4. **AdminForms** (can be updated to use these components)
