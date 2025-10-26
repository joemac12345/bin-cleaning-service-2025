import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Netlify-compatible file path
const ABANDONED_FORMS_FILE = path.join(process.cwd(), 'data', 'abandoned-forms.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(ABANDONED_FORMS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read abandoned forms from file
async function readAbandonedForms() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(ABANDONED_FORMS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return [];
  }
}

// Write abandoned forms to file
async function writeAbandonedForms(forms: any[]) {
  await ensureDataDirectory();
  await fs.writeFile(ABANDONED_FORMS_FILE, JSON.stringify(forms, null, 2));
}

// POST - Save abandoned form data
export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate that there's at least some meaningful data
    const hasData = formData.firstName || formData.email || formData.phone || formData.address ||
                    Object.values(formData.binQuantities || {}).some((qty: any) => qty > 0);
    
    if (!hasData) {
      return NextResponse.json(
        { success: false, error: 'No meaningful form data to save' },
        { status: 400 }
      );
    }
    
    // Create abandoned form entry
    const abandonedForm = {
      id: `ABN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionId: formData.sessionId || `session-${Date.now()}`,
      postcode: formData.postcode,
      formData: {
        ...formData,
        // Remove sensitive data that shouldn't be stored
        sessionId: undefined
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'abandoned',
      completionPercentage: calculateCompletionPercentage(formData),
      potentialValue: calculatePotentialValue(formData.binQuantities || {}),
      contactInfo: {
        hasEmail: !!formData.email,
        hasPhone: !!formData.phone,
        hasName: !!(formData.firstName || formData.lastName)
      }
    };
    
    // Read existing forms
    const abandonedForms = await readAbandonedForms();
    
    // Check if we already have an entry for this session
    const existingIndex = abandonedForms.findIndex((form: any) => form.sessionId === abandonedForm.sessionId);
    
    if (existingIndex >= 0) {
      // Update existing entry
      abandonedForms[existingIndex] = {
        ...abandonedForms[existingIndex],
        ...abandonedForm,
        lastUpdated: new Date().toISOString()
      };
    } else {
      // Add new entry
      abandonedForms.push(abandonedForm);
    }
    
    // Keep only the last 1000 entries to prevent file from growing too large
    if (abandonedForms.length > 1000) {
      abandonedForms.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      abandonedForms.splice(1000);
    }
    
    // Save updated forms
    await writeAbandonedForms(abandonedForms);
    
    return NextResponse.json({
      success: true,
      message: 'Form data saved for remarketing',
      formId: abandonedForm.id
    });
  } catch (error) {
    console.error('Error saving abandoned form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save form data' },
      { status: 500 }
    );
  }
}

// GET - Retrieve abandoned forms for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const status = searchParams.get('status');
    
    let abandonedForms = await readAbandonedForms();
    
    // Filter by status if provided
    if (status) {
      abandonedForms = abandonedForms.filter((form: any) => form.status === status);
    }
    
    // Sort by creation date (newest first)
    abandonedForms.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Apply limit if provided
    if (limit) {
      abandonedForms = abandonedForms.slice(0, parseInt(limit));
    }
    
    return NextResponse.json({
      success: true,
      forms: abandonedForms,
      total: abandonedForms.length,
      stats: generateStats(abandonedForms)
    });
  } catch (error) {
    console.error('Error fetching abandoned forms:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch abandoned forms' },
      { status: 500 }
    );
  }
}

// PATCH - Update abandoned form status (e.g., mark as contacted, converted, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const { formId, status, notes } = await request.json();
    
    if (!formId || !status) {
      return NextResponse.json(
        { error: 'Form ID and status are required' },
        { status: 400 }
      );
    }
    
    const abandonedForms = await readAbandonedForms();
    const formIndex = abandonedForms.findIndex((form: any) => form.id === formId);
    
    if (formIndex === -1) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }
    
    // Update the form
    abandonedForms[formIndex] = {
      ...abandonedForms[formIndex],
      status,
      notes: notes || abandonedForms[formIndex].notes,
      lastUpdated: new Date().toISOString()
    };
    
    await writeAbandonedForms(abandonedForms);
    
    return NextResponse.json({
      success: true,
      message: 'Form status updated successfully'
    });
  } catch (error) {
    console.error('Error updating abandoned form:', error);
    return NextResponse.json(
      { error: 'Failed to update form status' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateCompletionPercentage(formData: any): number {
  const fields = [
    'firstName', 'lastName', 'email', 'phone', 'address', 
    'serviceType', 'paymentMethod'
  ];
  
  let completed = 0;
  fields.forEach(field => {
    if (formData[field]) completed++;
  });
  
  // Check bin selection
  if (formData.binQuantities && Object.values(formData.binQuantities).some((qty: any) => qty > 0)) {
    completed++;
  }
  
  return Math.round((completed / (fields.length + 1)) * 100);
}

function calculatePotentialValue(binQuantities: Record<string, number>): number {
  const BIN_PRICES = {
    wheelie: 5,
    food: 3,
    recycling: 4,
    garden: 6
  };
  
  let total = 0;
  Object.entries(binQuantities).forEach(([binType, quantity]) => {
    if (BIN_PRICES[binType as keyof typeof BIN_PRICES]) {
      total += BIN_PRICES[binType as keyof typeof BIN_PRICES] * quantity;
    }
  });
  
  return total;
}

function generateStats(forms: any[]) {
  const total = forms.length;
  const withEmail = forms.filter(f => f.contactInfo.hasEmail).length;
  const withPhone = forms.filter(f => f.contactInfo.hasPhone).length;
  const highValue = forms.filter(f => f.potentialValue >= 20).length;
  const avgCompletion = forms.reduce((sum, f) => sum + f.completionPercentage, 0) / total || 0;
  
  return {
    total,
    withEmail,
    withPhone,
    withContact: forms.filter(f => f.contactInfo.hasEmail || f.contactInfo.hasPhone).length,
    highValue,
    averageCompletion: Math.round(avgCompletion),
    totalPotentialValue: forms.reduce((sum, f) => sum + f.potentialValue, 0)
  };
}
