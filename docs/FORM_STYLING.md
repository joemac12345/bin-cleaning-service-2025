# Form Styling Guide

## 🎨 **Complete Styling Options**

### **1. Form Container Variants**

```tsx
// Default (current BookingForm style)
<FormContainer variant="default" maxWidth="2xl">
  // Clean white background, rounded corners, shadow

// Modern (elevated design)  
<FormContainer variant="modern" maxWidth="lg">
  // Gradient background, larger shadows, more rounded

// Minimal (clean and simple)
<FormContainer variant="minimal" maxWidth="md">
  // Simple border, smaller shadow, less rounded
```

### **2. Header Variants**

```tsx
// Dark theme (current default)
<FormHeader variant="dark" title="Your Form" />
  // Black background, white text

// Light theme
<FormHeader variant="light" title="Your Form" />
  // Light gray background, dark text

// Gradient theme  
<FormHeader variant="gradient" title="Your Form" />
  // Blue to purple gradient, white text

// Colored theme
<FormHeader variant="colored" title="Your Form" />
  // Solid blue background, white text
```

### **3. Button Variants**

```tsx
// Existing variants
<Button variant="primary">Black Button</Button>
<Button variant="secondary">Gray Button</Button>  
<Button variant="outline">Outlined Button</Button>
<Button variant="yellow">Yellow Button</Button>

// New color variants
<Button variant="blue">Blue Button</Button>
<Button variant="green">Green Button</Button>
<Button variant="red">Red Button</Button>
<Button variant="gradient">Gradient Button</Button>
```

### **4. Complete Custom Examples**

**Option A: Modern Blue Theme**
```tsx
<FormContainer variant="modern" maxWidth="lg">
  <FormHeader 
    variant="gradient" 
    title="Contact Us" 
    subtitle="Get in touch with our team"
  />
  <FormContent>
    <FormSection title="Your Information">
      <InputField label="Name" value={name} onChange={setName} />
      <InputField label="Email" type="email" value={email} onChange={setEmail} />
      
      <Button variant="gradient" fullWidth>
        Send Message
      </Button>
    </FormSection>
  </FormContent>
</FormContainer>
```

**Option B: Clean Minimal Theme**
```tsx
<FormContainer variant="minimal" maxWidth="md">
  <FormHeader 
    variant="light" 
    title="Simple Form"
  />
  <FormContent>
    <InputField label="Email" type="email" value={email} onChange={setEmail} />
    <Button variant="blue" fullWidth>Submit</Button>
  </FormContent>
</FormContainer>
```

**Option C: Custom Styled (Advanced)**
```tsx
<FormContainer 
  variant="default" 
  maxWidth="xl"
  className="border-4 border-purple-500 shadow-2xl"
>
  <FormHeader 
    variant="dark"
    title="Custom Form"
    className="bg-purple-600"
  />
  <FormContent className="bg-gradient-to-b from-purple-50 to-white p-8">
    <Button 
      variant="primary" 
      className="bg-purple-600 hover:bg-purple-700"
    >
      Custom Purple Button
    </Button>
  </FormContent>
</FormContainer>
```

### **5. Input Field Styling**

```tsx
// Standard styling (automatic)
<InputField label="Email" type="email" value={email} onChange={setEmail} />

// Custom styling
<InputField 
  label="Special Field" 
  value={value} 
  onChange={setValue}
  className="border-2 border-blue-500 focus:border-blue-700"
/>

// With custom wrapper
<div className="bg-blue-50 p-4 rounded-lg">
  <InputField label="Highlighted Field" value={value} onChange={setValue} />
</div>
```

## 🚀 **Quick Start Examples**

### **Style 1: TikTok Theme (Current)**
```tsx
<FormContainer variant="default">
  <FormHeader variant="dark" title="Book Service" />
  // Current styling - clean, professional
```

### **Style 2: Modern SaaS**  
```tsx
<FormContainer variant="modern" maxWidth="lg">
  <FormHeader variant="gradient" title="Get Started" />
  <Button variant="gradient">Continue</Button>
  // Modern, colorful, engaging
```

### **Style 3: Minimal Clean**
```tsx
<FormContainer variant="minimal" maxWidth="md">
  <FormHeader variant="light" title="Contact" />
  <Button variant="blue">Send</Button>
  // Simple, clean, focused
```

### **Style 4: E-commerce**
```tsx
<FormContainer variant="default" maxWidth="xl">
  <FormHeader variant="colored" title="Checkout" />
  <Button variant="green">Complete Order</Button>
  // Professional, trustworthy
```

## 💡 **Pro Tips**

1. **Consistent Theme**: Pick one variant set and stick with it
2. **Color Psychology**: 
   - Blue = Trust, professional
   - Green = Success, go/proceed  
   - Yellow = Attention, waitlist
   - Red = Urgent, delete/cancel
3. **Size Guidelines**:
   - Contact forms: `maxWidth="md"`
   - Booking forms: `maxWidth="lg"` or `maxWidth="xl"`
   - Complex forms: `maxWidth="2xl"`

4. **Custom Classes**: Always add custom classes after the variant for overrides
