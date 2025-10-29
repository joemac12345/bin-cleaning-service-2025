'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

// Base Form Container
interface FormContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'modern' | 'minimal';
  fullWidthOnMobile?: boolean;
  className?: string;
}

export function FormContainer({ children, maxWidth = '2xl', variant = 'default', fullWidthOnMobile = false, className = '' }: FormContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  const variantClasses = {
    default: 'rounded-2xl shadow-xl',
    modern: 'rounded-3xl shadow-2xl border border-gray-100',
    minimal: 'rounded-lg shadow-md border border-gray-200'
  };

  // Mobile full-width logic - make it truly full width but allow natural height with better spacing
  const responsiveClasses = fullWidthOnMobile 
    ? `w-full min-h-screen md:${maxWidthClasses[maxWidth]} md:h-auto mx-0 md:mx-auto rounded-none md:rounded-2xl flex flex-col px-6 py-8 md:px-8 md:py-8`
    : `${maxWidthClasses[maxWidth]} mx-auto px-6 py-8`;

  // Adjust variant classes for mobile full-width - remove all styling completely
  const mobileVariantClasses = fullWidthOnMobile 
    ? 'bg-transparent shadow-none border-none rounded-none'
    : variantClasses[variant];

  return (
    <div className={`${responsiveClasses} ${mobileVariantClasses} overflow-hidden bg-transparent shadow-none border-none ${className}`}>
      {children}
    </div>
  );
}

// Form Header
interface FormHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  variant?: 'dark' | 'light' | 'gradient' | 'colored';
  children?: React.ReactNode;
}

export function FormHeader({ title, subtitle, onBack, variant = 'dark', children }: FormHeaderProps) {
  const variantClasses = {
    dark: 'bg-black text-white',
    light: 'bg-gray-50 text-gray-900 border-b border-gray-200',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
    colored: 'bg-blue-600 text-white'
  };

  const buttonHoverClasses = {
    dark: 'hover:bg-gray-800',
    light: 'hover:bg-gray-200 text-gray-600',
    gradient: 'hover:bg-white/20',
    colored: 'hover:bg-blue-700'
  };

  const subtitleClasses = {
    dark: 'text-gray-300',
    light: 'text-gray-600',
    gradient: 'text-blue-100',
    colored: 'text-blue-100'
  };

  return (
    <div className={`${variantClasses[variant]} p-6`}>
      <div className="flex items-center space-x-4">
        {onBack && (
          <button 
            onClick={onBack}
            className={`p-2 ${buttonHoverClasses[variant]} rounded-full transition-colors`}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className={subtitleClasses[variant]}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// Progress Indicator
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressIndicator({ currentStep, totalSteps, className = 'mt-6' }: ProgressIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {steps.map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step <= currentStep ? 'bg-white text-black' : 'bg-gray-600 text-gray-300'
          }`}>
            {step}
          </div>
          {step < totalSteps && (
            <div className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-white' : 'bg-gray-600'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// Form Content
interface FormContentProps {
  children: React.ReactNode;
  className?: string;
}

export function FormContent({ children, className = '' }: FormContentProps) {
  return (
    <div className={`${className} flex-1 flex flex-col`}>
      {children}
    </div>
  );
}

// Form Section
interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, children, className = 'space-y-6' }: FormSectionProps) {
  return (
    <div className={className}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
}

// Input Field
interface InputFieldProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export function InputField({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  className = '',
  disabled = false 
}: InputFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed placeholder:text-xs placeholder:text-gray-400"
      />
    </div>
  );
}

// Textarea Field
interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function TextareaField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  rows = 3,
  className = '' 
}: TextareaFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none placeholder:text-xs placeholder:text-gray-400"
      />
    </div>
  );
}

// Select Field
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function SelectField({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder,
  required = false,
  className = '' 
}: SelectFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Button
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline' | 'yellow' | 'blue' | 'green' | 'red' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-300',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-100',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-50',
    yellow: 'bg-yellow-500 text-white hover:bg-yellow-600 disabled:bg-gray-300',
    blue: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300',
    green: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300',
    red: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:bg-gray-300'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Button Group
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  withBackground?: boolean;
  withDivider?: boolean;
  stickyBottom?: boolean;
}

export function ButtonGroup({ children, className = 'flex space-x-3', withBackground = false, withDivider = false, stickyBottom = false }: ButtonGroupProps) {
  const backgroundClass = ''; // Remove background completely
  const dividerClass = withDivider ? 'border-t border-gray-200 pt-4 mt-6' : '';
  const stickyClass = stickyBottom ? 'mt-auto sticky bottom-0 md:static' : '';
  
  return (
    <div className={`${dividerClass} ${backgroundClass} ${stickyClass}`}>
      <div className={className}>
        {children}
      </div>
    </div>
  );
}
