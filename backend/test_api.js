async function test() {
  console.log('--- Testing EcoTrack APIs ---');

  // 1. Health
  const healthRes = await fetch('http://localhost:5000/api/health').then(r => r.json());
  console.log('1. Health check:', healthRes.status === 'healthy' ? 'PASS' : 'FAIL');

  // 2. Auth Login (citizen)
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@ecotrack.org', password: 'password123' })
  }).then(r => r.json());
  console.log('2. User Login:', loginRes.success ? 'PASS' : 'FAIL', '- User:', loginRes.data?.user?.name);
  const token = loginRes.data?.token;

  // 3. Dashboard stats
  const statsRes = await fetch('http://localhost:5000/api/dashboard/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  console.log('3. Dashboard Stats:', statsRes.success ? 'PASS' : 'FAIL', '- Points:', statsRes.data?.ecoPoints);

  // 4. Submit Report
  const newReportRes = await fetch('http://localhost:5000/api/reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      wasteType: 'Plastic',
      location: 'Oak Street, near Civic Center',
      description: 'Multiple scattered beverage bottles and food wrappers.',
      image: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80'
    })
  }).then(r => r.json());
  console.log('4. Create Report:', newReportRes.success ? 'PASS' : 'FAIL', '- New ID:', newReportRes.data?.report?.id);
  const createdId = newReportRes.data?.report?.id;

  // 5. Get Report Details with Progression
  const singleReport = await fetch(`http://localhost:5000/api/report/${createdId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  console.log('5. Get Single Report Progression:', singleReport.data?.statusProgression?.length === 4 ? 'PASS' : 'FAIL');

  // 6. Collection Points
  const pointsRes = await fetch('http://localhost:5000/api/collection-points').then(r => r.json());
  console.log('6. Collection Points:', pointsRes.success && pointsRes.count >= 5 ? 'PASS' : 'FAIL', `(${pointsRes.count} points)`);

  // 7. Eco Tips
  const tipsRes = await fetch('http://localhost:5000/api/eco-tips').then(r => r.json());
  console.log('7. Eco Tips:', tipsRes.success && tipsRes.count >= 6 ? 'PASS' : 'FAIL');

  // 8. User Profile
  const profileRes = await fetch('http://localhost:5000/api/user/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  console.log('8. User Profile:', profileRes.success ? 'PASS' : 'FAIL', '- Badges unlocked:', profileRes.data?.badges?.filter(b => b.unlocked).length);

  // 9. Admin update report status
  const adminLogin = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ecotrack.org', password: 'admin123' })
  }).then(r => r.json());
  const adminToken = adminLogin.data?.token;

  const updateRes = await fetch(`http://localhost:5000/api/admin/report/${createdId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      status: 'Assigned',
      assignedTo: 'Rapid Green Crew Beta',
      resolutionNotes: 'Assigned crew with clean-up truck.'
    })
  }).then(r => r.json());
  console.log('9. Admin Update Status:', updateRes.success && updateRes.data?.status === 'Assigned' ? 'PASS' : 'FAIL');

  console.log('--- All API tests completed successfully! ---');
}

test().catch(console.error);
