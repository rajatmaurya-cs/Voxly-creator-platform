import { apiFetch } from '@/lib/apiFetch'
import Plans from './plans'
import React from 'react'

const Page = async () => {
  let plans = [];
  try {
    const res = await apiFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/plan/getplans`,
      {
        next: {
          revalidate: 300, // 5 minutes
        },
      }
    );
    if (res.ok) {
      const result = await res.json();
      plans = result.data || [];
    }
  } catch (err) {
    console.error("Failed to fetch plans:", err);
  }

  return (
    <Plans dbPlans={plans} />
  )
}

export default Page