import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface Cat {
  id: number;
  name: string;
  age: number | null;
  created_at: string;
}

export async function GET() {
  try {
    const result = await query('SELECT id, name, age, created_at FROM cats ORDER BY created_at DESC');
    const cats = result.rows as Cat[];
    return NextResponse.json(cats);
  } catch (error) {
    console.error('Error fetching cats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cats' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    let ageValue: number | null = null;
    if (age !== undefined && age !== null) {
      ageValue = parseInt(age, 10);
      if (isNaN(ageValue)) {
        return NextResponse.json(
          { error: 'Age must be a number' },
          { status: 400 }
        );
      }
    }

    const result = await query(
      'INSERT INTO cats (name, age) VALUES ($1, $2) RETURNING id, name, age, created_at',
      [name.trim(), ageValue]
    );

    const cat = result.rows[0] as Cat;
    return NextResponse.json(cat, { status: 201 });
  } catch (error) {
    console.error('Error creating cat:', error);
    return NextResponse.json(
      { error: 'Failed to create cat' },
      { status: 500 }
    );
  }
}
